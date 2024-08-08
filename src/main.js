import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "./override.css";
import { router } from "./routes";
import { clearDB, setUpDB, store } from "./store";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

if (isLite) {
  setUpDB()
    .then(() => {
      const app = createApp(App);
      app.use(Antd);
      app.use(store);
      app.use(router);
      app.mount("#app");
    })
    .catch((ex) => {
      console.error(ex);
    });
} else {
  //main app is purely stateless
  clearDB()
    .then(() => {
      const app = createApp(App);
      app.use(Antd);
      app.use(store);
      app.use(router);
      app.mount("#app");
    })
    .catch((ex) => {
      console.error(ex);
    });
}
