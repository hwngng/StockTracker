using System.Diagnostics;
using Services.Common;
using System.Threading;
using System.IO;
using System.Collections.Generic;
using System;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace Services
{
	public class VNDStockDataFile : DataFromVND
	{
		private readonly string _filePath;
		private readonly StreamReader _sr;
		private readonly Mutex fileReadMutex;
        private Timer _timer;
        private TimeSpan _updateInterval = TimeSpan.FromMilliseconds(100);

		public VNDStockDataFile(string filePath)
		{
			_filePath = filePath;
			_sr = new StreamReader(filePath);
			fileReadMutex = new Mutex();
		}

		public override string GetLatestData()
		{
			fileReadMutex.WaitOne();
			string rawData = _sr.ReadLine();
			fileReadMutex.ReleaseMutex();
            string data = "";

            if (rawData != null) {
                var filteredMsg = this.FilterSocketMessage(rawData);
				if (filteredMsg.Count == 3) {
					var rawMsg = filteredMsg[2];
					data = this.DecodeRaw(rawMsg);
				}
            } else {
                data = "";
                _sr.Close();
                _timer.Dispose();
            }

			return data;
		}

		public override List<string> GetSnapshot (List<string> stockCodes) {
			var query = String.Join(',', stockCodes);
			var url = Constants.VNDSnapshotApi + query;
			var data = new List<string>();
			var rawData = new string[] {
    "SESyBLBzPx1/z.0.43y-3-32x14,21|02+/5{/1*3{/1*24z1484.y.612-x2/.3,|02+0|02+05{/1*5{/-57/z355/z555/zyx|5.y.876-x13,21|01+55{64*211335{4./34.y-4-12x1/.yx|02+15{1138866..4z0.7802.1",
    "SESyDAFzPx1/z3*15z2*72z3*58z3*08z3*07z3*06z2,|004,|20.-0{4+-|5,.-|5,..|4/1,|55-x77.yx|{zy2.05y2./4y-5-14111/y.5063,|5,-4|3.yx|5,.1|27151462*1{15103/24.0",
    "SESyDSFzPx1/z1-.7z04.8z10.6z1-.33y01-2y01-12x1020,|1//30{5030{2.*5{2.*54z1-.5z.,4/z/35/z/13/zyx|24-x3//-x40,5x40,0x60,-57102x135/50{2.*44z/,|{z1-.7z/-7743/5-2y-7356295,1",
    "SESyIBAzPx1/z1.|27+-|32+5|30+,5{2/x40,61|2/230{/6-5/z.572.y02-/y02-/2x41,/x1533,|670,|13/-0{zyx25/-x832.,|30+05{2.*84z/03-66-22z2390/-x41,.x1/zyx41,0x64./5383+3|461-16.+3",
    "SESyLDQzPx1/z54.3z5..2z60.4z53.4z53.3z53.2z.06/z/44/z..8/z53.5z53.6z53.7z.13/z.07/z.,6/zyx|0.y/84.y48-0y47-1y52-52137z.,566-x86,2x1/.yx|76+.|11511700*8{0.527/52",
    "SESyLVCzPx1/z//.73y.2-0y.5-3y.3-52x22,4x22,31|0.3,|85-,|055/0{00*84z//.8z//.83y112.y-064-x211-x|{z..65.y-0{00*9{00*64z03./31-44z.16/.-x22,5x1/.yx|11+5|1.315620*6{/4151060.3",
    "SESyOHAzPP|/0y.7-0y.4-3y.9-7y.7-0y.7-/y.7{03*9{03*8{03*7{03*6{03*5{03*4{03*3{//-6/z1-21.y1083-x2000,|1/2-0{2140{6//0{0459/z.56/z0.4/z/3.2z/3.3z/3.4z/3.5z/3.6z/3.7z/3.8z/4|16+-|16+.|22420{2-09/z0/66.y-863-x355-x100/,|555,|2/-30{//07/z.022.y-04/450{1/.31/-xLHQ\\?OM]KIL{1-x1/0+.|15+1|15+-|72+-93//x3/72,0{04*2{/-x|{zy10//3/17,2",
    "SESyRIBzPx1/z.-7-3y-08,0x113+3|0/4*4{/.3.2z.-7-0y/23.y-43.y-41.y-16,2x105+2|0/4*7{04,|0/-,|0/1,|{zy10/z6.0{/.4.0z.-7-1y.1-01,37z.404.y-16,2x1/zyx106y-23.12121+3|640/9176*3",
    "SESyRNCzPP|/0y02-/y/7-7y06-1y02-5y02-4y02-3y02-2y02-1y02-0y02-/y02{2.*9{2.*8{10,0{4-.0{7630{/-40{/4/0{04-0{1510{1610{01/0{05/0{2/*8{2/*9{20x42,.x42,/x42,0x42,1x42,2x42,3x42,4x41.y387.y212.y/15.y.65.y162.y474.y/26/-x801-x115-x274450{11/46.yHIR]@KN^LJH|1.-x1243,|31+1|3/+1|53+30/20x141540{2/*8{4-x|{zy2733/29-4"
			};
			foreach (var raw in rawData) {
				data.Add(this.DecodeRaw(raw));
				Debug.WriteLine(data[data.Count-1]);
			}
			
			return data;
		}

        public override void StartFetchingData() {
            _timer = new Timer(FetchLineByLine, null, _updateInterval, _updateInterval);
        }

        private void FetchLineByLine(object state) {
            if (_observers.Count > 0) {
                var data = this.GetLatestData();
                if (!String.IsNullOrEmpty(data)) {
                    foreach (var observer in _observers) {
                        observer.OnNext(data);
                    }
                }
            }
        }

        public override void Dispose() {
            // _sr.Close();
            // _timer.Dispose();
            GC.SuppressFinalize(this);
        }

        ~VNDStockDataFile() {
            Dispose();
        }
	}
}