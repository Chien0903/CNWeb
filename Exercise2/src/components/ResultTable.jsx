import React, { useState, useEffect } from "react";

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Tải dữ liệu 1 lần khi component mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  // Khi prop user thay đổi → thêm vào danh sách
  useEffect(() => {
    if (user) {
      setUsers((prev) => {
        const maxId = prev.length > 0 ? Math.max(...prev.map((u) => u.id)) : 0;
        return [...prev, { ...user, id: maxId + 1 }];
      });
      if (typeof onAdded === "function") onAdded();
    }
  }, [user, onAdded]);

  // Lọc danh sách theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  function handleEditChange(field, value) {
    if (["street", "suite", "city"].includes(field)) {
      setEditing({
        ...editing,
        address: { ...editing.address, [field]: value },
      });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  }

  function saveUser() {
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
    setEditing(null);
  }

  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => removeUser(u.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Sửa người dùng</h4>

            <label htmlFor="edit-name">Name: </label>
            <input
              id="edit-name"
              type="text"
              value={editing.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />

            <label htmlFor="edit-username">Username: </label>
            <input
              id="edit-username"
              type="text"
              value={editing.username}
              onChange={(e) => handleEditChange("username", e.target.value)}
            />

            <label htmlFor="edit-email">Email: </label>
            <input
              id="edit-email"
              type="text"
              value={editing.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />

            <label htmlFor="edit-street">Street: </label>
            <input
              id="edit-street"
              type="text"
              value={editing.address.street}
              onChange={(e) => handleEditChange("street", e.target.value)}
            />

            <label htmlFor="edit-suite">Suite: </label>
            <input
              id="edit-suite"
              type="text"
              value={editing.address.suite}
              onChange={(e) => handleEditChange("suite", e.target.value)}
            />

            <label htmlFor="edit-city">City: </label>
            <input
              id="edit-city"
              type="text"
              value={editing.address.city}
              onChange={(e) => handleEditChange("city", e.target.value)}
            />

            <label htmlFor="edit-phone">Phone: </label>
            <input
              id="edit-phone"
              type="text"
              value={editing.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
            />

            <label htmlFor="edit-website">Website: </label>
            <input
              id="edit-website"
              type="text"
              value={editing.website}
              onChange={(e) => handleEditChange("website", e.target.value)}
            />

            <button onClick={saveUser}>Lưu</button>
            <button onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
