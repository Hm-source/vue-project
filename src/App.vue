<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useProductStore } from '@/stores/product'
const product = useProductStore()
</script>

<template>
  <header>
    <div class="header-content">
      <div class="logo-container">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      </div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <div class="count-container">
        count: {{ product.count }}
        <button @click="product.increment">up</button>
      </div>
    </div>
    <RouterView />
  </header>
</template>

<style>
header {
  width: 100%;
  background-color: rgb(255, 252, 252);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  width: 125px;
  height: 125px;
}

nav {
  display: flex;
  align-items: center;
  padding: 20px;
}

nav a {
  margin: 10px;
  padding: 10px;
  text-decoration: none;
  color: #333;
}

.count-container {
  display: flex;
  align-items: center;
}

button {
  margin-left: 10px;
}
</style>
