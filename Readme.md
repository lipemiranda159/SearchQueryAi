# QuerySearchAI 🧠

Sistema inteligente para busca e reuso de consultas SQL via linguagem natural, integrando IA com versionamento de código e repositórios SQL.

## ✨ Visão Geral

O projeto resolve um problema comum em times de suporte e desenvolvimento distribuído: a fragmentação de queries SQL.  
Com uma interface intuitiva, o usuário pode descrever o que precisa, e a IA retorna a consulta mais aderente disponível no repositório.

Além disso, é possível subir novas queries via front-end, que são automaticamente enviadas como Pull Requests para um repositório central.

## ⚙️ Arquitetura

- **Frontend**: React + Vite (interface em formato de chat)
- **API**: .NET Core (consulta vetores e retorna a query mais relevante)
- **Vetorização**: Python (Gemini + FAISS), com hash para evitar retrabalho
- **Versionamento**: Azure DevOps, com repositório monitorado para mudanças

![Fluxo da Arquitetura](docs/architecture.png) <!-- Se tiver imagem -->

## 📁 Estrutura
```
querysearchai/
│
├── backend/ # API em .NET Core
│ ├── src/ # Código-fonte da API
│ └── README.md # Instruções específicas da API
│
├── frontend/ # Front-end em React + Vite
│ ├── src/
│ └── README.md # Instruções específicas do front
│
├── embeddings/ # Script Python para gerar vetores
│ ├── generate_embeddings.py
│ └── requirements.txt # Dependências do script
│
├── .gitignore
├── README.md # Descrição geral do projeto
```

## 🚀 Como rodar

### 1. Gerar embeddings (Python)

```bash
cd embeddings
pip install -r requirements.txt
python generate_embeddings.py
```
### 2. Rodar api .net core
```
cd backend
dotnet run
```

### 3. Rodar front
```
cd frontend
npm install
npm run dev
```

### 💡 Futuro

- Integração com api para recuperação de query

- Integração ao CI do Azure DevOps para regenerar vetores automaticamente a cada novo PR
