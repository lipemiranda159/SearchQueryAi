namespace QueryAiSearch.Api.Models
{
    public class QuerySearchRequest
    {
        public string Message { get; set; }
        public bool ExplainWithGemini { get; set; }
        public bool AdaptWithGemini { get; set; }
    }
}
