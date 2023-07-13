<script setup>
import ProductUpdate from '@/components/ProductUpdate.vue'
</script>

<template>
  <Suspense>
    <ProductUpdate />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
