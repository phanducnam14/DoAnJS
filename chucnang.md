# Chức năng hiện có của web

## 1. Xác thực tài khoản

- Đăng ký tài khoản qua `POST /api/auth/register`
- Đăng nhập qua `POST /api/auth/login`
- Nhận `accessToken` và `refreshToken` sau khi đăng nhập thành công
- Chặn đăng nhập với tài khoản bị khóa (`isBanned`)

## 2. Quản lý sản phẩm

- Đăng bán sản phẩm mới qua `POST /api/products`
- Tải lên tối đa 10 ảnh khi đăng sản
- Xem danh sách sản phẩm qua `GET /api/products`
- Tìm kiếm sản phẩm theo từ khóa `search`
- Lọc theo `category`, `location`, `boosted`
- Phân trang với `page`, `limit`
- Xem chi tiết sản phẩm qua `GET /api/products/:id`
- Tăng lượt xem mỗi lần vào trang chi tiết
- Cập nhật sản phẩm của chính mình qua `PUT /api/products/:id`
- Xóa sản phẩm của chính mình qua `DELETE /api/products/:id`
- Đẩy tin sản phẩm qua `PUT /api/products/:id/boost`

## 3. Quản lý tài khoản cá nhân

- Xem thông tin người dùng đang đăng nhập qua `GET /api/users/me`
- Cập nhật hồ sơ qua `PUT /api/users/profile`
- Tải ảnh đại diện qua `PUT /api/users/avatar`

## 4. Yêu thích sản phẩm

- Thêm hoặc bỏ yêu thích qua `POST /api/favorites/:productId`
- Xem danh sách sản phẩm yêu thích qua `GET /api/favorites`

## 5. Dữ liệu phục vụ frontend

- Lấy danh mục qua `GET /api/meta/categories`
- Lấy khu vực qua `GET /api/meta/locations`

## 6. Frontend hiện có sau khi hoàn thiện

- Trang tổng quan
- Trang danh sách sản phẩm
- Trang chi tiết sản phẩm
- Trang đăng nhập / đăng ký
- Trang đăng sản phẩm
- Trang sản phẩm yêu thích
- Trang hồ sơ cá nhân
- Chuyển trang bằng router hash trong frontend

## 7. Ghi chú

- Web hiện tập trung vào các chức năng backend marketplace có thể thực hiện ngay.
- Các schema như `Order`, `Review`, `Conversation`, `Message`, `Notification` đã có trong dự án nhưng chưa có route/controller hoàn chỉnh, nên chưa được tính là chức năng web đang hoạt động.
