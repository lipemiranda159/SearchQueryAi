using System.Text.Json;

namespace QueryAiSearch.Api.Services
{
    public class GeminiService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public GeminiService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        public async Task<string> GetExplanationAsync(string userMessage, string query, bool adapt)
        {
            var prompt = adapt
                ? $"Adapte a query abaixo para o seguinte objetivo: {userMessage}\n\nQuery:\n{query}"
                : $"Explique a query abaixo em linguagem natural:\n\nQuery:\n{query}";

            //var body = new
            //{
            //    contents = new[]
            //    {
            //        new { parts = new[] { new { text = prompt } }, role = "user" }
            //    }
            //};
            var body = new
            {
                prompt = new
                {
                    messages = new[]
                    {
                        new { author = "user", content = prompt }
                    }
                },
                temperature = 0.7
            };


            //var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_config["Gemini:ApiKey"]}";
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/chat-bison-001:generateMessage?key={_config["Gemini:ApiKey"]}";

            var req = await _http.PostAsJsonAsync(url, body);
            var result = await req.Content.ReadFromJsonAsync<JsonElement>();

            //return result.GetProperty("candidates")[0]
            //             .GetProperty("content")
            //             .GetProperty("parts")[0]
            //             .GetProperty("text").GetString();

            return result.GetProperty("candidates")[0]
             .GetProperty("content")
             .GetString();
        }

        public async Task<List<float>> GetEmbeddingAsync(string input)
        {
            var apiKey = _config["Gemini:ApiKey"];
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={apiKey}";

            var payload = new
            {
                model = "models/embedding-001",
                content = new { parts = new[] { new { text = input } } },
                task_type = "retrieval_document"
            };

            var response = await _http.PostAsJsonAsync(url, payload);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();

            return json.GetProperty("embedding")
           .GetProperty("values")
           .EnumerateArray()
           .Select(e => e.GetSingle())
           .ToList();
        }
    }
}
