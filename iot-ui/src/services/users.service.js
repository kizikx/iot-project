import axios from 'axios';

function login(username, password) {
  return axios.post('/login', {
    username,
    password,
  }).then((response) => response)
    .catch((error) => error.response);
}

function logout() {
  localStorage.removeItem('token');
}

function getUsers() {
  return axios.get('/user', {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

function addUser(data) {
  return axios.post('/user', data, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

function updateUser(username, data) {
  return axios.patch(`/user/${username}`, data, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

function deleteUser(username) {
  return axios.delete(`/user/${username}`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

export default {
  login,
  logout,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
