using Blip.QueryAiSearch.Api.Models;
using Blip.QueryAiSearch.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blip.QueryAiSearch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuerySearchController : ControllerBase
    {
        private readonly QuerySearchService _searchService;
        private readonly GeminiService _geminiService;

        public QuerySearchController(QuerySearchService searchService, GeminiService geminiService)
        {
            _searchService = searchService;
            _geminiService = geminiService;
        }

        [HttpPost]
        public async Task<IActionResult> SearchQuery([FromBody] QuerySearchRequest request)
        {
            var result = await _searchService.GetClosestQueryAsync(request.Message);

            if (request.ExplainWithGemini || request.AdaptWithGemini)
            {
                result.GeminiResult = await _geminiService.GetExplanationAsync(
                    request.Message,
                    result.Query,
                    request.AdaptWithGemini
                );
            }

            return Ok(result);
        }
    }
}
