namespace Services.Models
{
    using System.Collections.Generic;
    
    public interface ITechnicalIndicator
    {
        List<object> GetTechnicalIndicatorValues (string stockCode);
    }
}