export default function hammerCandle(dataSeries) {
	const resultCandles = [];
	const isHammerCandle = function(tradingDay) {
		let result = true;
		let upper = tradingDay.close;
		let lower = tradingDay.open;
		if (tradingDay.close < tradingDay.open) {
			upper = tradingDay.open;
			lower = tradingDay.close;
		}
		let upperWick = tradingDay.high - upper;
		let lowerWick = lower - tradingDay.low;
		let body = upper - lower;
		let height = tradingDay.high - tradingDay.low;
		if (height == 0)
			return false;
		if (body/height > 0.15 &&
			upperWick/height < 0.05 &&
			lowerWick >= 2*body)
			return true;

		return false;
	}

	dataSeries.forEach(day => {
		if (isHammerCandle(day)) {
			resultCandles.push(day.date);
		}
	})

	return resultCandles;
}

