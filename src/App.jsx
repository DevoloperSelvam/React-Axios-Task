import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './App.css';
import PropTypes from 'prop-types';

const apiEndpoint = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  // Fetch users on component mount
  useEffect(() => {
    axios.get(apiEndpoint)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  // Add a new user
  const addUser = (newUser) => {
    axios.post(apiEndpoint, newUser)
      .then(response => {
        setUsers([...users, response.data]);
      })
      .catch(error => console.error('Error adding user:', error));
  };

  // Update an existing user
  const updateUser = (id, updatedUser) => {
    axios.put(`${apiEndpoint}/${id}`, updatedUser)
      .then(response => {
        setUsers(users.map(user => user.id === id ? response.data : user));
        setEditingUser(null); // Clear editing user after update
      })
      .catch(error => console.error('Error updating user:', error));
  };

  // Delete a user
  const deleteUser = (id) => {
    axios.delete(`${apiEndpoint}/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div>
      {editingUser ? (
        <EditUserForm user={editingUser} onUpdate={updateUser} />
      ) : (
        <>
          <AddUserForm onAdd={addUser} />
          <UserList users={users} onDelete={deleteUser} onEdit={setEditingUser} />
        </>
      )}
    </div>
  );
}

function UserList({ users, onDelete, onEdit }) {
  return (
    <Card>
      <Card.Body >
        {users.map(user => (
          <div className='null' key={user.id} style={{ width: '15rem', height: '6rem' }}>
            <Card.Title>{user.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
            {/* Add buttons for edit and delete operations */}
            <Button onClick={() => onEdit(user)} className='one' >Edit</Button>
            <Button onClick={() => onDelete(user.id)} className='two' >Delete</Button>
          </div>
        ))}

      </Card.Body>
    </Card>

  );
}

function AddUserForm({ onAdd }) {
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newUser);
    setNewUser({ name: '', email: '' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button type="submit">Add User</button>
    </form>

  );
}

function EditUserForm({ user, onUpdate }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedUser.id, editedUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={editedUser.name}
        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={editedUser.email}
        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
      />
      <button type="submit">Save Changes</button>
    </form>

  );
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

AddUserForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
}

EditUserForm.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  user: PropTypes.string
}

export default App;


