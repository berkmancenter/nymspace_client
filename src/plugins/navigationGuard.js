import { VueCookieNext } from "vue-cookie-next";
import store from "../composables/global/useStore";

const { loadNewPseudonym, registerOnce } = store;

async function checkAndLoadNewPseudonym(next) {
  const pseudonym = VueCookieNext.getCookie("pseudonym");
  const token = VueCookieNext.getCookie("token");
  if (pseudonym === null || token === null) {
    await loadNewPseudonym();
    await registerOnce().then((x) => next());
  } else next();
}

function isThreadsPage(to) {
  return (
    to.name === "home.threads" &&
    to.params.threadId !== null &&
    to.params.channelId !== null
  );
}

function isChannelsPage(to) {
  return to.name === "home.channels" && to.params.channelId !== null;
}

function isLoginSignupPage(to) {
  return ["home.login", "home.createAccount"].includes(to.name);
}

export default async (to, from, next) => {
  const accessToken = VueCookieNext.getCookie("access_token");

  // Logged in and login/signup page
  if (accessToken && isLoginSignupPage(to)) {
    next({
      name: "home.featured",
    });
  }

  // Home page
  // Allow accessing the threads page with a shared link
  // Allow accessing the channels page with a shared link
  else if (
    to.name === "home.featured" ||
    isThreadsPage(to) ||
    isChannelsPage(to)
  ) {
    await checkAndLoadNewPseudonym(next);
  }

  // Not logged in and not login/signup page
  else if (!isLoginSignupPage(to) && !accessToken) {
    // Redirect to home by default when no token is present
    next({
      name: "home.featured",
    });
  } else {
    next();
  }
};
