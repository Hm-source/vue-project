<script setup>
import axios from 'axios'
import { useRoute } from 'vue-router'
const route = useRoute()
const { data } = await axios.get(`https://fakestoreapi.com/products/${route.params.id}`)
const product = data
</script>

<template>
  <div>
    <h1>product id : {{ product.id }}</h1>
    <div class="product">
      <div class="product-img">
        <img :src="product.image" :alt="product.title" />
      </div>
      <div class="product-info">
        <p>title : {{ product.title }}</p>
        <p>desc : {{ product.description }}</p>
        <p>price : {{ product.price }}</p>
        <p>category : {{ product.category }}</p>
        <p>rate : {{ product.rating.rate }}</p>
        <p>count : {{ product.rating.count }}</p>
      </div>
    </div>
    <div>
      <router-link :to="`/product/${product.id}/update`">수정</router-link>
      <router-view></router-view>
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
.product-img {
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
