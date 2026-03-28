# Postman Test Guide

## 1. Chuẩn bị

1. Mở terminal tại thư mục dự án:
   - `cd c:\Users\Phduc\DoAnJs`
2. Cài dependencies nếu chưa cài:
   - `npm install`
3. Chạy server:
   - `npm start`
   - hoặc `npm run dev`
4. Backend mặc định chạy trên `http://localhost:3000`

> Nếu server chạy port khác, dùng port đó thay cho `3000`.

## 2. Tạo environment trong Postman

Tạo environment mới và thêm biến:

- `base_url` = `http://localhost:3000`
- `auth_token` = ``

## 3. Các bước test Postman

### Bước 1: Test endpoint `Register`

- Method: `POST`
- URL: `{{base_url}}/api/auth/register`
- Body > raw > JSON

```json
{
  "name": "Test User",
  "email": "user@test.com",
  "password": "123456",
  "phone": "0123456789"
}
```

Nếu trả về `success: true` là đăng ký thành công.

### Bước 2: Test endpoint `Login`

- Method: `POST`
- URL: `{{base_url}}/api/auth/login`
- Body > raw > JSON

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

Response sẽ trả về object `data.tokens.accessToken`.

- Đường dẫn lấy token: `data.tokens.accessToken`
- Nếu bạn dùng Postman, copy giá trị `accessToken`.
- Lưu vào biến `auth_token`.
- User ID có thể lấy ở `data.user.id`.

Ví dụ response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "69c7807a4146df688b8af2af",
      "name": "Test User",
      "email": "user@test.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "<accessToken>",
      "refreshToken": "<refreshToken>"
    }
  }
}
```

### Bước 3: Test endpoint `Create Product`

- Method: `POST`
- URL: `{{base_url}}/api/products`
- Header:
  - `Authorization`: `Bearer {{auth_token}}`
- Body > raw > JSON

```json
{
  "title": "Điện thoại iPhone 15",
  "description": "Máy like new, 99%",
  "price": 25000000,
  "condition": "like_new",
  "category": "<categoryId>",
  "subCategory": "<subCategoryId>",
  "location": "<locationId>"
}
```

- `category`, `subCategory`, `location` phải là ID có trong database.
- Nếu không có ảnh, vẫn có thể gửi request JSON mà không cần upload file.

### Bước 4: Test endpoint `Get Products`

- Method: `GET`
- URL: `{{base_url}}/api/products`
- Không cần thêm header Authorization

### Bước 4: Test endpoint `Get current user`

- Method: `GET`
- URL: `{{base_url}}/api/users/me`
- Headers:
  - `Authorization`: `Bearer {{auth_token}}`

## 4. Link test trực tiếp

- Đăng ký: `{{base_url}}/api/auth/register`
- Đăng nhập: `{{base_url}}/api/auth/login`
- Tạo sản phẩm: `{{base_url}}/api/products`
- Lấy sản phẩm: `{{base_url}}/api/products`
- Lấy chi tiết sản phẩm: `{{base_url}}/api/products/:id`
- Lấy user hiện tại: `{{base_url}}/api/users/me`

## 5. Cách sử dụng biến `auth_token`

1. Trong Postman, vào tab `Headers`.
2. Thêm dòng:
   - Key: `Authorization`
   - Value: `Bearer {{auth_token}}`

## 6. Nếu dùng cổng khác

Nếu server chạy trên port khác, ví dụ `3001`, đổi `base_url` thành:

`http://localhost:3001`

## 7. Ghi chú

- Dự án này là backend API nên không có giao diện frontend mặc định.
- Nếu muốn test giao diện, mở `public/index.html` sau khi server đang chạy.
- Kiểm tra server đã chạy trước khi gọi API.
