using System.Collections.Generic;
namespace Services.Models
{
    public class AlertOption
    {
        public DateRange HighestInRange { get; set; }

        public DateRange LowestInRange { get; set; }

        public List<PriceTrend> PriceTrendPattern { get; set; }

        public Dictionary<string, TASignalCondition> TASignals { get; set; }
    
        public List<string> StockCodes { get; set; }
    }
}