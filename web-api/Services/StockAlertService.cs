using System.Collections.Generic;
using System;
namespace Services
{
	using Services.Models;
	using System.Collections.Generic;

	public class StockAlertService : IStockAlertService
	{
		IStockHistoryService _stockHistoryProvider;

		IStockPriceService _stockPriceProvider;

		public StockAlertService(IStockHistoryService stockHistoryService, IStockPriceService stockPriceService)
		{
			_stockHistoryProvider = stockHistoryService;
			_stockPriceProvider = stockPriceService;
		}

		private List<string> HighestInRange(DateRange range, List<string> stockCodes)
		{
			var result = new List<string>();

			foreach (var stockCode in stockCodes)
			{
				var history = _stockHistoryProvider.GetStockPriceHistories(stockCode);
				bool isHighest = true;
				var stock = _stockPriceProvider.GetStock(stockCode);
				if (!(stock is null))
				{
					var currentPrice = stock.MatchPrice;

					for (var i = history.Count - 1; i >= 0 && history[i].Date >= range.FromDate; --i)
					{
						if (history[i].Date <= range.ToDate)
						{
							if (history[i].ClosePrice >= currentPrice)
							{
								isHighest = false;
								break;
							}
						}
					}

					if (isHighest)
					{
						result.Add(stockCode);
					}
				}
			}

			return result;
		}

		private List<string> LowestInRange(DateRange range, List<string> stockCodes)
		{
			var result = new List<string>();

			foreach (var stockCode in stockCodes)
			{
				var history = _stockHistoryProvider.GetStockPriceHistories(stockCode);
				bool isLowest = true;
				var stock = _stockPriceProvider.GetStock(stockCode);
				if (!(stock is null))
				{
					var currentPrice = stock.MatchPrice;

					for (var i = history.Count - 1; i >= 0 && history[i].Date >= range.FromDate; --i)
					{
						if (history[i].Date <= range.ToDate)
						{
							if (history[i].ClosePrice <= currentPrice)
							{
								isLowest = false;
								break;
							}
						}
					}

					if (isLowest)
					{
						result.Add(stockCode);
					}
				}
			}

			return result;
		}

		private List<string> MatchPriceTrend(List<PriceTrend> pattern, List<string> stockCodes)
		{
			var result = new List<string>();

			foreach (var stockCode in stockCodes)
			{
				var history = _stockHistoryProvider.GetStockPriceHistories(stockCode);
				var stock = _stockPriceProvider.GetStock(stockCode);
				Decimal currentPrice = 0.0m;
				var noOfDay = pattern.Count;

				if (!(stock is null))
				{
					currentPrice = stock.MatchPrice;
				}
				else
				{
					if (pattern[noOfDay - 1] != PriceTrend.Skip)
					{
						continue;
					}
				}

				if (history.Count >= noOfDay)
				{
                    var isMatched = true;
					Decimal trend = 0.0m;
					if (pattern[noOfDay - 1] != PriceTrend.Skip)
					{
						trend = currentPrice - history[history.Count - 1].ClosePrice.Value;
						if (trend * (int)pattern[noOfDay - 1] <= 0)
						{         // same trend: trend positive * PriceDirection = 1 > 0, inverse
							isMatched = false;
						}
					}
					for (var i = 0; i < noOfDay - 1 && isMatched; ++i)
					{
                        if (pattern[i] != PriceTrend.Skip) {
                            trend = history[history.Count - noOfDay + i + 1].ClosePrice.Value - history[history.Count - noOfDay + i].ClosePrice.Value;
                            if (trend * (int)pattern[i] <= 0)
                            {
                                isMatched = false;
                            }
                        }
					}

					if (isMatched == true)
					{
						result.Add(stockCode);
					}

				}
			}

			return result;
		}

        Dictionary<string, List<string>> MatchTACondition (Dictionary<string, TASignalCondition> conditions, List<string> stockCodes) {
            var result = new Dictionary<string, List<string>>();
            
            foreach (var entry in conditions) {
                result.Add(entry.Key, new List<string>());
            }

            return result;
        }

		public AlertResult GetAlertResult(AlertOption alertOption)
		{
			var alertResult = new AlertResult();

			alertResult.HighestInRange = HighestInRange(alertOption.HighestInRange, alertOption.StockCodes);
			alertResult.LowestInRange = LowestInRange(alertOption.LowestInRange, alertOption.StockCodes);
			alertResult.PriceTrendPattern = MatchPriceTrend(alertOption.PriceTrendPattern, alertOption.StockCodes);
            alertResult.TASignals = MatchTACondition(alertOption.TASignals, alertOption.StockCodes);

			return alertResult;
		}
	}
}