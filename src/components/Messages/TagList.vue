<template>
  <div :class="getClass" :style="getStyle">
    <template v-for="item in items" :key="item">
      <TagListItem :item="item" @tag-click="tagClick" />
    </template>
  </div>
</template>

<script>
import TagListItem from "./TagListItem.vue";

export default {
  components: {
    TagListItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    left: {
      type: Number,
      required: true,
    },
    top: {
      type: Number,
      required: true,
    },
  },
  computed: {
    getClass() {
      let className =
        "absolute bg-white rounded p-3 items-center border-2 border-gray-500";
      if (!this.visible) className += " hidden";
      return className;
    },
    getStyle() {
      let style =
        "min-height: 100px; left: " + this.left + "px; top: " + this.top + "px";
      return style;
    },
  },
  methods: {
    tagClick(item) {
      this.$emit("tag-click", item);
    },
  },
};
</script>
