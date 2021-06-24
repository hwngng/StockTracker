using System.Threading.Tasks;
using System.Text;
using System.Threading;
using System.Net.WebSockets;
using System.Collections.Generic;
using System;
using Services.Common;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace Services
{
    public class VNDStockDataSocket : DataFromVND
    {
        

        private ClientWebSocket _webSocket;

        private string _latestMsg;

		public VNDStockDataSocket() : base()
		{
            _webSocket = new ClientWebSocket();
		}

        public override string GetLatestData() {
            return _latestMsg;
        }

		

        public override async void StartFetchingData() {
            await _webSocket.ConnectAsync(new System.Uri(Constants.VNDWebsocketUrl), CancellationToken.None);
            string msg1 = "a";                                      // acknowledge
            string msg2 = "s|S:FLC,HAG,HSG,MBB,PDR,PVD,SHB,VIC,VND";    //
            await _webSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg1)), WebSocketMessageType.Text, true, CancellationToken.None);
            await _webSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(msg2)), WebSocketMessageType.Text, true, CancellationToken.None);
            FetchMessage();
        }

        private async void FetchMessage() {
            ArraySegment<byte> bytesReceived = new ArraySegment<byte>(new byte[5120]);
            ArraySegment<byte> pong = Encoding.UTF8.GetBytes(Constants.PONG);
            while (_webSocket.State == WebSocketState.Open) {
                WebSocketReceiveResult result =  await _webSocket.ReceiveAsync(bytesReceived, CancellationToken.None);
                string rawSocketMsg = Encoding.ASCII.GetString(bytesReceived.Array, 0, result.Count);
                if (rawSocketMsg == Constants.PING) {
                    _webSocket.SendAsync(pong, WebSocketMessageType.Text, true, CancellationToken.None);
                } else {
                    var filteredMsg = FilterSocketMessage(rawSocketMsg);
                    if (filteredMsg.Count == 3) {
                        var rawMsg = filteredMsg[2];
                        _latestMsg = this.DecodeRaw(rawMsg);
                        if (_observers.Count > 0) {
                            foreach (var observer in _observers) {
                                observer.OnNext(_latestMsg);
                            }
                        }
                    }
                }
            }
        }

        public override void Dispose() {
            _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            GC.SuppressFinalize(this);
        }

        ~VNDStockDataSocket() {
            Dispose();
        }
    }
}