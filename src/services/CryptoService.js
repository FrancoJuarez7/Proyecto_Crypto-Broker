import axios from 'axios';

const apiClient1 = axios.create({
  baseURL: 'https://criptoya.com/api',
});

const apiClient2 = axios.create({
  baseURL: 'https://laboratorio3-5459.restdb.io/rest/',
  headers: { 'x-apikey': '64a57c2b86d8c50fe6ed8fa5' },
});

export default {

  getPrice(coin, exchange) {
    const exchangeNow = exchange || 'letsbit';
    return apiClient1.get(`/${exchangeNow}/${coin}/ARS/${0.1}`);
  },

  PostSaveCryptoPurchase(objectsDataPurchase) {
    const purchaseData = { ...objectsDataPurchase, datetime: new Date().toISOString() }; // Crea una copia del objeto original
    return apiClient2.post('/transactions', purchaseData);
  },

  PostSaveCryptoSale(objectsDataSale) {
    return apiClient2.post('/transactions', objectsDataSale);
  },

  savedPurchase(userId) {
    const queryString = `?q={"user_id": "${userId}"}`;
    return apiClient2.get(`/transactions${queryString}`);
  },

  editTransaction(idTransaction, updateTransaction) {
    return apiClient2.patch(`/transactions/${idTransaction}`, updateTransaction);
  },

  deleteTransaction(idTransaction) {
    return apiClient2.delete(`/transactions/${idTransaction}`);
  },
};
