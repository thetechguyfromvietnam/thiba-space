# Quản Lý Quán Cà Phê - Thiba Space

Phần mềm quản lý quán cà phê với mô hình tính giờ làm việc và tự động tính phí quá giờ.

## Tính năng

- ✅ Check-in khách hàng với số thẻ và gói dịch vụ
- ✅ Theo dõi thời gian sử dụng real-time
- ✅ Tự động tính phí quá giờ (15,000 VNĐ/giờ)
- ✅ Giao diện thân thiện, dễ sử dụng
- ✅ Lưu trữ dữ liệu tự động (localStorage)
- ✅ Hiển thị cảnh báo khi khách hàng quá giờ

## Gói dịch vụ

- **Deep Work**: 4 giờ + 1 nước
- **Light Work**: 3 giờ + nước

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview
```

## Sử dụng

1. Click nút "Check-in Khách Hàng" ở góc trên bên phải
2. Nhập số thẻ của khách hàng
3. Chọn gói dịch vụ (Deep Work hoặc Light Work)
4. Click "Check-in"
5. Hệ thống sẽ tự động theo dõi thời gian và tính phí quá giờ
6. Khi khách hàng checkout, click nút "Checkout" trên thẻ khách hàng

## Công nghệ sử dụng

- React 18
- TypeScript
- Vite
- Lucide React (icons)
- CSS3 với gradient và animations

