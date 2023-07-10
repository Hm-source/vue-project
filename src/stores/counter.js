import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const products = ref([])
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  async function getProducts() {
    if (products.value.length > 0) {
      return products.value
    } else {
      const { data } = await axios.get('https://fakestoreapi.com/products')
      products.value = data
    }
  }
  return { count, products, doubleCount, increment, getProducts }
})
