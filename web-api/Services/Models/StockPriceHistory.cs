using System;
using System.Collections.Generic;

#nullable disable

namespace Services.Models
{
    public partial class StockPriceHistory
    {
        public string StockCode { get; set; }
        public DateTime Date { get; set; }
        public decimal? OpenPrice { get; set; }
        public decimal? HighPrice { get; set; }
        public decimal? LowPrice { get; set; }
        public decimal? ClosePrice { get; set; }
        public long? Volume { get; set; }
        public long? VolumeForeignBuy { get; set; }
        public long? VolumeForeignSell { get; set; }
    }
}
