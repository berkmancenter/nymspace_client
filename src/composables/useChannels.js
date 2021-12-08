import store from "./global/useStore";
import { reactive } from "vue";
export default async function () {
  const { loadChannels, getChannels } = store;
  await loadChannels();
  return {
    channels: getChannels,
  };
}
