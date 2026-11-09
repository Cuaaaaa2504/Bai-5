# CourseHub — Bài 5 Quản lý khóa học

Ứng dụng React Native + Expo, dùng MockAPI làm backend. Không có backend riêng, không dùng danh sách hardcode thay thế dữ liệu API.

## Trạng thái

Đã chuẩn bị mã nguồn; chưa chạy npm install, build Android hoặc kiểm thử trên thiết bị trong môi trường tạo mã. Chưa có Base URL MockAPI thật của chủ repo. Cần cấu hình và chạy checklist trước khi nộp. Chưa có video thuyết trình được ghi hình.

## Yêu cầu môi trường và chạy

- Node.js 20.19+ và npm.
- Android emulator hoặc điện thoại với Expo Go tương thích Expo SDK 54. Nếu Expo Go hiện tại không hỗ trợ SDK 54, dùng bản Android tương thích từ trang Expo Go hoặc tạo development build; không tự nâng riêng từng dependency.

```sh
npm install
npx expo install --check
npm start
```

Nhấn a để mở Android emulator, hoặc quét QR trên điện thoại cùng mạng. Nếu cần tunnel: `npx expo start --tunnel`. Đây là app mobile, chưa cấu hình chạy web. Lần cài đầu tạo package-lock.json; commit lockfile sau khi kiểm tra dependency để cố định phiên bản.

## Tạo MockAPI

1. Tạo project tại https://mockapi.io/. Tạo 2 resource ĐỘC LẬP `categories` và `courses` (không tạo resource lồng nhau).
2. categories: `id` String tự sinh, `name` String, `description` String.
3. courses: `id` String tự sinh, `title` String, `description` String, `categoryId` String, `instructor` String, `price` Number, `duration` Number, `thumbnail` String, `trailerUrl` String, `createdAt` String. Giữ các trường đúng tên và đúng chữ hoa/thường.
4. Copy Base URL thực tế từ project, ví dụ `https://YOUR_PROJECT.mockapi.io/api/v1`. Prefix phải trùng cấu hình project của bạn, không thêm `/courses` hoặc `/categories`.
5. Mở tab API trong app, nhập Base URL và chọn Kiểm tra và lưu. App GET cả hai resource trước khi lưu URL vào AsyncStorage. AsyncStorage chỉ lưu URL cấu hình, không thay thế backend.

### Tạo dữ liệu mẫu

Script sau ghi dữ liệu lên API thật. Kiểm tra đúng project trước khi chạy. Không đặt URL có thông tin bí mật vào repo.

PowerShell:
```powershell
$env:MOCKAPI_BASE_URL="https://YOUR_PROJECT.mockapi.io/api/v1"
npm run seed -- --confirm
```

Bash:
```sh
MOCKAPI_BASE_URL=https://YOUR_PROJECT.mockapi.io/api/v1 npm run seed -- --confirm
```

Script tạo 3 danh mục và 10 khóa học, dùng id danh mục do API trả về. Chạy lại sẽ bỏ qua tên danh mục/tên khóa học mẫu đã tồn tại. Không xóa dữ liệu cũ. Khi lỗi giữa chừng, có thể đã ghi một phần; kiểm tra API và chạy lại. Nếu dữ liệu cũ có tiêu đề trùng nhưng sai categoryId, cần sửa trong app. Ảnh dùng picsum.photos; trailer dùng video Big Buck Bunny công khai làm demo kỹ thuật, không phải trailer thật của từng khóa học. URL bên thứ ba có thể thay đổi, cần thử phát trước khi nộp.

## Chức năng và kiến trúc

