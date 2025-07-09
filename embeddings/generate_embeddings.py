import os
import json
import faiss
import hashlib
import dotenv
import git
import numpy as np
import google.generativeai as genai
from pathlib import Path
from urllib.parse import quote

# === Configs ===
dotenv.load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

EMBED_DIM = 768
CLONE_DIR = "./git/clone"
# QUERY_DIR = os.path.join(CLONE_DIR, "queries")
QUERY_DIR = "./queries"
INDEX_FILE = "./data/queries.index"
METADATA_FILE = "./data/queries_metadata.json"
HASHES_FILE = "./data/file_hashes.json"
VECTORS_FILE = "./data/queries_vectors.json"

# === Helpers ===
def get_authenticated_repo_url():
    base = os.getenv("AZURE_REPO_URL")
    token = quote(os.getenv("AZURE_PAT"))
    return base.replace("https://", f"https://{token}@")

def hash_file(path: Path) -> str:
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def get_embedding(text: str) -> list:
    model_name = "models/embedding-001"
    response = genai.embed_content(
        model=model_name,
        content=text,
        task_type="retrieval_document"
    )
    return response["embedding"]

def extract_metadata_and_content(filepath: Path):
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    metadata = {"name": filepath.name, "tags": [], "description": ""}
    content_lines = []

    for line in lines:
        if line.startswith("--"):
            line = line[2:].strip()
            if line.startswith("tags:"):
                metadata["tags"] = [tag.strip() for tag in line[5:].split(",")]
            elif line.startswith("description:"):
                metadata["description"] = line[12:].strip()
        else:
            content_lines.append(line)

    full_text = f"{metadata['name']} - {metadata['description']} - {' '.join(content_lines)}"
    return metadata, full_text

def load_hashes():
    if not os.path.exists(HASHES_FILE):
        return {}
    with open(HASHES_FILE, "r") as f:
        return json.load(f)

def save_hashes(hashes):
    with open(HASHES_FILE, "w") as f:
        json.dump(hashes, f, indent=2)

# === Execução principal ===
def main():
    os.makedirs("./data", exist_ok=True)

    # if os.path.exists(CLONE_DIR):
    #     print("🔄 Atualizando repositório...")
    #     repo = git.Repo(CLONE_DIR)
    #     repo.remotes.origin.pull()
    # else:
    #     print("📥 Clonando repositório...")
    #     git.Repo.clone_from(get_authenticated_repo_url(), CLONE_DIR)

    old_hashes = load_hashes()
    new_hashes = {}
    metadata_list = []
    vectors = []

    query_files = list(Path(QUERY_DIR).glob("*.sql"))
    if not query_files:
        print("⚠️ Nenhuma query encontrada em ./queries/")
        return

    for i, path in enumerate(query_files):
        file_hash = hash_file(path)
        new_hashes[str(path)] = file_hash

        if old_hashes.get(str(path)) == file_hash:
            print(f"[=] Sem mudanças: {path.name}")
            continue

        print(f"[+] Atualizando: {path.name}")
        metadata, full_text = extract_metadata_and_content(path)
        embedding = get_embedding(full_text)

        metadata["id"] = i
        metadata["filepath"] = str(path)
        metadata_list.append(metadata)
        vectors.append(embedding)

    if vectors:
        index = faiss.IndexFlatL2(EMBED_DIM)
        index.add(np.array(vectors).astype("float32"))
        faiss.write_index(index, INDEX_FILE)

        with open(METADATA_FILE, "w") as f:
            json.dump(metadata_list, f, indent=2)

        vectors_payload = []
        for i, meta in enumerate(metadata_list):
            vectors_payload.append({
                "id": meta["id"],
                "name": meta["name"],
                "description": meta["description"],
                "tags": meta["tags"],
                "query": Path(meta["filepath"]).read_text(encoding="utf-8"),
                "embedding": vectors[i]
            })

        with open(VECTORS_FILE, "w") as f:
            json.dump(vectors_payload, f, indent=2)

        print(f"✅ Index e vectors atualizados com {len(vectors)} novas queries.")
    else:
        print("🔍 Nenhuma alteração detectada. Index preservado.")


    save_hashes(new_hashes)

if __name__ == "__main__":
    main()
