<template>
  <div
    ref="tagListRef"
    :class="!props.visible ? 'hidden' : ''"
    class="tags shadow-lg"
  >
    <template v-for="item in items" :key="item">
      <TagListItem :item="item" @tag-click="tagClick" />
    </template>
    <template v-if="items && items.length === 0">
      <div class="cursor-not-allowed text-harvard-red">No pseudonym found</div>
    </template>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import TagListItem from "./TagListItem.vue";

const emit = defineEmits(["tag-click"]);
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  msgTxtArea: {
    type: [Object, null],
    required: true,
  },
});

const tagListRef = ref(null);
const leftPlacement = ref(`${props.msgTxtArea?.offsetLeft + 3}px`);
const topPlacement = ref("0");

/**
 * Watch items length to update the top placement value
 * Update value after the items are visible on the screen
 * i.e. on next display cycle
 */
watch(
  () => props.items.length,
  () => {
    nextTick(() => {
      topPlacement.value = `${
        props.msgTxtArea?.offsetTop - tagListRef.value?.offsetHeight + 5
      }px`;
      leftPlacement.value = `${props.msgTxtArea?.offsetLeft + 3}px`;
    });
  }
);

function tagClick(item) {
  emit("tag-click", item);
}
</script>

<style>
.tags {
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  left: v-bind(leftPlacement);
  top: v-bind(topPlacement);
  @apply absolute bg-white rounded items-center border-2 border-black shadow-xl;
}
</style>
