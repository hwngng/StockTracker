using System;
namespace Services
{
	using System.Collections.Generic;

	public interface IDataSource : IObservable<string>
	{
		string GetLatestData();

		void StartFetchingData();

		void Unsubscribe(IObserver<string> observer);

		List<string> GetSnapshot(List<string> stockCodes);
	}
}