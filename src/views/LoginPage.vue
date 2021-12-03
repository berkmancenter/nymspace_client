<template>
  <div class="mx-auto w-3/5 login-bg">
    <LoginForm />

    <p>Logged in, your pseudonyms develop <b>reputation</b>.</p>

    <p>You may create up to 5 pseudonyms assocated with one account.</p>

    <p>
      After [1 week], your account receives the ability to downvote messages in
      a thread.
    </p>

    <p>
      Good community behavior is rewarded, and vice versa: if your messages
      repeatedly receive downvotes, suggesting the community finds them
      unhelpful or inappropriate, your ability to downvote will be revoked
      (until a sufficient number of upvotes are accumulated).
    </p>

    <p>Please email XXX@XXX with any questions about your account.</p>

    <router-link class="inline-block underline text-blue-600 mt-10" to="/"
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
  @apply mt-4;
}
</style>
