import store from "./global/useStore";
import { reactive } from "vue";
export default function () {
  const storeChannels = store.getChannels.value;
  const channels = reactive(storeChannels);
  return {
    channels,
  };
}
