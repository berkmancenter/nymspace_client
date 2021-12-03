<template>
  <div class="mx-auto w-3/5">
    <CreateAccountForm />

    <router-link class="inline-block underline text-blue-600 mt-10" to="/"
      >Return Home</router-link
    >
  </div>
</template>
<script>
import CreateAccountForm from "../components/CreateAccountForm.vue";
export default { components: { CreateAccountForm } };
</script>
