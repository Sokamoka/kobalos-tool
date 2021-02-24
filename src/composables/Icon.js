// Example for dynamic imports from folder
// I didn't use it
import { defineAsyncComponent } from 'vue';

export const iconComponents = new Map();

const modules = import.meta.glob('/src/assets/svgs/*.svg');

Object.keys(modules).forEach((key) => {
  const name = key.match(/^\/src\/assets\/svgs\/(.*)\.svg$/)[1];
  iconComponents.set(
    name,
    defineAsyncComponent(() => modules[key]())
  );
});
