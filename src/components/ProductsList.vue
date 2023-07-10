<script setup>
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
counter.getProducts()
</script>

<template>
  <div class="store-products">
    <h1>products</h1>
    <div>
      <li v-for="(product, index) in counter.products" :key="index">
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
