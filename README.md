# Crypto Broker

**Crypto Broker** es una aplicación web para gestionar y monitorear una cartera de criptomonedas, permitiendo realizar compras y ventas de criptomonedas, visualizar el historial de transacciones, editar o eliminar transacciones individuales y llevar un registro de las ganancias y perdidas de dinero. Este proyecto es el trabajo final de la materia *Laboratorio de Computación III* (2023).

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Configuración del Entorno](#configuración-del-entorno)
- [Uso](#uso)
- [API](#api)
- [Contribuciones](#contribuciones)

---

## Descripción

La aplicación permite a los usuarios:

- Crear una cartera de criptomonedas personalizada.
- Realizar compras y ventas de criptomonedas en pesos argentinos (ARS).
- Consultar el estado actual de sus inversiones.
- Analizar el rendimiento histórico de sus inversiones.
- Registrar cada transacción en una base de datos para garantizar la persistencia de datos.
- Consultar, editar o eliminar transacciones individuales en el historial.

## Funcionalidades

### Pantalla de Login
- El usuario debe ingresar un **ID alfanumérico** que identificará todas sus transacciones en la aplicación.

### Pantalla de Registro de Compra/Venta
- Permite registrar una nueva compra o venta de criptomonedas.
- **Campos requeridos**:
  - Exchange.
  - Criptomoneda.
  - Cantidad de criptomoneda.
- El sistema valida que la cantidad de criptomoneda y el monto en ARS sean mayores a 0.
- Cada transacción se guarda en una base de datos.

### Historial de Movimientos
- Muestra todas las transacciones realizadas por el usuario.
- La API devuelve una lista de transacciones filtradas por el ID del usuario.

### Lectura, Edición y Borrado de Transacciones
- Cada transacción registrada puede:
  - Consultarse a detalle.
  - Editar la transaccion.
  - Eliminar la transaccion.
- Al editar o eliminar, se actualizarán automáticamente los datos financieros del usuario.

### Pantalla de Análisis del Estado Actual && Análisis de Inversiones
- Proporciona una vista del estado actual de las finanzas del usuario.
- - Muestra:
  - Las criptomonedas poseídas, su cantidad, y el equivalente en dinero en base al precio actual.
  - El monto total de dinero.
  - El resultado de las inversiones, indicando ganancias o pérdidas para cada criptomoneda.

## Tecnologías Utilizadas

- **Vue.js** (con Vuex para el manejo del estado).
- **Axios** para la gestión de las peticiones HTTP.
- **HTML** y **CSS** para la estructura y estilo de la aplicación.

## APIs Utilizadas
- **RESTdb.io** para almacenar y consultar transacciones de usuarios.
- **CriptoYa** para obtener precios actuales de criptomonedas.

## Contribuciones
¡Gracias por tu interés en contribuir al desarrollo de esta aplicación de criptomonedas! Si tienes ideas para mejorar sus características, has encontrado algún inconveniente o te gustaría colaborar en su evolución, no dudes en contactarnos.

Estamos abiertos a sugerencias, reportes de problemas y pull requests. Cada aporte es bienvenido y será de gran ayuda para hacer crecer y perfeccionar esta aplicación. ¡Tu participación es realmente valiosa para nosotros!
