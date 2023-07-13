<script setup>
import ProductInfo from '@/components/ProductInfo.vue'
</script>

<template>
  <Suspense>
    <ProductInfo />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
