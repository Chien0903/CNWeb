import React from "react";

function AddUser({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  const handleAdd = () => {
    if (user.name.trim() === "" || user.username.trim() === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    if (typeof onAdd === "function") onAdd(user);
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: "",
    });
    setAdding(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {!adding ? (
        <button onClick={() => setAdding(true)}>Thêm</button>
      ) : (
        <div style={{ display: "grid", gap: 8, textAlign: "left" }}>
          <h4>Thêm người dùng</h4>

          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={user.name}
            onChange={handleChange}
          />

          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={user.username}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />

          <label htmlFor="street">Street:</label>
          <input
            id="street"
            type="text"
            value={user.address.street}
            onChange={handleChange}
          />

          <label htmlFor="suite">Suite:</label>
          <input
            id="suite"
            type="text"
            value={user.address.suite}
            onChange={handleChange}
          />

          <label htmlFor="city">City:</label>
          <input
            id="city"
            type="text"
            value={user.address.city}
            onChange={handleChange}
          />

          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            type="text"
            value={user.phone}
            onChange={handleChange}
          />

          <label htmlFor="website">Website:</label>
          <input
            id="website"
            type="text"
            value={user.website}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd}>Lưu</button>
            <button onClick={() => setAdding(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;
