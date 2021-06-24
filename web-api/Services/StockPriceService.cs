using System.Collections.Generic;
using System;
using Services.Models;
namespace Services
{
    public class StockPriceService : IStockPriceService, IObserver<string>
    {
        private IDataSource _dataProvider;

        private Dictionary<string, Stock> _stocks;

        public StockPriceService(IDataSource dataSource) {
            _dataProvider = dataSource;
            _dataProvider.Subscribe(this);
            _stocks = new Dictionary<string, Stock>();
        }

        public void OnNext (string data) {
            var sep = '|';
            var fields = data.Split(sep);

            if (fields.Length >= 10) {
                var msgType = fields[0];
                var stockCode = fields[2];

                if (msgType == "SMA") {
                    if (!_stocks.ContainsKey(stockCode)) {
                        _stocks.Add(stockCode, new Stock());
                    }
                    _stocks[stockCode].MatchPrice = Decimal.Parse(fields[10]);
                }
            }
        }

        public Stock GetStock(string stockCode) {
            if (_stocks.ContainsKey(stockCode)) {
                return _stocks[stockCode];
                // return new Stock() { MatchPrice = -99999999 };
            }
            else {
                return null;
                // return new Stock() { MatchPrice = -99999999 };
            }
        }

        public void OnCompleted () { }

        public void OnError (Exception e) {}
    }
}