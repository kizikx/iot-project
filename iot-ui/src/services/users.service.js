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

export default {
  login,
  logout,
};
