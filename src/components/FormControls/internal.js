export const equalityIndicatorClass = (el, index) => {
  const add = () => {
    const items = el.parentElement.querySelectorAll(`[data-index='${index}']`);
    items[0].classList.add('animate-shake');
  };

  const remove = () => {
    const items = el.parentElement.querySelectorAll(`[data-index]`);
    items.forEach((item) => item.classList.remove('animate-shake'));
  };

  return {
    add,
    remove,
  };
};
