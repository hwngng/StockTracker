namespace Services
{
    using Services.Models;
    using Services.Common;
    using System.Collections.Generic;

    public interface IStockHistoryService
    {
         List<StockPriceHistory> GetStockPriceHistories (string stockCode);

         ApiResult<string> InsertStockPriceHistories (StockPriceHistory stockPriceHistory);
    }
}