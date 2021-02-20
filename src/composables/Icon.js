import IconEdit from "../assets/svgs/create.svg?component";
import IconClear from "../assets/svgs/clear.svg?component";
import IconTimes from "../assets/svgs/clear.svg?component";
import IconSearch from "../assets/svgs/search.svg?component";
import IconDelete from "../assets/svgs/delete.svg?component";
import IconAddCircle from "../assets/svgs/add-circle.svg?component";
import IconremoveCircle from "../assets/svgs/remove-circle.svg?component";

export const iconNames = new Map()
  .set("edit", IconEdit)
  .set("clear", IconClear)
  .set("times", IconTimes)
  .set("search", IconSearch)
  .set("delete", IconDelete)
  .set("add-circle", IconAddCircle)
  .set("remove-circle", IconremoveCircle);

// const modules = import.meta.glob("/src/assets/svgs/*.svg");
// console.log(modules);
// const iconComponents = {};

// Object.keys(modules).forEach((key) => {
//   // const name = key.match();
//   const name = "search";
//   // iconComponents[name] = defineAsyncComponent(() => modules[key]());
// });

// iconComponents.search = defineAsyncComponent(() =>
//   modules["/src/assets/svgs/search.svg"]()
// );
// console.log(iconComponents);
