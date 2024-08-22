<template>
  <div class="mx-auto w-4/5 lg:w-3/5 login-bg flex-1">
    <div class="flex gap-12 flex-col lg:flex-row">
      <div class="lg:w-2/5">
        <CreateAccountForm />
      </div>
      <div class="ring-gray-500 lg:mt-10 lg:w-3/5 lg:self-center">
        <p>Attaching an email to your account is optional.</p>
        <p>
          Adding an email enables recovery of forgotten passwords, and gives
          users the option to archive inactive Threads on the interface for more
          than 90 days.
        </p>
      </div>
    </div>
    <router-link class="inline-block underline font-bold my-10" to="/"
      >Return Home</router-link
    >
  </div>
</template>
<script>
import CreateAccountForm from "../components/CreateAccountForm.vue";
export default { components: { CreateAccountForm } };
</script>

<style scoped>
.signup-bg p {
  @apply mt-2;
}
</style>
