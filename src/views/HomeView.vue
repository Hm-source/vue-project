<script setup>
import ProductsList from '@/components/ProductsList.vue'
</script>

<template>
  <Suspense>
    <ProductsList />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
<style>
img {
  width: 40px;
  height: 40px;
}
</style>
