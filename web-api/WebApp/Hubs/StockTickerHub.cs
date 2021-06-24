using Microsoft.AspNetCore.SignalR;
using Services;
using System;
using System.Threading.Tasks;

namespace WebApp.Hubs
{
    public class StockTickerHub : Hub
    {
        private readonly IStockTickerService _stockTicker;

        public StockTickerHub(IStockTickerService stockTicker)
        {
            _stockTicker = stockTicker;
        }

        public override Task OnConnectedAsync()
        {
            _stockTicker.Callback = new StockTickerCallback(Clients.All);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _stockTicker.Callback = new StockTickerCallback(Clients.All);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
