import axios from 'axios';

const apiClient1 = axios.create({
  baseURL: 'https://criptoya.com/api',
});

const apiClient2 = axios.create({
  baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
  headers: { 'x-apikey': '60eb09146661365596af552f' },
});

// Exportando los servicios
export default {

  getPrice(coin, exchange) {
    const exchangeNow = exchange || 'letsbit';
    return apiClient1.get(`/${exchangeNow}/${coin}/ARS/${0.1}`);
  },

  /* Esta llamada va a ser para obtener todos los precios de todas las criptos, que las voy a mostrar en los carteles en una pagina
  principal, habia pensaod con el array de todos los nombres, trabajarlo por ese lado para pasarle los nombres, comparar los precios mas
  bajos para la compra y mas altos para la venta y mostrar
  fetchSamplePricesForUsers(exchange, coin) {
    return apiClient1.get(`/${exchange}/${coin}/ARS/${1}`);
  } */

  PostSaveCryptoPurchase(objectsDataPurchase) {
    // Crear una copia del objeto original
    const purchaseData = { ...objectsDataPurchase, datetime: new Date().toISOString() };
    return apiClient2.post('/transactions', purchaseData);
  },

  PostSaveCryptoSale(objectsDataSale) {
    return apiClient2.post('/transactions', objectsDataSale);
  },

  // Puedes descomentar este método si lo necesitas en el futuro
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
