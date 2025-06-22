<template>
  <div class="px-2 py-1 cursor-pointer hover:bg-gray-100" @click="tagClick(item)">
    <slot>
      {{ item }}
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      required: true
    }
  },
  emits: ['tag-click'],

  methods: {
    tagClick(item) {
      this.$emit('tag-click', item)
    }
  }
}
</script>
