namespace Services
{
    using Services.Models;

    public interface IStockPriceService
    {
        Stock GetStock (string stockCode);
    }
}