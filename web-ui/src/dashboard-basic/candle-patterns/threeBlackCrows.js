export default function threeBlackCrows(dataSeries) {
	const resultCandles = [];
	const isThreeBlackCrowsCandles = function(tradingDay1, tradingDay2, tradingDay3) {
		if (tradingDay1.close >= tradingDay1.open) return false;
		if (tradingDay2.close >= tradingDay2.open) return false;
		if (tradingDay3.close >= tradingDay3.open) return false;
		let lowerWick2 = tradingDay2.close - tradingDay2.low;
		let lowerWick3 = tradingDay3.close - tradingDay2.low;
		let body2 = Math.abs(tradingDay2.close - tradingDay2.open);
		let body3 = Math.abs(tradingDay3.close - tradingDay3.open);
		if (((tradingDay1.open + tradingDay1.close)/2 >= tradingDay2.open
				&& tradingDay1.close <= tradingDay2.open
				&& tradingDay1.close > tradingDay2.close
				&& lowerWick2 / body2 < 0.5)
			&& ((tradingDay2.open + tradingDay2.close)/2 >= tradingDay3.open
				&& tradingDay2.close <= tradingDay3.open
				&& tradingDay2.close > tradingDay3.close
				&& lowerWick3 / body3 < 0.5))
			return true;
		return false;
	}

	if (dataSeries.length >= 3) {
		for (let i = 2; i < dataSeries.length; ++i) {
			if (isThreeBlackCrowsCandles(dataSeries[i-2], dataSeries[i-1], dataSeries[i])) {
				resultCandles.push(dataSeries[i-2].date);
				resultCandles.push(dataSeries[i-1].date);
				resultCandles.push(dataSeries[i].date);
				i += 3;
			}
		}
	}
	console.log(resultCandles);
	return resultCandles;
}

