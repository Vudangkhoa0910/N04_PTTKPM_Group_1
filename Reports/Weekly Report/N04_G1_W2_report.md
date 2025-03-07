# Báo Cáo Tiến Độ Tuần 1 
## Dự Án: EduPNK - eLearning Web  

### Tổng Quan  
EduPNK là một nền tảng eLearning Web được thiết kế nhằm cung cấp trải nghiệm học tập trực tuyến hiệu quả và dễ sử dụng cho học sinh, giáo viên và quản trị viên. Dự án được chia thành nhiều giai đoạn, từ phân tích yêu cầu đến triển khai và kiểm thử hệ thống.  

Dưới đây là báo cáo chi tiết tiến độ thực hiện Tuần 2 của dự án.

---

## Tiến Độ Chi Tiết  

### 1. **Phân Tích Yêu Cầu**  
#### Tiến Độ:
- **Xác định và phân tích yêu cầu:** 100% ✅  
- **Các case study trong dự án:** 90% 🚧  
- **Tạo tài liệu SRS sơ bộ:** 100% ✅  
- **Planning:** 85% 🚧  

#### Mô Tả Công Việc:
- Hoàn thành tài liệu SRS tương đối hoàn chỉnh, bao gồm:  
  - Yêu cầu chức năng: Đăng nhập, quản lý khóa học, giao bài tập, theo dõi tiến độ học tập.  
  - Yêu cầu phi chức năng: Hiệu năng, bảo mật dữ liệu người dùng, khả năng mở rộng hệ thống.  
- Case study nền tảng với các kịch bản người dùng điển hình (học sinh (người dùng), giáo viên, quản trị viên).  

#### Ghi chú:
- Cần bổ sung thêm case study từ các đối tượng sử dụng chính để tăng tính toàn diện.  
- Điều chỉnh planning để đồng bộ với tiến độ thực tế.  

---

### 2. **Thiết Kế Giao Diện**  
#### Tiến Độ:
- **Tạo schedule:** 80% 🚧  
- **Xác định các vấn đề/chức năng trong thiết kế:** 100% ✅  
- **Xây dựng ý tưởng giao diện:** 95% ✅  
- **Thiết kế giao diện (Wireframe và Prototype):** 100% ✅  

#### Mô Tả Công Việc:
- Giao diện trang chủ, trang học tập, và trang quản trị đã được hoàn thành dưới dạng wireframe và prototype.  
- Tập trung vào trải nghiệm người dùng, bao gồm:  
  - Hệ thống menu dễ điều hướng.  
  - Giao diện học tập đơn giản và trực quan.  
- Feedback từ nhóm phát triển và người dùng thử nghiệm đã được áp dụng để cải thiện prototype.  

#### Ghi chú:
- Thêm sáng tạo và củng cố cấu trúc của giao diện

---

### 3. **Thiết Kế Chương Trình**  
#### Tiến Độ:
- **Tạo schedule:** 55% 🚧  
- **Lên kế hoạch cơ sở dữ liệu:** 35% 🚧  
- **Xác định kiến trúc chương trình:** 100% ✅  

#### Mô Tả Công Việc:
- Thiết kế kiến trúc hệ thống theo mô hình **MVC** (Model-View-Controller) để đảm bảo tính module hóa và dễ dàng bảo trì.  
- Đã xác định các thành phần chính:  
  - **Frontend:** Sử dụng React.js để xây dựng giao diện người dùng.  
  - **Backend:** Node.js và Express.js xử lý logic server-side.  
  - **Database:** MongoDB để lưu trữ dữ liệu khóa học và người dùng.  
- Cơ sở dữ liệu đã được thiết kế sơ bộ, với các bảng chính: Users, Courses, Lessons, Assignments, Progress.  

#### Ghi chú:
- Cần hoàn thiện chi tiết kế hoạch cơ sở dữ liệu để sẵn sàng cho giai đoạn phát triển.  

---

### 4. **Thực Thi**  
#### Tiến Độ:
- **Test plan (UI, chức năng):** 15% 🚧  
- **Coding:** 40% 🚧  
- **Quản lý source code:** 100% ✅  

#### Mô Tả Công Việc:
- Phát triển các module chính:  
  - **Authentication (đăng ký, đăng nhập):** Đã hoàn thiện cơ bản với JWT để quản lý phiên làm việc.  
  - **Quản lý khóa học:** Đang triển khai backend và giao diện.  
- Source code được quản lý qua GitHub với quy trình CI/CD cơ bản.  
- Đã tạo bộ kiểm thử đơn giản cho UI bằng Jest và React Testing Library.  

#### Ghi chú:
- Test plan cần mở rộng để bao gồm các trường hợp kiểm thử chi tiết hơn, đặc biệt với chức năng học tập và theo dõi tiến độ.  

---

## Đề Xuất & Hành Động Tiếp Theo  
1. **Phân tích case study**: Hoàn thiện 10% còn lại, ưu tiên các kịch bản người dùng phức tạp.  
2. **Lên kế hoạch cơ sở dữ liệu**: Tăng tốc độ hoàn thành chi tiết các bảng và mối quan hệ.  
3. **Phát triển thêm Test Plan**: Mở rộng để bao gồm kiểm thử chức năng và kiểm thử hiệu năng.  
4. **Đẩy nhanh tiến độ coding**: Tập trung vào các module cốt lõi (quản lý khóa học, giao bài tập).  

---

## Kết Luận  
Dự án EduPNK - eLearning Web đang tiến triển đúng hướng với một số giai đoạn đã hoàn thành tốt (phân tích yêu cầu, giao diện, kiến trúc chương trình). Tuy nhiên, cần tăng tốc một số nhiệm vụ đang để đảm bảo đáp ứng đúng thời hạn trước nghỉ Tết (20/1/2025).

Nhóm phát triển dự án EduPNK đã có sự phối hợp tốt và sẽ tiếp tục cải thiện quy trình để tăng hiệu suất. 🎯