import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import EditStudent from './EditStudent';
import './App.css';

function Home() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // Fetch danh sách học sinh
  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thêm học sinh mới
  const handleAddStudent = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const newStu = { name, age: Number(age), class: stuClass };
    axios.post('http://localhost:5000/api/students', newStu)
      .then(res => {
        console.log("Đã thêm:", res.data);
        // Cập nhật state students để hiển thị luôn học sinh mới:
        setStudents(prev => [...prev, res.data]);
        // Xóa nội dung form sau khi thêm thành công
        setName(""); 
        setAge(""); 
        setStuClass("");
        setSuccessMsg("Thêm học sinh thành công!");
        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch(err => console.error("Lỗi khi thêm:", err));
  };

  const handleDelete = (id) => {
    if (!id) return;
    const ok = window.confirm("Bạn có chắc muốn xóa học sinh này?");
    if (!ok) return;
    setSuccessMsg("");
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(() => {
        setStudents(prev => prev.filter(s => s._id !== id));
        setSuccessMsg("Đã xóa học sinh thành công!");
        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch(err => console.error("Lỗi khi xóa:", err));
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quản lý học sinh</h1>
        
        {successMsg && <div className="alert success-message">{successMsg}</div>}
        
        {/* Form thêm học sinh */}
        <div className="add-student-form">
          <h2>Thêm học sinh mới</h2>
          <form onSubmit={handleAddStudent}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Họ tên" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="number" 
                placeholder="Tuổi" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                required 
                min="1"
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Lớp" 
                value={stuClass} 
                onChange={e => setStuClass(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-add">Thêm học sinh</button>
          </form>
        </div>

        {/* Danh sách học sinh */}
        <div className="students-container">
          <h2>Danh sách học sinh</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary sort-btn"
              onClick={() => setSortAsc(prev => !prev)}
            >
              Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
            </button>
          </div>
          {students.length === 0 ? (
            <p>Chưa có học sinh nào trong danh sách.</p>
          ) : (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => (
                  <tr key={student._id || student.name}>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/edit/${student._id}`)}
                        disabled={!student._id}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(student._id)}
                        disabled={!student._id}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<EditStudent />} />
        <Route path="*" element={
          <div className="App">
            <header className="App-header">
              <h1>Không tìm thấy trang</h1>
              <Link className="btn-secondary" to="/">Quay về trang chính</Link>
            </header>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
