<script setup>
import axios from 'axios'
const { data } = await axios.get('https://fakestoreapi.com/products')
const products = data
</script>

<template>
  <div class="store-products">
    <h1>products</h1>
    <div>
      <div v-for="(product, index) in products" :key="index">
        <div class="product">
          <div class="product-img">
            <img :src="product.image" width="40px" height="40px" :alt="product.title" />
          </div>
          <div class="product-info">
            <router-link :to="`/product/${product.id}`">title : {{ product.title }}</router-link>
            <p>price : {{ product.price }}</p>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.product {
  border: solid 1px gray;
  border-radius: 10px;
  padding: 10px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin: 4px;
  width: 100%;
}
.product .product-img {
  float: left;
  width: 30%;
  display: flex;
  justify-content: center;
  margin: auto;
}
.product-img img {
  width: 100px;
  height: 100px;
}
.product-info {
  float: left;
  width: 70%;
  padding: 10px;
}
</style>
