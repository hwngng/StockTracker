using System.Security.Principal;
namespace Services
{
    using System;
    using System.Collections.Generic;

    public class StockTickerService : IObserver<string>, IStockTickerService
    {
        private IDataSource _dataSource;
        public IStockTickerCallback Callback { get; set; }

        public StockTickerService (IDataSource dataSource) {
            _dataSource = dataSource;
            _dataSource.Subscribe(this);
            _dataSource.StartFetchingData();
        }

        public void OnCompleted () { }

        public void OnError (Exception e) { }

        public void OnNext (string data) {
            this.Callback?.OnMessageArrived(data);
        }

        public List<string> GetSnapshot (List<string> stockCodes) {
            var snapshots = this._dataSource.GetSnapshot(stockCodes);

            return snapshots;
        }
 
    }
}