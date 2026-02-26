<template>
  <NuxtLayout :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
useThemeMode()

const layoutName = computed(() => {
  if (route.path.startsWith('/admin')) {
    return 'admin'
  }

  return 'default'
})
</script>
