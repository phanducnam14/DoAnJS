# Chuc nang du an

## Trang thai kiem tra

- `npm test`: pass `13/13` test.
- `npm run seed`: chay thanh cong.
- Da smoke test lai cac luong chinh tren MongoDB test rieng sau khi sua.

## 1. Cac chuc nang hien dang hoat dong

### Xac thuc va phien dang nhap

- `POST /api/auth/register`: dang ky tai khoan.
- `POST /api/auth/login`: dang nhap, tra `accessToken` va `refreshToken`.
- `GET /api/health`: smoke check server.

### Tai khoan nguoi dung

- `GET /api/users/me`: lay thong tin nguoi dung dang dang nhap.
- `PUT /api/users/profile`: cap nhat ho ten, so dien thoai, khu vuc.
- `PUT /api/users/avatar`: tai anh dai dien.

### Danh muc va khu vuc

- `POST /api/categories`: tao danh muc.
- `GET /api/categories`: lay danh sach danh muc.
- `POST /api/subcategories`: tao danh muc con.
- `GET /api/subcategories`: lay danh sach danh muc con, loc theo `category`.
- `POST /api/locations`: tao khu vuc.
- `GET /api/locations`: lay danh sach khu vuc.
- `GET /api/meta/categories`: lay danh muc kem subcategory cho frontend.
- `GET /api/meta/locations`: lay du lieu khu vuc cho frontend.

### San pham

- `POST /api/products`: tao san pham.
- `GET /api/products`: lay danh sach san pham.
- `GET /api/products?search=...`: tim kiem theo tu khoa.
- `GET /api/products/:id`: xem chi tiet san pham, tang `views`.
- `PUT /api/products/:id`: cap nhat san pham cua chinh minh.
- `PUT /api/products/:id/boost`: boost tin.
- `DELETE /api/products/:id`: xoa san pham cua chinh minh.
- `GET /api/products/mine`: lay danh sach tin da dang cua nguoi dung hien tai.

### Yeu thich

- `POST /api/favorites/:productId`: them / bo yeu thich.
- `GET /api/favorites`: xem danh sach yeu thich.

### Tin nhan MVP

- `POST /api/conversations`: bat dau cuoc tro chuyen tu `productId`.
- `GET /api/conversations`: xem danh sach cuoc tro chuyen cua nguoi dung.
- `GET /api/conversations/:id/messages`: xem lich su tin nhan va danh dau tin den da doc.
- `POST /api/conversations/:id/messages`: gui tin nhan trong cuoc tro chuyen.
- Chi nguoi tham gia conversation moi duoc xem va gui tin.
- Khong cho nguoi dang tin tu nhan cho chinh minh tren san pham cua minh.

### Frontend

- Co man `login/register`, `dashboard`, `products`, `favorites`, `profile`, `sell`, `settings`.
- Co tim kiem, loc danh muc va khu vuc, tao san pham, cap nhat ho so, tai avatar.
- Da them khu vuc `Tin cua toi` trong trang ho so de xem nhanh cac san pham da dang.
- Da them man `Tin nhan` de xem danh sach cuoc tro chuyen, lich su tin nhan va gui tin theo polling.

## 2. Loi da phat hien va da sua

### Bao mat

- Da sua lo `password` hash trong `GET /api/users/me`, `PUT /api/users/profile`, `PUT /api/users/avatar`.
- Da sua lo `password` hash trong `seller` khi goi `GET /api/products`, `GET /api/products/:id`, `GET /api/products/mine`.
- Da khoa cac truong nhay cam khong cho tu sua qua `PUT /api/users/profile` nhu `role`, `isBanned`, `password`.
- Da khoa cap nhat trai phep tren `PUT /api/products/:id` voi cac truong nhu `seller`, `isBoosted`, `favoritesCount`, `views`.
- Da bo sung xu ly token hop le nhung user da bi xoa: tra `401 User not found`.

### Du lieu

- Da sua `seed.js` bi vo do conflict marker Git.
- Da sua logic seed subcategory de dung slug danh muc `may-tinh` thay vi `laptop`.
- Da doi seed sang huong upsert de chay lai on dinh hon, tranh duplicate khong can thiet.

### DX/UX

- Da chuan hoa duong dan file upload sang dang `/` thay vi `\\` de tra API sach hon va dung on dinh hon cho client.
- Da bo sung man `Tin cua toi` de nguoi dung xem nhanh danh sach bai dang cua minh.
- Da bo sung MVP nhan tin giua nguoi mua va nguoi ban tu trang chi tiet san pham.

## 3. Van de con ton tai

### Muc uu tien cao

- Chua co refresh token flow that su: co tra `refreshToken` nhung chua co route refresh/logout/revoke.
- Category, subcategory, location hien chua co phan quyen admin; bat ky ai cung co the tao du lieu nen.
- Chua co validation nghiem ngat cho tao/cap nhat san pham, chu yeu dua vao schema Mongoose.

### Muc uu tien trung binh

- Controller dang kiem qua nhieu viec, chua tach service layer nen kho mo rong va test sau nay.
- Test tu dong van thien ve unit/smoke, chua co integration test day du cho CRUD chinh voi DB test.
- Trang `settings` hien chi la man thong tin tinh, chua co cai dat thuc su.
- Tin nhan hien dung polling, chua la realtime socket.

### Muc uu tien thap

- Chua co trang quan tri/noi dung dashboard cho admin.
- Chua co phan tich logs, audit trail, thong ke, hay monitoring.

## 4. Ke hoach cai thien theo muc do uu tien

### P1

- Them `POST /api/auth/refresh` va `POST /api/auth/logout`.
- Them middleware phan quyen admin cho category/subcategory/location.
- Them validation request rieng cho product create/update.

### P2

- Tach service layer cho `auth`, `user`, `product`.
- Bo sung integration test cho cac luong: register/login/profile/product/favorite.
- Them trang quan ly bai dang cua nguoi dung voi chuc nang loc va danh dau da ban.

### P3

- Them he thong `Order`, `Review`, `Conversation`, `Message`, `Notification`.
- Nang cap tin nhan tu polling len realtime bang WebSocket/Socket.IO.
- Them sap xep nang cao, loc khoang gia, lich su giao dich, thong bao realtime.

## 5. Chuc nang hay co the them tiep

- Refresh token va dang xuat dung nghia.
- Danh dau san pham da ban / tam an / gia han tin.
- Danh gia nguoi ban sau giao dich.
- Chat giua nguoi mua va nguoi ban.
- Don hang co trang thai xu ly don gian.
- Thong bao cho yeu thich moi, tin nhan moi, don hang moi.

## 6. Ghi chu

- Cac schema `Order`, `Review`, `Conversation`, `Message`, `Notification` da co san, nen rat phu hop de mo rong tiep.
- Cac thay doi vua sua da duoc test lai de tranh lam hong chuc nang cu.
