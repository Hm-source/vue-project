<script setup>
// import { useCounterStore } from '@/stores/counter'
// const counter = useCounterStore()
// counter.getProducts()
import axios from 'axios'
const { data } = await axios.get('https://fakestoreapi.com/products')
const products = data
</script>

<template>
  <div class="store-products">
    <h1>products</h1>
    <div>
      <li v-for="(product, index) in products" :key="index">
        <div class="product">
          <img :src="product.image" width="40px" height="40px" :alt="product.title" />
          <div>
            <h3>{{ product.title }}</h3>
            <h3>{{ product.description }}</h3>
            <h3>{{ product.price }}</h3>
          </div>
        </div>
      </li>
    </div>
  </div>
</template>
<style>
img {
  width: 40px;
  height: 40px;
}
</style>
