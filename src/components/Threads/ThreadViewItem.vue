<template>
  <p
    class="my-1 thread-message"
    :class="getMessageClass(item)"
    :title="item.createdAt"
  >
    <b @click="addToMessage(this)">{{ item.pseudonym || item.owner }}</b
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

function addToMessage(el) {
  let textArea = document.getElementById("messageTextArea");
  let existingText = textArea.value.trim();
  let pseudonym = el.item.pseudonym;
  if (pseudonym.indexOf(" ") > -1) pseudonym = '"' + pseudonym + '"';
  if (existingText.indexOf(pseudonym) > -1) return;
  if (existingText != "") existingText += " ";
  textArea.value = existingText + "@" + pseudonym + " ";
  textArea.focus();
}

function getMessageClass(item) {
  return item.votes < -1 ? "text-gray-400" : "text-black";
}

const threadLink = computed(
  () => "/threads/" + this.$route.params.channel + "/" + this.item.name
);
</script>

<style scoped>
.thread-message b {
  @apply cursor-pointer;
}
</style>
