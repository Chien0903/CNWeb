const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Student = require('./Student');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student-management')
.then(() => {
  console.log('Đã kết nối MongoDB thành công');
})
.catch((err) => {
  console.error('Lỗi kết nối MongoDB:', err);
});

// API GET danh sách học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API GET chi tiết học sinh theo ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API POST thêm học sinh mới
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body); // tạo document mới từ dữ liệu gửi lên
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// API PUT cập nhật học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStu = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStu) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API DELETE xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Đã xóa học sinh", id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

