import axios from 'axios';

function getDataByTopic(topic) {
  return axios.get(`/esp/topic/${topic}`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

function getDataByESP(id, topic) {
  return axios.get(`/esp/${id}/${topic}`, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('token')}`,
    },
  }).then((response) => response.data);
}

export default {
  getDataByTopic,
  getDataByESP,
};
