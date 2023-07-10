<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
import ProductsList from '../components/ProductsList.vue'
</script>

<template>
  <main>
    <Suspense>
      <ProductsList />
    </Suspense>
  </main>
</template>
