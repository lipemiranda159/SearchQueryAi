using QueryAiSearch.Api.Models;

namespace QueryAiSearch.Api.Services
{
    public static class VectorSearch
    {
        public static EmbeddingVector FindNearest(List<float> messageEmbedding, List<EmbeddingVector> queries)
        {
            var inputVec = messageEmbedding;

            var best = queries
                .Select(q => new
                {
                    Query = q,
                    Score = CosineSimilarity(inputVec, q.Embedding)
                })
                .OrderByDescending(x => x.Score)
                .First();

            best.Query.Score = best.Score;

            return best.Query;
        }

        public static float CosineSimilarity(List<float> a, List<float> b)
        {
            float dot = 0f, normA = 0f, normB = 0f;

            for (int i = 0; i < a.Count; i++)
            {
                dot += a[i] * b[i];
                normA += a[i] * a[i];
                normB += b[i] * b[i];
            }

            return dot / (float)(Math.Sqrt(normA) * Math.Sqrt(normB));
        }
    }
}
