namespace Services.Models
{
    using System.Collections.Generic;

    public class AlertResult
    {
        public List<string> HighestInRange { get; set; }

        public List<string> LowestInRange { get; set; }

        public List<string> PriceTrendPattern { get; set; }

        public Dictionary<string, List<string>> TASignals { get; set; }
    }
}