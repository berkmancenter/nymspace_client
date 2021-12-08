import store from "./global/useStore";
import { reactive } from "vue";
export default async function () {
  const { loadChannels, getChannels, getLoggedInStatus } = store;
  if (getLoggedInStatus.value) {
    await loadChannels();
  }
  return {
    channels: getChannels,
  };
}
