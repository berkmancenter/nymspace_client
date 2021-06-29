<template>
  <div>
    <notifications group="main" />

    <router-view v-cloak />
  </div>
</template>

<script>
import styles from './assets/scss/App.scss'

export default {
  name: 'app-homepage',
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
