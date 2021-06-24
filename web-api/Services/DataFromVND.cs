using System.Diagnostics;
using System;
using System.Collections.Generic;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Services.Common;
namespace Services
{
    public abstract class DataFromVND : DataSource
    {
        protected DataFromVND () : base() {}

        protected string DecodeRaw (string source) {
            int rotate = 5;
            // char sep = '|';
            var sourceArr = source.ToCharArray();
            
            for (int i = 0; i < sourceArr.Length; ++i) {
                sourceArr[i] = (char)((int)sourceArr[i] + i % rotate);
            }
            
            return new string(sourceArr);
        }

        protected List<string> FilterSocketMessage (string socketMessage) {
            var result = new List<string>();
            var sep = '|';
            var sepMsg = ':';

            if (socketMessage.Length >= 3) {
                var sepIdx = socketMessage.IndexOf(sep);
                var sepMsgIdx = socketMessage.IndexOf(sepMsg);
                if (sepIdx > 0 && sepMsgIdx > 0) {
                    result.Add(socketMessage.Substring(0, sepIdx));
                    result.Add(socketMessage.Substring(sepIdx+1, sepMsgIdx - sepIdx - 1));
                    result.Add(socketMessage.Substring(sepMsgIdx+1));
                }
            }

            return result;
        }

        public override List<string> GetSnapshot (List<string> stockCodes) {
			var query = String.Join(',', stockCodes);
			var url = Constants.VNDSnapshotApi + query;
			HttpClient client = new HttpClient();		
			var json = client.GetStringAsync(url).Result;
			var rawData = JArray.Parse(json).ToObject<List<string>>();
			var data = new List<string>();
			foreach (var raw in rawData) {
				data.Add(this.DecodeRaw(raw));
			}
			
			return data;
			
		}
    }
}