namespace Services
{
    using System;
    using System.Collections.Generic;
    
    public abstract class DataSource : IDataSource, IDisposable
    {
        protected List<IObserver<string>> _observers;

        public DataSource () {
            _observers = new List<IObserver<string>>();
        }

        public IDisposable Subscribe(IObserver<string> observer)
		{
			if (_observers != null)
			{
				_observers.Add(observer);
			}
			else
			{
				throw new ArgumentNullException();
			}

			return null;
		}

        public void Unsubscribe(IObserver<string> observer) {
            if (_observers != null)
			{
				_observers.Remove(observer);
			}
			else
			{
				throw new ArgumentNullException();
			}
        }

        public abstract string GetLatestData();

        public abstract void StartFetchingData();

        public abstract List<string> GetSnapshot(List<string> stockCodes);

        public abstract void Dispose();
    }
}