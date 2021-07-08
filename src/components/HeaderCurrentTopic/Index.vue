<template>
  <div class="header-current-topic">
    {{ $store.state.user.currentTopic.name }}
  </div>
</template>

<script>
import styles from './../../assets/scss/HeaderCurrentTopic/index.scss'

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
