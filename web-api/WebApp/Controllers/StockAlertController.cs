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
        public AlertResult GetSnapshot ([FromBody] AlertOption alertOption) {
            Debug.WriteLine(alertOption);
            return this._alertService.GetAlertResult(alertOption);
        }
    }
}