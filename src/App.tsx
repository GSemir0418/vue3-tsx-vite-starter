import { withModifiers, defineComponent, ref } from "vue";
import { RouterView } from "vue-router";
import { Welcome } from "./views/Welcome";

export const App = defineComponent({
  setup() {
    const count = ref(0);

    const inc = () => {
      count.value++;
    };

    return () => (
      <>
        <div onClick={withModifiers(inc, ["self"])}>{count.value}</div>
        <RouterView />
      </>
    );
  },
});
