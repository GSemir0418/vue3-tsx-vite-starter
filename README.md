---
title: "Vue3+tsx+vite项目搭建"
date: 2022-06-09T15:58:46+08:00
author: "gsemir"
lastmod: 2022-06-09T15:58:46+08:00
draft: false
categories: ["项目实战"]
tags: ["vite","pnpm","vue3"]
---

> React:[GSemir0418/react-vite-ts-starter: big screen, vite, ts (github.com)](https://github.com/GSemir0418/react-vite-ts-starter)
>
> Vue3:[GSemir0418/vue3-tsx-vite-starter: 基于pnpm+vue3+vite+tsx搭建的项目初始化模板 (github.com)](https://github.com/GSemir0418/vue3-tsx-vite-starter)

# 1 项目搭建

## 1.1 创建Vite-vue-ts项目

```sh
pnpm create vite vue3-tsx-vite-starter -- --template vue-ts (报错就换npm)
cd mangosteen-fe-1
pnpm install
pnpm run dev
```

- `pnpm run build` 报node_modules的错
  - 解决：tsconfig添加`"skipLibCheck": true`，使ts在打包过程中跳过依赖检查


- `pnpm run preview`=` build + http-server dist`

- 如果dist目录不小心push了，修改gitignore也没有用的话，
  - 可以使用`git rm -r --cached dist`删除远端的 保留本地的

## 1.2 项目目录

```tree
.
├── dist
│   └── ...
├── index.html
├── node_modules
│   └── ...
├── package.json
├── pnpm-lock.yaml
├── public
│   └── favicon.ico
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   ├── components
│   ├── env.d.ts
│   ├── main.ts
│   ├── shared
│   └── views
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

- 如果创建空文件夹，git默认是不会把它加入暂存区管理的，所以在里面创建.keep文件占位


## 1.3 template vs tsx

- 实现单击+1


```vue
// App.vue
<script setup lang="ts">
import { ref } from 'vue';
  const count = ref(0)
  const onClick = () => {
    count.value += 1
  }
</script>

<template>
  <h1>
    {{count}}
  </h1>
  <div>
    <button @click="onClick">+1</button>
  </div>
</template>

<style>
</style>
```

- 配置jsx/tsx支持


> [Render Functions & JSX | Vue.js (vuejs.org)](https://vuejs.org/guide/extras/render-function.html#jsx-tsx)

- 安装官方插件


> [vite/packages/plugin-vue-jsx at main · vitejs/vite (github.com)](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)

`pnpm i -D @vitejs/plugin-vue-jsx`

```tsx
// vite.config.ts
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [
    vueJsx({
      transformOn: true,
      mergeProps: true
    })
  ]
}
```

- 现在尝试使用tsx实现相同的功能


```tsx
// App2.tsx
import { defineComponent, ref } from "vue";

// export const 是带名字的导出，方便ide引入提示
export const App2 = defineComponent({
  setup() {
    const refCount = ref(0);
    const onClick = () => {
      refCount.value += 1;
    };
    // 这里要return一个函数，函数返回值为tsx元素
    return () => (
      <>
        {/* 这里跟template语法不同，需手动.value */}
        <h1>{refCount.value}</h1>
        <div>
          <button onClick={onClick}>+1</button>
        </div>
      </>
    );
  },
});
```

# 2 引入Vue Router 4

> [Getting Started | Vue Router (vuejs.org)](https://router.vuejs.org/guide/#router-view)

- 安装：`pnpm i vue-router@4`


- 设置snippets代码段

  - Ctrl shift p snippet 选择typescriptreact

  ```json
  // typescriptreact.json
  {
  	"VueComponent": {
    	"prefix": "vc",
      "body": [
        "import { defineComponent } from \"vue\";",
        "  export const $1 = defineComponent({",
        "    setup(props,context) {",
        "      return () => (<div>$2</div>);",
        "    },",
        "  });"
      ]
    }
  }
  ```

- 创建路由页面


```tsx
// src/views/Bar.tsx
import { defineComponent } from "vue";
export const Bar = defineComponent({
  setup(props, context) {
    return () => <div>Bar</div>;
  },
});
```

- 在挂载前引入路由组件


```tsx
// main.ts
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { App } from "./App";
import { Bar } from "./views/Bar";
import { Foo } from "./views/Foo";

// 路由文件
const routes = [
  { path: "/", component: Foo },
  { path: "/bar", component: Bar },
];
// 传入路由配置
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const app = createApp(App);
// 使用router
app.use(router);
app.mount("#app");
```

- App.tsx


```tsx
import { defineComponent } from "vue";
import { RouterLink, RouterView } from "vue-router";

export const App = defineComponent({
  setup() {
    return () => (
      <>
        <div>
          <ul>
            <li>
              {/* 路由跳转链接 */}
              <RouterLink to={"/"}>Foo</RouterLink>
            </li>
          </ul>
        </div>
        {/* 展示路由视图的区域 */}
        <RouterView />
      </>
    );
  },
});
```

- Git技巧 +1 

  - 如果基于上次的commit后还有一些细节补充，又不想再commit一次


  - 可以先`git add .`，再`git commit -m "message" --amend`


  - 在commit时，-m后的信息可以与之前保持一致，也可以用新的message覆盖之前的


# 3 页面划分与布局

## 3.1 前端路由

| 页面         | 组件           |
| ------------ | -------------- |
| /welcome/1~4 | layout/welcome |

## 3.2 欢迎页面

- 欢迎页面根路由


```tsx
// src/views/Welcome.tsx
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
export const Welcome = defineComponent({
  setup(props, context) {
    return () => (
      <div>
        {/* 需要定义子路由渲染组件 */}
        <RouterView />
      </div>
    );
  },
});
```

- 欢迎页面子路由*4


```tsx
// src/components/welcome/first.tsx
import { defineComponent } from "vue";
export const First = defineComponent({
  setup(props, context) {
    return () => <div>First</div>;
  },
});
```

- 定义路由


```ts
// src/config/routes.ts
import { RouteRecordRaw } from "vue-router";
...
import { Welcome } from "../views/Welcome";

// 类型可在createRouter API找
export const routes: RouteRecordRaw[] = [
  {
    path: "/welcome",
    component: Welcome,
    children: [
      // 注意子路由没有‘/’
      { path: "1", component: First },
      { path: "2", component: Second },
      { path: "3", component: Third },
      { path: "4", component: Forth },
    ],
  },
];
```

# 4 配置与使用CSS Modules

- 安装sass
  - `pnpm i sass`
- Vite默认支持CSS Modules
- 重置默认样式的代码抽离到assets/stylesheet/reset.scss中

```scss
// assets/stylesheet/reset.scss
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
*::before, *::after {
    box-sizing: border-box;
}

a {
    color:inherit;
    text-decoration: none;
}

h1, h2, h3, h4, h5 {
    font-weight: normal;
}

button, input {
    font:inherit;
}
```

- 颜色作为变量，方便管理与主题切换功能

  - 定义
    - [var() - CSS: Cascading Style Sheets | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/CSS/var)

  ```scss
  // assets/stylesheet/vars.scss
  // :root 是根元素的伪类，表示html元素，优先级较html元素高
  :root {
      --welcome-card-bg-color: #999
  }
  ```

  - 使用

  ```scss
  background-color: var(--welcome-card-bg-color)
  ```

- 跨平台中文字体解决方案

> [Fonts.css (zenozeng.github.io)](https://zenozeng.github.io/fonts.css/)

```scss
// App.scss 全局样式
@import './assets/stylesheet/reset.scss';
@import './assets/stylesheet/vars.scss';

body {
    // 跨平台中文字体解决方案
    font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
    font-style: 16px;
    color: #333;
}
```

- CSS Modules样例

```tsx
// Welcome.tsx
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
import mangosteen from "../assets/icons/mangosteen.svg";
export const Welcome = defineComponent({
  setup(props, context) {
    return () => (
      <div class={s.wrapper}>
        <header>
          <img src={mangosteen} alt="" />
          <h1>GS记账</h1>
        </header>
        {/* 需要定义子路由渲染组件 */}
        <main>
          <RouterView />
        </main>
      </div>
    );
  },
});
```

```scss
// Welcome.module.scss
.wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    // 线性背景色
    background-image: linear-gradient(to bottom, #a0eacf 0%, #014872 100%);
    header {
        // 固定尺寸
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        // 居中
        justify-content: center;
        align-items: center;
        padding-top: 66px;
        color: #D4D4EE;
    }
    main {
        // 尺寸自动伸缩
        flex-grow: 1;
        // 子元素也能利用flex自动伸缩
        display: flex;
        flex-direction: column;
    }
}
```

- 统计代码量
  - `pnpm i cloc -g`

  - `cloc --vcs=git`
