namespace WebApp.Controllers
{
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc;
    using Services;
    using Services.Models;
    using System.Diagnostics;

    [Route("api/stock")]
    [ApiController]
    public class StockAlertController : ControllerBase
    {
        private readonly IStockAlertService _alertService;

        public StockAlertController(IStockAlertService alertService)
        {
            this._alertService = alertService;
        }

        [HttpPost("alert")]
        public AlertResult GetAlert ([FromBody] AlertOption alertOption) {
            if (alertOption.PriceTrendPattern is null) {
                alertOption.PriceTrendPattern = new List<PriceTrend>();
            }
            if (alertOption.TASignals is null) {
                alertOption.TASignals = new Dictionary<string, TASignalCondition>();
            }
            return this._alertService.GetAlertResult(alertOption);
        }
    }
}