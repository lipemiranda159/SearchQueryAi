using QueryAiSearch.Api.Models;
using System.Text.Json;

namespace QueryAiSearch.Api.Services
{
    public class QuerySearchService
    {
        private readonly IConfiguration _config;
        private readonly GeminiService _gemini;
        private List<EmbeddingVector> _queries;

        public QuerySearchService(GeminiService gemini, IConfiguration config)
        {
            _gemini = gemini;
            _config = config;

            var path = _config["EmbeddingFile"] ?? "./data/queries_vectors.json";
            var json = File.ReadAllText(path);
            _queries = JsonSerializer.Deserialize<List<EmbeddingVector>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;
        }

        public async Task<QueryInfo> GetClosestQueryAsync(string userMessage)
        {
            var inputEmbedding = await _gemini.GetEmbeddingAsync(userMessage);
            var nearest = VectorSearch.FindNearest(inputEmbedding, _queries);

            return new QueryInfo
            {
                Id = nearest.Id,
                Name = nearest.Name,
                Query = nearest.Query,
                Description = nearest.Description,
                //Tags = string.Join(", ", nearest.Tags),
                Score = nearest.Score
            };
        }
    }
}
