# Hướng dẫn chạy dự án Express

## 1. Chuẩn bị môi trường

1. Cài Node.js (phiên bản >= 18).
2. Cài MongoDB và khởi động MongoDB server.
3. Mở terminal ở thư mục dự án:
   - `cd c:\Users\Phduc\DoAnJs`

## 2. Cài dependencies

```powershell
npm install
```

## 3. Thiết lập biến môi trường

Nếu chưa có file `.env`, tạo từ `.env.example`:

```powershell
copy .env.example .env
```

Nội dung mẫu `.env`:

```text
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/marketplace
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d
JWT_REFRESH_EXPIRE=7d
```

Sau khi tạo xong, chỉnh giá trị `MONGO_URI` hoặc `JWT_SECRET` nếu cần.

## 4. Chạy server

### Cách 1: Dùng cổng mặc định 3000

```powershell
npm start
```

### Cách 2: Nếu cổng 3000 đang bận thì đổi cổng khác

PowerShell:
```powershell
$env:PORT=3001; npm start
```

CMD:
```cmd
set PORT=3001 && npm start
```

## 5. Chạy chế độ phát triển (live reload)

```powershell
npm run dev
```

## 6. Ghi seed dữ liệu mẫu

Nếu cần dữ liệu mẫu, chạy:

```powershell
npm run seed
```

> Lưu ý: seed script yêu cầu MongoDB đang chạy và cấu hình `MONGO_URI` trong file `.env` hợp lệ.

## 7. Kiểm tra API cơ bản

Sau khi server chạy, mở trình duyệt hoặc dùng Postman test các endpoint:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/users/me`

## 8. Nếu gặp lỗi cổng bị chiếm

Nếu server báo lỗi "Port 3000 is already in use", chạy lại với cổng khác:

PowerShell:
```powershell
$env:PORT=3002; npm start
```

## 9. Kết luận

- `npm install` — cài dependencies
- `copy .env.example .env` — tạo biến môi trường
- `npm start` — chạy server
- `npm run dev` — chạy chế độ phát triển
- `npm run seed` — nạp dữ liệu mẫu
