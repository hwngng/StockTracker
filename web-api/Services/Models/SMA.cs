using System.Linq;
using System.Collections.Generic;
namespace Services.Models
{
    public class SMA : ITechnicalIndicator
    {
        private int _days;
        private IStockHistoryService _stockHistoryService;

        public SMA (int days, IStockHistoryService stockHistoryService) {
            _days = days;
            _stockHistoryService = stockHistoryService;
        }

        public List<object> GetTechnicalIndicatorValues (string stockCode) {
            var data = _stockHistoryService.GetStockPriceHistories(stockCode);
            var result = new List<object>();

            if (data.Count >= _days) {
                var currentSma = data.GetRange(data.Count - _days, _days).Sum(history => history.ClosePrice).Value;
                result.Add(currentSma);
            }

            return result;
        }
    }
}