import { RouteRecordRaw } from "vue-router";
import { Bar } from "../components/Bar";
import { Foo } from "../components/Foo";
import { Welcome } from "../views/Welcome";

export const routes: RouteRecordRaw[] = [
  {
    path: "/welcome",
    component: Welcome,
    children: [
      // 注意子路由没有‘/’
      { path: "foo", component: Foo },
      { path: "bar", component: Bar },
    ],
  },
];
