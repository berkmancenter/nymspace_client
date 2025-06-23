import { ref, nextTick, onMounted, onUnmounted, unref } from 'vue'

/**
 * Composable for managing scroll behavior and new message notifications
 * @param {Object} options - Configuration options
 * @param {Ref} options.containerRef - Reference to the scrollable container element
 * @param {String|Ref|ComputedRef} options.userId - Current user's ID (can be string, ref, or computed)
 * @returns {Object} Scroll management utilities
 */
export function useMessageScroll({ containerRef, userId }) {
  const newMessagesNotice = ref(false)
  const lastMessageScrollOffset = ref(0)
  const scrollThreshold = -5 // Pixels from bottom to consider "at bottom"

  const getCurrentUserId = () => unref(userId)

  const isAtBottom = () => {
    if (!containerRef.value) {
      return true
    }
    const element = containerRef.value.$el || containerRef.value
    const offset = element.scrollTop - (element.scrollHeight - element.offsetHeight)
    return offset > scrollThreshold
  }

  const scrollToBottom = async (behavior = 'instant') => {
    await nextTick()
    setTimeout(() => {
      if (!containerRef.value) return
      const element = containerRef.value.$el || containerRef.value
      element.scrollTo({
        top: element.scrollHeight,
        left: 0,
        behavior
      })
    }, 50)
  }

  const handleNewMessage = async (message, forceScroll = false) => {
    const currentUserId = getCurrentUserId()
    const shouldAutoScroll = forceScroll || message.owner === currentUserId || isAtBottom()

    if (shouldAutoScroll) {
      await scrollToBottom()
      newMessagesNotice.value = false
    } else {
      newMessagesNotice.value = true
    }
  }

  const handleScroll = () => {
    if (!containerRef.value) {
      return
    }
    const element = containerRef.value.$el || containerRef.value
    lastMessageScrollOffset.value = element.scrollTop - (element.scrollHeight - element.offsetHeight)

    if (isAtBottom()) {
      newMessagesNotice.value = false
    }
  }

  const onNewMessagesClick = () => {
    scrollToBottom('smooth')
    newMessagesNotice.value = false
  }

  const setupScrollListener = () => {
    if (!containerRef.value) {
      return
    }
    const element = containerRef.value.$el || containerRef.value
    element.addEventListener('scroll', handleScroll, { passive: true })
  }

  const cleanupScrollListener = () => {
    if (!containerRef.value) {
      return
    }
    const element = containerRef.value.$el || containerRef.value
    element.removeEventListener('scroll', handleScroll)
  }

  onMounted(() => {
    setTimeout(setupScrollListener, 100)
  })

  onUnmounted(() => {
    cleanupScrollListener()
  })

  return {
    newMessagesNotice,
    lastMessageScrollOffset,
    isAtBottom,
    scrollToBottom,
    handleNewMessage,
    onNewMessagesClick,
    setupScrollListener,
    cleanupScrollListener
  }
}
