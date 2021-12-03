<template>
  <form>
    <p class="mt-4">
      Create an account to be able to login on this application:
    </p>
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="text"
      placeholder="new username"
    />
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="password"
      placeholder="password"
    />
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="password"
      placeholder="confirm password"
    />
    <input class="log-in-btn" type="submit" value="create account" />
    <div class="clear-both"></div>
  </form>
</template>
<style scoped>
.log-in-btn {
  @apply w-full md:w-auto text-center float-left bg-white border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-3 hover:bg-gray-100 cursor-pointer;
}
</style>
