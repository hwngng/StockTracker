export default function eveningStar(dataSeries) {
	const resultCandles = [];
	const isEveningStarCandles = function(tradingDay1, tradingDay2, tradingDay3) {
		if (tradingDay1.close <= tradingDay1.open) return false;
		if (tradingDay3.close >= tradingDay3.open) return false;
		if (tradingDay2.open < tradingDay1.close
			|| tradingDay2.close < tradingDay1.close)
			return false;
		if (tradingDay2.open < tradingDay3.open
			|| tradingDay2.close < tradingDay3.open)
			return false;
		let body1 = Math.abs(tradingDay1.close - tradingDay1.open);
		let body2 = Math.abs(tradingDay2.close - tradingDay2.open);
		let body3 = Math.abs(tradingDay3.close - tradingDay3.open);
		if (body2 / body1 < 0.2
			&& body2 / body3 < 0.2)
			return true;
		return false;
	}

	if (dataSeries.length >= 3) {
		for (let i = 2; i < dataSeries.length; ++i) {
			if (isEveningStarCandles(dataSeries[i-2], dataSeries[i-1], dataSeries[i])) {
				resultCandles.push(dataSeries[i-2].date);
				resultCandles.push(dataSeries[i-1].date);
				resultCandles.push(dataSeries[i].date);
				i += 3;
			}
		}
	}
	return resultCandles;
}

