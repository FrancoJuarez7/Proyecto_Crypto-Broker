import axios from 'axios';

const apiClient1 = axios.create({
  baseURL: 'https://criptoya.com/api',
});

const apiClient2 = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
  headers: { 'x-apikey': '60eb09146661365596af552f' },
});

// api/{coin}/{fiat}/{volumen} --> /api/BTC/ARS/1
export default {

  getPrice(exchange, coin, volumen) {
    return apiClient1.get(`/${exchange}/${coin}/ARS/${volumen}`);
  },

  postloadpurchase(objectsDataPurchase) {
    return apiClient2.post('/transactions', objectsDataPurchase);
  },

};
