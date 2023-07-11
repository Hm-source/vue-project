import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/about",
    component: () => import("../views/aboutView.vue"),
  },
  {
    path: "/product/:id",
    component: () => import("../views/DetailView.vue"),
  },
  {
    path: "/product/:id/update",
    component: () => import("../views/UpdateView.vue"),
  },
];

export const createRouter = () =>
  _createRouter({
    history: import.meta.env.SSR // SSR 이면 memory 아니면 web 으로 
      ? createMemoryHistory("/")
      : createWebHistory("/"),
    routes,
  });