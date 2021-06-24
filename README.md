# Theo dõi và cảnh báo giá cổ phiếu
## Mô tả
## Tính năng
- [x] Cập nhật giá realtime với SignalR
- [x] Dễ dàng thay đổi nguồn cung cấp dữ liệu (IDataSource)
- [x] Cảnh báo realtime
## Cách cài đặt:
1. Web API app
- Từ thư mục chính chạy những lênh sau:
```
cd web-api
dotnet build
dotnet run
```
- Server sẽ được bind ở port 5000 (locahost:5000)

2. Web UI app
- Từ thư mục chính chạy những lênh sau:
```
cd web-ui
npm install
npm start
```
- Truy cập http://localhost:3000

![Demo](https://github.com/hwngng/StockTracker/blob/master/demo.png)
