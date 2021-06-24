namespace Services
{
    using System.Collections.Generic;

    public interface IStockTickerService
    {
        IStockTickerCallback Callback { get; set; }

        List<string> GetSnapshot (List<string> stockCodes);
    }
}