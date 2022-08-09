<template>
  <div class="mx-auto w-4/5 lg:w-3/5 login-bg">
    <div class="flex gap-12 flex-col lg:flex-row">
      <div class="lg:w-2/5">
        <LoginForm />
      </div>
      <div class="ring-gray-500 ring-2 p-2 lg:mt-4 lg:w-3/5 lg:self-center">
        <p>Logged in, your pseudonyms develop <b>reputation</b>.</p>

        <p>You may create up to 5 pseudonyms assocated with one account.</p>

        <p>
          After [1 week], your account receives the ability to downvote messages
          in a thread.
        </p>

        <p>
          Good community behavior is rewarded, and vice versa: if your messages
          repeatedly receive downvotes, suggesting the community finds them
          unhelpful or inappropriate, your ability to downvote will be revoked
          (until a sufficient number of upvotes are accumulated).
        </p>

        <p>Please email threads_qs@eon.law.harvard.edu with any questions about your account.</p>
      </div>
    </div>
    <router-link
      class="inline-block hover:underline text-red-500 font-bold mt-10"
      to="/"
      >Return Home</router-link
    >
  </div>
</template>
<script>
import LoginForm from "../components/LoginForm.vue";
export default { components: { LoginForm } };
</script>
<style scoped>
.login-bg p {
  @apply mt-2;
}
</style>
