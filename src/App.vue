<template>
  <router-view v-cloak name="sidebar" />
  <router-view v-cloak name="layoutContent" />
</template>

<script>
export default {
  name: 'app-homepage',
}
</script>

<style lang="scss">
@import '@/assets/scss/App.scss';
</style>
