namespace Services.Models
{
    public class SBA : Message
    {
        public string Symbol { get; set; }				// code

		public string StockType { get; set; }			// stockType

		public decimal BidPrice01 { get; set; }

        public long BidQuantity01 { get; set; }
		
		public decimal BidPrice02 { get; set; }

        public long BidQuantity02 { get; set; }
		
		public decimal BidPrice03 { get; set; }

        public long BidQuantity03 { get; set; }
		
		public decimal BidPrice04 { get; set; }

        public long BidQuantity04 { get; set; }
		
		public decimal BidPrice05 { get; set; }

        public long BidQuantity05 { get; set; }
		
		public decimal BidPrice06 { get; set; }

        public long BidQuantity06 { get; set; }
		
		public decimal BidPrice07 { get; set; }

        public long BidQuantity07 { get; set; }
		
		public decimal BidPrice08 { get; set; }

        public long BidQuantity08 { get; set; }
		
		public decimal BidPrice09 { get; set; }

        public long BidQuantity09 { get; set; }
		
		public decimal BidPrice10 { get; set; }

        public long BidQuantity10 { get; set; }
    }
}