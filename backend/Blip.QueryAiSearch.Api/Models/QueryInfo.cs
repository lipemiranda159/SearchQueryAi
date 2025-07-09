namespace Blip.QueryAiSearch.Api.Models
{
    public class QueryInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<string> Tags { get; set; }
        public string Description { get; set; }
        public string Query { get; set; }
        public float Score { get; set; }
        public string GeminiResult { get; set; }
    }
}
