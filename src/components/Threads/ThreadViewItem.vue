<template>
  <p class="my-1" :class="getMessageClass(item)" :title="item.createdAt">
    <b>{{ item.pseudonym || item.owner }}</b
    >: {{ item.body }}
  </p>
</template>

<script setup>
import { computed } from "vue";

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

function getMessageClass(item) {
  return item.votes < -1 ? "text-gray-400" : "text-black";
}

const threadLink = computed(
  () => "/threads/" + this.$route.params.channel + "/" + this.item.name
);
</script>
