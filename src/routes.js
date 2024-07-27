import { defineAsyncComponent } from "vue";
import * as VueRouter from "vue-router";
import { store } from "./store";
import { reauth } from "./helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";
const getToken = () => (isLite ? "LITE" : localStorage.getItem("token"));

const loginGuard = isLite
  ? () => {
      if (!store.state.user.isLoggedIn) {
        return { path: "/login" };
      }
      return true;
    }
  : async () => {
      const token = getToken();
      if (token) {
        try {
          const result = await reauth(token);

          if (result?.success) {
            store.state.user = {
              username: result.reauth.username,
              isLoggedIn: true,
            };
          } else {
            store.commit("setUser", {
              isLoggedIn: false,
              username: "",
              id: undefined,
            });
            localStorage.removeItem("token");
            return { path: "/login" };
          }
        } catch (ex) {
          console.error(ex);
          return { path: "/login" };
        }
      }

      if (!store.state.user.isLoggedIn) {
        return { path: "/login" };
      }
      return true;
    };

const logoutGuard = isLite
  ? () => {
      if (store.state.user.isLoggedIn) {
        return { path: "/" };
      }
      return true;
    }
  : async () => {
      const token = getToken();
      if (token) {
        try {
          const result = await reauth(token);

          if (result?.success) {
            store.state.user = {
              username: result.reauth.username,
              isLoggedIn: true,
            };
          } else {
            store.commit("setUser", {
              isLoggedIn: false,
              username: "",
              id: undefined,
            });
            localStorage.removeItem("token");
          }
        } catch (ex) {
          console.error(ex);
        }
      }

      if (store.state.user.isLoggedIn) {
        return { path: "/" };
      }
      return true;
    };

const sessionGuard = isLite
  ? () => {
      if (!store.state.user.isLoggedIn) {
        return { path: "/login" };
      }
      return true;
    }
  : async () => {
      const token = getToken();
      if (token) {
        const result = await reauth(token);

        if (result?.success) {
          store.state.user = {
            username: result.reauth.username,
            isLoggedIn: true,
          };
        } else {
          store.commit("setUser", {
            isLoggedIn: false,
            username: "",
            id: undefined,
          });
          localStorage.removeItem("token");
          return { path: "/login" };
        }
      }
      return true;
    };

const routes = [
  {
    path: "/",
    component: () => import("./components/Home.vue"),
    beforeEnter: loginGuard,
    props: true,
  },
  {
    path: "/login",
    component: () => import("./components/Login.vue"),
    beforeEnter: logoutGuard,
    props: true,
  },
  {
    path: "/signup",
    component: () => import("./components/SignUp.vue"),
    beforeEnter: logoutGuard,
    props: true,
  },
  { path: "/board", redirect: "/" },
  {
    path: "/board/:id",
    component: defineAsyncComponent({
      loader: () => import("./components/Canvas.vue"),
    }),
    beforeEnter: sessionGuard,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("./components/NotFound.vue"),
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
