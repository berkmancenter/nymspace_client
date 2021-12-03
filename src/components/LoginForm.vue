<template>
  <form>
    <p class="mt-4">
      Log in to retain a pseudonym across sessions, develop reputation, and
      create channels:
    </p>
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="text"
      placeholder="username"
    />
    <input
      class="border-2 border-gray-500 w-full h-12 px-3 text-lg mt-4"
      type="password"
      placeholder="password"
    />
    <input class="log-in-btn" type="submit" value="log in" />
    <router-link class="create-account-btn" to="create-account"
      >create account</router-link
    >
    <div class="clear-both"></div>
  </form>
</template>
<style scoped>
.log-in-btn {
  @apply w-full md:w-auto text-center float-left bg-white border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-3 hover:bg-gray-100 cursor-pointer;
}
.create-account-btn {
  @apply w-full md:w-auto text-center float-left inline-block border-2 border-gray-500 text-lg px-10 h-10 md:ml-4 mt-4 leading-9 hover:bg-gray-100;
}
</style>
