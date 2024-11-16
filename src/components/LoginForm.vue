<template>
  <div class="login-form">
    <div id="banner">
      <h1>CRYPTO BROKER</h1>
    </div>

    <section id="login" class="section-box">
      <form @submit.prevent="submitForm">
        <label for="nameUser" id="user" class="icon">U</label>
        <input type="text" v-model="nameUser" placeholder="Enter your name" autocomplete="off"> <br><br>

        <p v-if="errorMessageNameUser"  id="error-mensaje">{{ errorMessageNameUser }}</p>

        <label for="password" id="password" class="icon">w</label>
        <input type="password" v-model="password" placeholder="Enter your password" autocomplete="off"> <br> <br>

        <p v-if="errorMessagePassword"  id="error-mensaje">{{ errorMessagePassword }}</p>

        <button type="submit" class="logIn">LOG IN</button>
        <button type="submit" class="cancel" @click.prevent="cancel">CANCEL</button>
      </form>
    </section>
  </div>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  name: 'LoginForm',
  data() {
    return {
      password: '',
      cryptoValueQuote: {},
      errorMessagePassword: '',
      errorMessageNameUser: '',
      nameUser: '',
    };
  },
  methods: {
    /**
 * Cancela el proceso de ingreso de datos y limpia las propiedades relacionadas.
 *
 * Este método restablece las propiedades `password`, `nameUser`, `errorMessagePassword` y
 * `errorMessageNameUser` a sus valores iniciales, dejando el formulario listo para nuevos datos.
 *
 * @returns {void} No devuelve ningún valor..
 */
    cancel() {
      this.password = '';
      this.nameUser = '';
      this.errorMessagePassword = '';
      this.errorMessageNameUser = '';
    },

    /**
 * Envía el formulario, validando los campos de nombre de usuario y contraseña.
 *
 * Este método valida si la contraseña y el nombre de usuario cumplen con los requisitos establecidos.
 * Si algún campo no es válido, se muestra un mensaje de error. Si ambos campos son válidos, actualiza los valores
 * de la contraseña, el nombre de usuario, y redirige al usuario a la página de compra y venta.
 *
 * @returns {void} No devuelve ningún valor.
 */
    submitForm() {
      this.errorMessagePassword = '';
      this.errorMessageNameUser = '';

      const { isValidPassword, isValidNameUser } = this.isValid(this.password, this.nameUser);

      if (!isValidPassword) {
        this.errorMessagePassword = '* The password must be 8 characters and alphanumeric.';
        this.isVisibleErrorMessageNPassword = true;
      } else {
        this.updatePassword(this.password);
        this.errorMessagePassword = '';
      }

      if (!isValidNameUser) {
        this.isVisibleErrorMessageNameUser = true;
        this.errorMessageNameUser = '* The username must be between 5 and 10 characters and alphanumeric.';
      } else {
        this.updateNameUser(this.nameUser);
        this.errorMessageNameUser = '';
      }

      if (isValidNameUser && isValidPassword) {
        this.$router.push({ name: 'buying-and-selling' });
      }
    },

    /**
 * Valida la contraseña y el nombre de usuario según ciertos criterios.
 *
 * Este método verifica que la contraseña tenga exactamente 8 caracteres alfanuméricos,
 * y que el nombre de usuario tenga entre 5 y 10 caracteres, al menos con una letra.
 *
 * @param {string} password La contraseña que se desea validar.
 * @param {string} nameUser El nombre de usuario que se desea validar.
 * @returns {Object} Un objeto con las propiedades `isValidPassword` e `isValidNameUser`,
 * que indican si los campos son válidos o no según las reglas definidas.
 */
    isValid(password, nameUser) {
      const isValidPassword = password.length === 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
      const isValidNameUser = nameUser.length <= 10 && nameUser.length >= 5
                              && /[a-zA-Z]/.test(this.nameUser) && /[a-zA-Z]/.test(nameUser);

      return {
        isValidPassword,
        isValidNameUser,
      };
    },

    ...mapActions(['updatePassword', 'updateNameUser']),

  },
};
</script>

<style scoped>

@font-face {
  font-family: "WebSymbolsRegular";
  src: url(/src/assets/fonts/websymbols-regular-webfont.eot);
  src: url(/src/assets/fonts/websymbols-regular-webfont.eot?#iefix) format('embedded-opentype'),
  url(/src/assets/fonts/websymbols-regular-webfont.woff) format('woff'),
  url(/src/assets/fonts/websymbols-regular-webfont.ttf) format('truetype'),
  url(/src/assets/fonts/websymbols-regular-webfont.svg#WebSymbolsRegular) format('svg');
  font-weight: normal;
  font-style: normal;
}

.icon{
  font-family: WebSymbolsRegular;
  color:#141414
}

#error-mensaje {
  color: red;
  font-size: 14px;
  height: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  margin-left: 46px;
}

.login-form{
  width: 1250px;
  margin: 0px auto;
}

.section-box{
  width: 50%;
  height: 240px;
  margin: 0px auto;
  margin-top: 20px;
  padding-top: 2px;
}

#user,
#password{ /*ACA ACOMODA EL ICON EN EL INPUT */
  display: block;
  text-align: center;
  position: absolute;
  margin-left: 50px;
  margin-top: 7px;
}

#password{
  margin-left: 50px;
  margin-top: 26px;
  font-size: 20px;
}

input[type="text"]:focus,
input[type="password"]:focus{
  color: #141414;
  box-shadow: 2px 2px 2px grey inset;
  outline: none;
}

input[type="text"],
input[type="password"]{
  display: block;
  margin: 0px auto;
  margin-top: 20px;
  width: 82%;
  height: 30px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #ccc inset;
  border-radius: 5px;
  padding-left: 33px; /*A partir de aca se va a empezar a escribir, dejando lugar para el icon*/
  color: gray;
}

button:hover{
  box-shadow: 0px 0px 5px gray;
}

.logIn,
.cancel {
  text-align: center;
  padding: 10px 20px;
  color: black;
  background: rgb(247, 166, 0);
  border: 1px solid #081f27;
  border-radius: 5px;
  cursor: pointer;
  font-size: 17px;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  margin-left: 35px;
  margin-top: 10px;
  transition: background 300ms, box-shadow 300ms;
  box-shadow: 0px 6px 8px rgba(179, 121, 121, 0.2);
}

#banner{
  width: 87%; /*Ocupara el 80% del contenedor que lo contiene para que quede cimetrico con lo de arriba*/
  height: 110px;
  border: 10px solid whitesmoke;
  box-shadow: 0px 0px 5px gray ;
  background: url("../assets/crypto.jpg");
  background-position: -145px -130px;
  margin: 15px auto;
  animation: backBanner 10s linear;
  overflow: hidden; /*Importante para las animaciones*/
}

@keyframes backBanner{ /*Se mueve la posicion del fondo del banner, durante 10s*/
    0%{
      background-position: 100px 0px ;
    }
    100%{
      background-position: -200px -200px;
    }
}

#banner h1{
  width: 850px;
  font-family: "BebasNeue";
  color: white;
  font-size: 45px;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 2px 2px 1px black;
  margin: 20px auto;
  animation: showText 10s linear;
}

@keyframes showText{
    0%{
      transform: translateX(-600%) scale(5,5);
      opacity: 1;
    }
    50%{
      transform: translateX(600%) scale(5,5);
      opacity: 1;
    }
    75%{
      transform: translateX(-600%) scale(5,5);
      text-shadow: none;
      color: transparent;
      opacity: 0;
    }
    100%{
      transform: translateX(0%) scale(1,1);
      opacity: 1;
    }
}

</style>
