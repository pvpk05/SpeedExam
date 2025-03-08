
import axios from 'axios';

// const API_BASE_URL="http://194.238.17.64:5002";



const API_BASE_URL="https://rsexamsbackend.ramanasoft.com:5002";



const Service=
{
    post: (endpoint, data, config = {}) => {
        console.log(data);
        return axios.post(`${API_BASE_URL}${endpoint}`, data, config);
      },
    
      get: (endpoint, config = {}) => {
        return axios.get(`${API_BASE_URL}${endpoint}`, config);
      },

      put: (endpoint, data, config = {}) => {
        return axios.put(`${API_BASE_URL}${endpoint}`, data, config);
      },

      delete: (endpoint, config = {}) => {
        return axios.delete(`${API_BASE_URL}${endpoint}`, config);
      },


}
export default Service;