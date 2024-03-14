import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/xbb-excel",
    name: "xbbExcel",
    component: () =>
      import(/* webpackChunkName: "excel" */ "@/views/excel/index.vue"),
  },
  {
    path: "/xbb-word",
    name: "xbbWord",
    component: () =>
      import(/* webpackChunkName: "excel" */ "@/views/word/index.vue"),
  },
  {
    path: "/xbb-word-template",
    name: "xbbWordTemplate",
    component: () =>
      import(/* webpackChunkName: "excel" */ "@/views/word-template/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
