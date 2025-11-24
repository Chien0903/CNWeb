import { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import Pagination from './components/Pagination';
import { getUsers, createUser, updateUser, deleteUser } from './services/api';
import './App.css';

const STORAGE_KEY = 'crud_users_data';
const DELETED_IDS_KEY = 'crud_deleted_ids';

// Helper functions for localStorage
const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getUsersFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveDeletedIds = (ids) => {
  try {
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving deleted IDs:', error);
  }
};

const getDeletedIds = () => {
  try {
    const stored = localStorage.getItem(DELETED_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading deleted IDs:', error);
    return [];
  }
};

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const itemsPerPage = 5;

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Load users from API and merge with localStorage
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load from API
      const apiUsers = await getUsers();
      
      // Load from localStorage
      const storedUsers = getUsersFromStorage();
      const deletedIds = getDeletedIds();
      
      // Filter out deleted users from API data
      const filteredApiUsers = apiUsers.filter(user => !deletedIds.includes(user.id));
      
      // Merge: stored users (created/updated) + filtered API users
      // Create a map of stored users by ID for quick lookup
      const storedUsersMap = new Map(storedUsers.map(user => [user.id, user]));
      
      // Start with API users, replace with stored versions if they exist
      const mergedUsers = filteredApiUsers.map(user => {
        return storedUsersMap.get(user.id) || user;
      });
      
      // Add new users that don't exist in API (created locally)
      storedUsers.forEach(storedUser => {
        if (!mergedUsers.find(u => u.id === storedUser.id)) {
          mergedUsers.push(storedUser);
        }
      });
      
      // Sort by ID
      mergedUsers.sort((a, b) => a.id - b.id);
      
      setUsers(mergedUsers);
      setFilteredUsers(mergedUsers);
      
      // Save to localStorage
      saveUsersToStorage(mergedUsers);
    } catch (err) {
      setError(err.message);
      // If API fails, try to load from localStorage
      const storedUsers = getUsersFromStorage();
      if (storedUsers.length > 0) {
        setUsers(storedUsers);
        setFilteredUsers(storedUsers);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Open modal for add
  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
    setError('');
  };

  // Open modal for edit
  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setIsModalOpen(true);
      setError('');
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError('');
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      setError('');
      if (editingUser) {
        // Update user
        const updatedUser = await updateUser(editingUser.id, formData);
        // Manually update UI (as required)
        const updatedUsers = users.map(u => 
          u.id === editingUser.id 
            ? { ...updatedUser, address: formData.address } 
            : u
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        // Save to localStorage
        saveUsersToStorage(updatedUsers);
        showSuccessMessage('Cập nhật user thành công!');
      } else {
        // Create user
        const newUser = await createUser(formData);
        // Manually update UI (simulate new ID since API doesn't save)
        // Ensure new ID is greater than all existing IDs (including API users)
        const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
        // Start from 1000 to avoid conflicts with API IDs (1-10)
        const newId = maxId >= 1000 ? maxId + 1 : Math.max(1000, maxId + 1);
        const userWithId = { ...newUser, id: newId };
        const updatedUsers = [...users, userWithId];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        // Save to localStorage
        saveUsersToStorage(updatedUsers);
        showSuccessMessage('Thêm user thành công!');
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      return;
    }

    try {
      setError('');
      await deleteUser(userId);
      // Manually update UI (as required)
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      // Save to localStorage
      saveUsersToStorage(updatedUsers);
      
      // Track deleted IDs (for users from API)
      const deletedIds = getDeletedIds();
      if (!deletedIds.includes(userId)) {
        deletedIds.push(userId);
        saveDeletedIds(deletedIds);
      }
      
      showSuccessMessage('Xóa user thành công!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show success message
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="container">
      <header>
        <h1>Quản lý Users</h1>
        <p>Ứng dụng CRUD với JSONPlaceholder API</p>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message show">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message show">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên..."
          />
          <span className="search-icon">🔍</span>
        </div>
        <button className="btn btn-primary" onClick={handleAddUser}>
          + Thêm User Mới
        </button>
      </div>

      {/* User Table */}
      <UserTable
        users={currentUsers}
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* User Form Modal */}
      {isModalOpen && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          error={error}
        />
      )}
    </div>
  );
}

export default App;
