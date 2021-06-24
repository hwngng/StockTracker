using System;
using System.Collections.Generic;
namespace Services
{
    using System.Collections.Generic;
    using Services.Models;
    using Services.Common;
    using System.Linq;

    public class StockHistoryService : IStockHistoryService
    {
        private Dictionary<string, List<StockPriceHistory>> _histories;
        private StockTickerContext _dbContext;
        private DateTime _oldestDate;

        public StockHistoryService(StockTickerContext stockTickerContext, DateTime oldestDate) {
            _oldestDate = oldestDate;
            _dbContext = stockTickerContext;
            RetreiveHistory();
        }

        private void RetreiveHistory () {
            _histories = _dbContext.StockPriceHistories.Where(history => history.Date >= _oldestDate)
                                            .OrderBy(history => history.StockCode)
                                            .ThenBy(history => history.Date)
                                            .AsEnumerable()
                                            .GroupBy(history => history.StockCode)
                                            .ToDictionary(g => g.Key, g => g.ToList());
        }

        public List<StockPriceHistory> GetStockPriceHistories(string stockCode) {
            if (_histories.ContainsKey(stockCode)) {
                return _histories[stockCode];
            } else {
                return new List<StockPriceHistory>();
            }
        }

        public ApiResult<string> InsertStockPriceHistories(StockPriceHistory stockPriceHistory) {

            return new ApiResult<string>();
        }
    }
}