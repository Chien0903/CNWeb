import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all users
export const getUsers = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi tải dữ liệu: ${error.message}`);
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi tải user: ${error.message}`);
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/', userData);
    return response.data;
  } catch (error) {
    throw new Error(`Không thể tạo user: ${error.message}`);
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/${id}`, { ...userData, id });
    return response.data;
  } catch (error) {
    throw new Error(`Không thể cập nhật user: ${error.message}`);
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    await api.delete(`/${id}`);
    return true;
  } catch (error) {
    throw new Error(`Không thể xóa user: ${error.message}`);
  }
};

export default api;

