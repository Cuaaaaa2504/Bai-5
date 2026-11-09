# MockAPI của project

Base URL: `https://6af2096142c6561ced38f09d.mockapi.io/api/v1`

## Nạp dữ liệu không cần terminal

1. Trên MockAPI, tạo sẵn 2 resource độc lập categories và courses với schema trong README.md. Workflow không tạo resource/schema.
2. Trong repo GitHub, mở Actions > Seed MockAPI > Run workflow.
3. Chọn nhánh main, đánh dấu confirm_write rồi bấm Run workflow. Thao tác này ghi dữ liệu mẫu lên đúng Base URL phía trên. Không chạy nếu đây không phải project bạn muốn dùng.
4. Chờ job hoàn tất, mở bước Create sample categories and courses để đọc log. Nếu HTTP 404, kiểm tra tên resource và prefix /api/v1. Nếu lỗi giữa chừng, một phần dữ liệu có thể đã được ghi.
5. Script bỏ qua danh mục có cùng tên và khóa học có cùng tiêu đề. Không xóa dữ liệu cũ. Không đảm bảo sửa được các bản ghi có sẵn nhưng sai nội dung hoặc categoryId.
6. Mở app > API > nhập Base URL phía trên > Kiểm tra và lưu cấu hình.

Mục tiêu: tạo 3 danh mục và 10 khóa học mẫu trên API thật. Video mẫu chỉ để demo phát MP4. Workflow chỉ chạy thủ công, không tự chạy khi push. Chưa xác minh API đang hoạt động hoặc workflow chạy thành công cho đến khi xem kết quả run. Nếu tab Actions bị tắt, bật Actions trong cài đặt repository nếu chính sách tài khoản cho phép.
