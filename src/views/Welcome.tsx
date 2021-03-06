import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
export const Welcome = defineComponent({
  setup(props, context) {
    return () => (
      <>
        <div class={s.wrapper}>Welcome!</div>
        <RouterView />
      </>
    );
  },
});
