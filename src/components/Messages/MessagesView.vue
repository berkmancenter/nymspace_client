<template>
  <div class="flex flex-col items-center flex-1 flex-shrink w-full h-1 overflow-y-auto border-gray-500 rounded-b mr-8">
    <div v-if="itemsWithSeparators.length" class="flex flex-col flex-shrink w-full h-1">
      <template v-for="item in itemsWithSeparators" :key="item.id || item.separatorKey">
        <div v-if="item.isSeparator" class="flex items-center my-4 px-4">
          <div class="flex-1 h-px bg-gray-300"></div>
          <div class="px-3 text-sm font-medium text-gray-600 bg-white">
            {{ item.dateLabel }}
          </div>
          <div class="flex-1 h-px bg-gray-300"></div>
        </div>
        <MessageViewItem
          v-else
          :item="item"
          v-bind="$attrs"
          :user-id="userId"
          @reply-click="$emit('reply-click', $event)"
          @view-thread="$emit('view-thread', $event)"
        />
      </template>
    </div>
    <div v-if="!items.length" class="flex flex-col justify-center flex-1 w-full p-2 text-center text-gray-500">
      Start chatting
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, isToday, isYesterday } from 'date-fns'
import MessageViewItem from './MessageViewItem.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

defineEmits(['reply-click', 'view-thread'])

function formatDateForSeparator(date) {
  const messageDate = new Date(date)

  if (isToday(messageDate)) {
    return 'Today'
  }

  if (isYesterday(messageDate)) {
    return 'Yesterday'
  }

  function getOrdinal(day) {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  const day = parseInt(format(messageDate, 'd'))
  const ordinal = getOrdinal(day)

  return format(messageDate, `eeee, MMMM d'${ordinal}'`)
}

const itemsWithSeparators = computed(() => {
  if (!props.items || props.items.length === 0) {
    return []
  }

  const result = []
  let lastDate = null

  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i]
    const currentDate = format(new Date(item.createdAt), 'yyyy-MM-dd')

    // Add separator at the beginning for the first message
    if (i === 0) {
      result.push({
        isSeparator: true,
        separatorKey: `separator-${currentDate}`,
        dateLabel: formatDateForSeparator(item.createdAt)
      })
    }
    // Add separator if this is a new day (for subsequent messages)
    else if (lastDate && lastDate !== currentDate) {
      result.push({
        isSeparator: true,
        separatorKey: `separator-${currentDate}`,
        dateLabel: formatDateForSeparator(item.createdAt)
      })
    }

    result.push(item)
    lastDate = currentDate
  }

  return result
})
</script>
