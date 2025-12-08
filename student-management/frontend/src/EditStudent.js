import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setError('');
    setLoading(true);
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        setName(res.data.name || '');
        setAge(res.data.age || '');
        setStuClass(res.data.class || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Không tải được thông tin học sinh');
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const payload = { name, age: Number(age), class: stuClass };
    axios.put(`http://localhost:5000/api/students/${id}`, payload)
      .then(res => {
        setSuccessMsg('Cập nhật thành công!');
        setTimeout(() => {
          navigate('/');
        }, 800);
      })
      .catch(err => {
        console.error('Lỗi khi cập nhật:', err);
        setError(err.response?.data?.error || 'Cập nhật thất bại');
      });
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Chỉnh sửa học sinh</h1>
          <p>Đang tải dữ liệu...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chỉnh sửa học sinh</h1>

        {error && <div className="alert error-message">{error}</div>}
        {successMsg && <div className="alert success-message">{successMsg}</div>}

        <div className="add-student-form">
          <form onSubmit={handleUpdate}>
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
            <div className="form-actions">
              <button type="submit" className="btn-add">Lưu thay đổi</button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Hủy</button>
            </div>
          </form>
        </div>
      </header>
    </div>
  );
}

export default EditStudent;

