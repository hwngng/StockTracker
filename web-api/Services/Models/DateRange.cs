using System;
namespace Services.Models
{
    public class DateRange
    {
        private DateTime _fromDate = DateTime.MinValue;

        private DateTime _toDate = DateTime.MaxValue;

        public DateTime FromDate { get { return _fromDate; } set { _fromDate = value; } }

        public DateTime ToDate { get { return _toDate; } set { _toDate = value; } }
    }
}