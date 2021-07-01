<template>
  <div class="talk-session-ask">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <div class="is-flex is-justify-content-center">
            <img class="" alt="nymity logo" src="@/assets/images/logo.svg" />
          </div>

          <section class="section pt-4 pb-2">
            <h2 class="is-size-2">New user</h2>
            <p>If you want to use this user in the future note/copy the access key.</p>
            <p>You can use it later to use the same identity.</p>
            <p>Click on the code to copy it to your clipboard.</p>
            <p class="is-flex is-align-items-center pt-2">
              <input class="is-size-3" disabled value="rfbg45gh54hrtbnrth54h" />
              <button class="button is-success ml-2">Login</button>
            </p>
          </section>

          <hr />

          <section class="section pt-2 pb-0">
            <h2 class="is-size-2">Returning user</h2>
            <p>Enter your access key</p>
            <p class="is-flex is-align-items-center pt-2">
              <input class="is-size-3" />
              <button class="button is-success ml-2">Login</button>
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'talk-session-ask-index',
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>
