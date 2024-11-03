<template>
  <router-view/>
</template>

<style>

body {
    margin: 0;
    overflow: hidden; /* Oculta cualquier desbordamiento */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-color:  rgb(30, 35, 41);
  min-width: 900px;
  min-height: 700px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: white;
}

nav a.router-link-exact-active {
  color: #94ebc4;
}
</style>
