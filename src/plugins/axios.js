import axios from "axios";
import { VueCookieNext } from "vue-cookie-next";

axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${VueCookieNext.getCookie("user_access_token")}`;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    function refreshToken() {
      const refreshingCall = axios
        .post(`${import.meta.env.VITE_API_SERVER_URL}/v1/auth/refresh-tokens`, {
          refreshToken: VueCookieNext.getCookie("user_refresh_token"),
        })
        .then((res) => {
          VueCookieNext.setCookie("user_access_token", res.data.access.token);
          VueCookieNext.setCookie("user_refresh_token", res.data.refresh.token);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access.token}`;

          return Promise.resolve(true);
        });

      return refreshingCall;
    }

    if (status === 401 && !error.config.repeating) {
      if (error.request.responseURL.includes("refresh-token")) {
        return Promise.reject(error);
      }

      return refreshToken().then(() => {
        error.config.headers[
          "Authorization"
        ] = `Bearer ${VueCookieNext.getCookie("user_access_token")}`;
        error.config.baseURL = undefined;
        error.config.repeating = true;
        return axios.request(error.config);
      });
    }

    return Promise.reject(error);
  }
);

const customAxios = axios;
export default customAxios;
