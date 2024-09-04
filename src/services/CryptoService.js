import axios from 'axios';

const apiClient1 = axios.create({
  baseURL: 'https://criptoya.com/api',
});

const apiClient2 = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest',
  headers: { 'x-apikey': '60eb09146661365596af552f' },
});

// Exportando los servicios
export default {
  getPrice(exchange, coin, volumen) {
    return apiClient1.get(`/${exchange}/${coin}/ARS/${volumen}`);
  },

  PostSaveCryptoPurchase(objectsDataPurchase) {
    return apiClient2.post('/transactions', objectsDataPurchase);
  },

  PostSaveCryptoSale(objectsDataSale) {
    return apiClient2.post('/transactions', objectsDataSale);
  },

  // Puedes descomentar este método si lo necesitas en el futuro
  savedPurchase(userId) {
    const queryString = `?q={"user_id": "${userId}"}`;
    return apiClient2.get(`/transactions${queryString}`);
  },

  /* updateCoins(userId, discountCoins){
    const queryString = `?q={"user_id": "${userId}"}`;
    return apiClient2.put(`/transactions${queryString}`);
  } */

};
