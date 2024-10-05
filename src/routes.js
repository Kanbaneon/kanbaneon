import { defineAsyncComponent } from "vue";
import * as VueRouter from "vue-router";
import { store } from "./store";
import { reauth } from "./helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";
const getToken = () => (isLite ? "LITE" : localStorage.getItem("token"));

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
          store.commit("setProfile");
          return true;
        } else {
          store.commit("setUser", {
            isLoggedIn: false,
            username: "",
            id: undefined,
          });
          localStorage.removeItem("token");
          return { path: "/login" };
        }
      } else {
        return { path: "/login" };
      }
    };

const forgotGuard = (route) => {
  if (!route.query?.type) {
    return { path: "/forgot", query: { type: "password" } };
  }
  return true;
};

const nonLiteRoutes = [
  {
    path: "/teams",
    name: "Your teams",
    component: defineAsyncComponent({
      loader: () => import("./components/Teams/Teams.vue"),
    }),
    beforeEnter: sessionGuard,
    props: true,
  },
  {
    path: "/teams/:id",
    component: defineAsyncComponent({
      loader: () => import("./components/Teams/Team.vue"),
    }),
    name: "Your teams ",
    beforeEnter: sessionGuard,
    props: true,
  },
  {
    path: "/profile",
    name: "Your Profile",
    component: defineAsyncComponent({
      loader: () => import("./components/Users/Profile.vue"),
    }),
    beforeEnter: sessionGuard,
    props: true,
  },
  {
    path: "/settings",
    name: "Settings",
    component: defineAsyncComponent({
      loader: () => import("./components/Settings/index.vue"),
    }),
    beforeEnter: sessionGuard,
    props: true,
  },
  {
    path: "/terms-and-conditions",
    component: () => import("./components/Views/TermsAndConditions.vue"),
  },
  {
    path: "/forgot",
    beforeEnter: forgotGuard,
    component: () => import("./components/Auth/Forgot.vue"),
  },
  {
    path: "/recovery",
    component: () => import("./components/Auth/Recovery.vue"),
  },
];

export const routes = [
  {
    path: "/",
    beforeEnter: sessionGuard,
    props: true,
    redirect: "/boards",
  },
  {
    path: "/login",
    component: () => import("./components/Auth/Login.vue"),
    beforeEnter: logoutGuard,
    props: true,
  },
  {
    path: "/signup",
    component: () => import("./components/Auth/SignUp.vue"),
    beforeEnter: logoutGuard,
    props: true,
  },
  {
    path: "/boards",
    name: "Your boards",
    component: () => import("./components/Boards/Boards.vue"),
    beforeEnter: sessionGuard,
    props: true,
  },
  {
    path: "/boards/:id",
    component: defineAsyncComponent({
      loader: () => import("./components/Boards/Board.vue"),
    }),
    name: "Your boards ",
    beforeEnter: sessionGuard,
    props: true,
  },
  ...(!isLite ? nonLiteRoutes : []),
  {
    path: "/:pathMatch(.*)*",
    component: () => import("./components/Views/NotFound.vue"),
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
