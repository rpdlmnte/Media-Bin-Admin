import { RouteRecordRaw } from "vue-router";
import OidcCallbackError from "@/views/Oidc/OidcCallbackError.vue";

const oidcAuthRoutes: Array<RouteRecordRaw> = [
  {
    path: "/_oidc-callback",
    name: "OidcCallback",
    component: () =>
      import(
        /* webpackChunkName: "bundle.oidc" */ "@/views/Oidc/OidcCallback.vue"
      ),
  },
  {
    path: "/protected",
    name: "Protected",
    component: () =>
      import(/* webpackChunkName: "protected" */ "@/views/Oidc/Protected.vue"),
  },
  {
    path: "/_oidc-callback-error", // Needs to match redirect_uri in you oidcSettings
    name: "OidcCallbackError",
    component: OidcCallbackError,
    meta: {
      isPublic: true,
    },
  },
];

const generalRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Homepage",
    component: () =>
      import(/* webpackChunkName: "bundle.test" */ "@/views/Admin/File.vue"),
    // meta: {
    //   isPublic: true
    // }
  },
  {
    path: "/AppPermission",
    name: "AppPermission",
    component: () =>
      import(
        /* webpackChunkName: "bundle.initial" */ "@/views/Admin/AppPermission.vue"
      ),
  },

  {
    path: "/User",
    name: "User",
    component: () =>
      import(/* webpackChunkName: "bundle.initial" */ "@/views/Admin/User.vue"),
  },

  // Catch All 404 page
  { path: "/:pathMatch(.*)*", redirect: "/" },
];
const routes: Array<RouteRecordRaw> = [...oidcAuthRoutes, ...generalRoutes];

export default routes;
