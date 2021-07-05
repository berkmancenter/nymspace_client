<template>
  <div class="new-topic-view">
    <form>
      <h1 class="is-size-2">Create new topic</h1>

      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <input class="input" type="text" required />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-success">Create</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import styles from '@/assets/scss/Topics/NewTopic/index.scss'

export default {
  name: 'new-topic-index',
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
