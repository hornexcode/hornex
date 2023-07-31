import axios from 'axios';

export const baseAPI = axios.create({
  baseURL: 'http://localhost:3000',
});

export const api = () => {
  if (window === undefined) {
  }
};
