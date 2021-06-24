using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Services;

namespace WebApp.Hubs
{
    internal class StockTickerCallback : IStockTickerCallback
    {
        private readonly IClientProxy _proxy;

        public StockTickerCallback(IClientProxy proxy)
        {
            _proxy = proxy;
        }

        public async Task OnMessageArrived(string message) {
            await _proxy?.SendAsync("OnMessageArrived", message);
        }
    }
}