- `App.js`: danh sách, chi tiết, form thêm/sửa khóa học, quản lý danh mục, cấu hình API và modal phát video.
- `src/api.js`: fetch JSON, HTTP errors, timeout 15 giây, tải categories/courses song song.
- `scripts/seed.mjs`: nạp dữ liệu lên MockAPI, không được import vào app.
- Ảnh dùng React Native Image, có trạng thái ảnh lỗi. Video dùng expo-video, chỉ nhập URL MP4 trực tiếp. Không hỗ trợ link trang YouTube.
- Danh sách lấy GET /courses và GET /categories, ghép tên qua String(course.categoryId) === String(category.id). Tìm kiếm và lọc phía client trên dữ liệu đã tải từ API.
- Mở chi tiết gọi GET /courses/{id}. Thêm POST; sửa PUT; xóa DELETE. Sau ghi gọi lại API để đồng bộ. Nếu ghi thành công nhưng tải lại lỗi, hiển thị cảnh báo thay vì nói ghi thất bại.
- Trước lưu khóa học, kiểm tra trường bắt buộc, URL, học phí hữu hạn >= 0, thời lượng hữu hạn > 0 và GET danh mục mới nhất để kiểm tra categoryId. createdAt được tạo khi thêm và giữ lại khi sửa.
- Trước xóa danh mục, xác nhận với người dùng rồi GET /courses mới nhất; có khóa học liên quan thì chặn DELETE. Đây là ràng buộc phía ứng dụng theo đề: không có transaction/foreign key phía server, nên không thể đảm bảo tuyệt đối nếu nhiều client cùng sửa đồng thời.
- Có loading, lỗi API, retry, kéo tải lại, trạng thái rỗng và khóa thao tác ghi chống bấm trùng.

## API

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | /categories | Lấy danh mục |
| POST | /categories | Thêm danh mục |
| PUT | /categories/{id} | Sửa danh mục |
| DELETE | /categories/{id} | Xóa danh mục sau kiểm tra |
| GET | /courses | Lấy khóa học |
| GET | /courses/{id} | Chi tiết khóa học |
| POST | /courses | Thêm khóa học |
| PUT | /courses/{id} | Sửa khóa học |
| DELETE | /courses/{id} | Xóa khóa học |

## Checklist kiểm thử thủ công

- [ ] Cài dependency, `npx expo-doctor`, mở app Android không lỗi runtime.
- [ ] Cấu hình Base URL thật, đóng/mở app vẫn giữ URL.
- [ ] Seed và xác nhận ít nhất 3 danh mục, 10 khóa học trên MockAPI.
- [ ] Danh sách hiển thị ảnh, tên, giảng viên, tên danh mục và học phí.
- [ ] Tìm tên, lọc danh mục, phối hợp hai điều kiện, không có kết quả.
- [ ] Chi tiết đúng id, đầy đủ dữ liệu; video chạy, tạm dừng, toàn màn hình, đóng video ngừng phát.
- [ ] Thêm khóa học, kiểm tra GET trên MockAPI thấy bản ghi mới.
- [ ] Sửa thông tin và danh mục; createdAt không đổi; mở lại app thấy dữ liệu mới.
- [ ] Hủy xóa không đổi dữ liệu; xác nhận xóa cập nhật API và danh sách.
- [ ] Thêm/sửa danh mục; đổi tên phản ánh trong khóa học; danh mục đang có khóa học không xóa được.
- [ ] Chặn trường rỗng, số âm, số không hợp lệ, thời lượng 0, URL sai, categoryId không tồn tại.
- [ ] Tắt mạng: có thông báo lỗi, thử lại khi bật mạng. Thử ảnh/video URL hỏng.
- [ ] Thử resource rỗng trên project thử nghiệm riêng, không xóa project chính để test.

## Kịch bản video thuyết trình

1. Giới thiệu đề tài, bốn màn hình chính và cấu hình project MockAPI.
2. Mở schema và dữ liệu thật, giải thích quan hệ categories.id và courses.categoryId.
3. Giải thích request() và loadAll(): GET, JSON, Promise.all, timeout, lỗi HTTP.
4. Demo danh sách, ảnh URL, tìm kiếm, lọc; mở chi tiết và phát MP4 trong app.
5. Demo POST thêm, PUT sửa, DELETE xóa, đối chiếu dữ liệu trên MockAPI sau mỗi bước.
6. Demo CRUD danh mục, chặn xóa danh mục có khóa học và validation.
7. Demo mất mạng, retry và giải thích giới hạn ràng buộc phía client.

## Sản phẩm cần hoàn tất trước khi nộp

Source code trong repo; Base URL/project MockAPI thật của bạn; README này; video ghi hình theo kịch bản trên. Không cần upload ảnh/video lên server, chỉ lưu URL String. Không công bố ứng dụng MockAPI chứa dữ liệu nhạy cảm vì endpoint có thể cho phép ghi công khai.
