<template>
  <transition-group name="flip-list" tag="div">
    <template v-for="item in items" :key="item.name">
      <ChannelListItem :item="item" />
    </template>
  </transition-group>
</template>

<script>
import ChannelListItem from "./ChannelListItem.vue";

export default {
  components: {
    ChannelListItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.2s ease;
}
</style>
