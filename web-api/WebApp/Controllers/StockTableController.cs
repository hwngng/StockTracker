namespace WebApp.Controllers
{
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc;
    using Services;
    using Services.Models;

    [Route("api/stock")]
    [ApiController]
    public class StockTableController : ControllerBase
    {
        private readonly IStockTickerService dataProvider;

        public StockTableController(IStockTickerService marketDataProvider)
        {
            this.dataProvider = marketDataProvider;
        }
        
        [HttpGet("snapshot")]
        public List<string> GetSnapshot ([FromQuery] List<string> stockCodes) {
            return this.dataProvider.GetSnapshot(stockCodes);
        }
    }
}