<template>
  <div class="bg-gray-200 p-4">
    <div class="text-center text-2xl p-4">
      Hello, [<select class="bg-gray-200 w-32 text-red-500">
        <option class="text-red-500">
          {{ getUserToken?.substring(0, 20) }}...
        </option>
      </select>
      ]. Would you like to:
    </div>
    <component :is="validComponent" :user-token="getUserToken"></component>
  </div>
</template>

<script setup>
import LoggedInBanner from "./LoggedInBanner.vue";
import GuestBanner from "./GuestBanner.vue";

import ThreadService from "../../service";
import useStore from "../../composables/global/useStore";
import { VueCookieNext } from "vue-cookie-next";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { defineAsyncComponent } from "@vue/runtime-core";

const router = useRouter();

const { getLoggedInStatus, getUserToken } = useStore;

const validComponent = computed(() =>
  getLoggedInStatus.value
    ? defineAsyncComponent(() => import("./LoggedInBanner.vue"))
    : defineAsyncComponent(() => import("./GuestBanner.vue"))
);

if (getUserToken.value === null || getUserToken.value === "") {
  ThreadService.getNewToken().then((x) => updateUserToken(x));
}

// TODO: POC done to add to cookies. add navigation guards
async function login() {
  const creds = await ThreadService.registerToken(getUserToken.value);
  VueCookieNext.setCookie("access_token", creds.tokens.access.token);
  VueCookieNext.setCookie("access_token_expiry", creds.tokens.access.expires);
  VueCookieNext.setCookie("refresh_token", creds.tokens.refresh.token);
  VueCookieNext.setCookie("refresh_token_expiry", creds.tokens.refresh.expires);
  router.push({
    name: "home.channels",
  });
}
</script>
