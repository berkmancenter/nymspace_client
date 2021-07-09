<template>
  <div class="header-current-topic">
  </div>
</template>

<script>
import styles from '@/assets/scss/HeaderCurrentTopic/index.scss'

export default {
  name: 'header-current-topic-index',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
