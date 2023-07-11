<script setup>
import axios from 'axios'
import { useRoute } from 'vue-router'
const route = useRoute()
const { data } = await axios.get(`https://fakestoreapi.com/products/${route.params.id}`)
const product = data
const save = async () => {
  let productInfo = {
    title: product.title,
    description: product.description,
    price: product.price
  }
  const { data } = await axios.put(
    `https://fakestoreapi.com/products/${route.params.id}`,
    productInfo
  )
  if (data.error) {
    alert('save error')
    return
  } else {
    alert('save complete')
  }
}
</script>

<template>
  <div>
    <h1>product id : {{ product.id }}</h1>
    <div class="product">
      <div class="product-img">
        <img :src="product.image" :alt="product.title" />
      </div>
      <div class="product-info-modify">
        <div>
          <label for="title">title : </label>
          <input id="title" type="text" v-model="product.title" />
        </div>
        <div>
          <label for="description">description : </label>
          <textarea id="description" type="text" v-model="product.description" />
        </div>
        <div>
          <label for="price">price : </label>
          <input id="price" type="text" v-model="product.price" />
        </div>
      </div>
    </div>
    <div>
      <router-link :to="`/product/${product.id}`">이전</router-link>
      <router-view></router-view>
      <button @click.prevent="save">저장</button>
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
  width: 20%;
  display: flex;
  justify-content: center;
  margin: auto;
}
.product-img img {
  width: 100px;
  height: 100px;
}
.product-info-modify {
  float: left;
  width: 70%;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.product-info-modify div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-info-modify input {
  width: 90%;
  padding: 10px 20px;
  margin: 5px 0;
  box-sizing: border-box;
  border: none;
  background-color: #fff8dc;
  color: olive;
}
.product-info-modify textarea {
  width: 90%;
  padding: 10px 20px;
  margin: 5px 0;
  box-sizing: border-box;
  border: none;
  background-color: #fff8dc;
  color: olive;
}
</style>
