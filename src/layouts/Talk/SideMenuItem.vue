<template>
  <div class="talk-view-side-menu-item" :class="{ 'talk-view-side-menu-item-active': open }">
    <div class="talk-view-side-menu-item-header">
      <div
        class="talk-view-side-menu-item-header-button talk-view-side-menu-item-header-toggler"
        @click="toggleSection()"
      >
        <div><i class="fa fa-arrow-down"></i></div>
      </div>
      <div class="talk-view-side-menu-item-header-title">
        <slot name="header-title"></slot>
      </div>
      <div class="talk-view-side-menu-item-header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <div class="talk-view-side-menu-item-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'talk-side-menu-item-index',
  components: {},
  data() {
    return {
      open: true,
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    toggleSection() {
      this.open = !this.open
    },
  },
}
</script>
