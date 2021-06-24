namespace Services
{
    using Services.Models;

    public interface IStockAlertService
    {
        AlertResult GetAlertResult (AlertOption alertOption);    
    }
}