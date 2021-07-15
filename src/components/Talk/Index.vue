<template>
  <div class="talk-view">
    <ContentHeader viewTitle="Trending topics"></ContentHeader>

    <div class="p-4">
      <ul>
        <li>Topic 1</li>
        <li>Topic 1</li>
        <li>Topic 1</li>
        <li>Topic 1</li>
        <li>Topic 1</li>
        <li>Topic 1</li>
        <li>Topic 1</li>
        <li>Topic 1</li>
      </ul>
    </div>

    <ContentHeader viewTitle="Trending threads" :color="appVariables.threadsColor"></ContentHeader>

    <div class="p-4">
      <ul>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
        <li>Thread 1</li>
      </ul>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/Shared/ContentHeader/Index'

export default {
  name: 'talk-index',
  components: {
    ContentHeader,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
@import '@/assets/scss/Talk/index.scss';
</style>
