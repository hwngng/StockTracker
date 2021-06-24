using System.Threading.Tasks;

namespace Services
{
    public interface IStockTickerCallback
    {
        Task OnMessageArrived(string message);
    }
}
