namespace QueryAiSearch.Api.Models
{
    public class EmbeddingVector
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Query { get; set; }
        public string Description { get; set; }
        public List<float> Embedding { get; set; }
        public float Score { get; set; }
        public string[] Tags { get; set; }
    }
}
