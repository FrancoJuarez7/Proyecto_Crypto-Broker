import axios from 'axios';

const apiClient1 = axios.create({
  baseURL: 'https://criptoya.com/api',
});

const apiClient2 = axios.create({
  baseURL: 'https://labor3-d60e.restdb.io/rest/',
  headers: { 'x-apikey': '64a2e9bc86d8c525a3ed8f63' },
});

// Exportando los servicios
export default {

  getPrice(coin, exchange) {
    const exchangeNow = exchange || 'letsbit';
    return apiClient1.get(`/${exchangeNow}/${coin}/ARS/${0.1}`);
  },

  PostSaveCryptoPurchase(objectsDataPurchase) {
    // Crear una copia del objeto original
    const purchaseData = { ...objectsDataPurchase, datetime: new Date().toISOString() };
    return apiClient2.post('/transactions', purchaseData);
  },

  PostSaveCryptoSale(objectsDataSale) {
    return apiClient2.post('/transactions', objectsDataSale);
  },

  savedPurchase(userId) {
    const queryString = `?q={"user_id": "${userId}"}`;
    return apiClient2.get(`/transacons${queryString}`);
  },

  editTransaction(idTransaction, updateTransaction) {
    return apiClient2.patch(`/transactions/${idTransaction}`, updateTransaction);
  },

  deleteTransaction(idTransaction) {
    return apiClient2.delete(`/transactions/${idTransaction}`);
  },
};
