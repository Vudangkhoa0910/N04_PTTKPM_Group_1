const mongoose = require('mongoose');

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/elearning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema và Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  age: Number,
  city: String,
  job: String,
  course: Array,
  image: String,
});

const User = mongoose.model('User', userSchema);

// Hàm lấy danh sách người dùng theo role
const fetchUsersByRole = async (role) => {
  try {
    const users = await User.find({ role });
    console.log(`Danh sách người dùng có role "${role}":`);
    console.log(users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err);
  }
};

// Gọi hàm truy vấn
const main = async () => {
  console.log('\n--- Lấy danh sách Admin ---');
  await fetchUsersByRole('admin');

  console.log('\n--- Lấy danh sách User ---');
  await fetchUsersByRole('user');

  mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
};

main();
