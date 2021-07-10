<template>
  <div>
    <div class="content-header">
      <h5 class="is-size-5 is-flex is-align-items-flex-start">
        <span class="content-header-icon">{{ viewTitle }}</span>
        <div class="content-header-title word-wrap">
          {{ contentTitle }}
        </div>
      </h5>
    </div>
  </div>
</template>

<script>
import styles from '@/assets/scss/Shared/ContentHeader/index.scss'

export default {
  name: 'content-header-index',
  props: ['viewTitle', 'contentTitle'],
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  beforeCreate() {
    styles.use()
  },
  unmounted() {
    styles.unuse()
  },
}
</script>
