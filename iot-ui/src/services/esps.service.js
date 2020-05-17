import axios from 'axios';

function getESPs() {
  return axios.get('/esp', {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

function updateESP(id, data) {
  return axios.patch(`/esp/${id}`, data, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

export default {
  getESPs,
  updateESP,
};
