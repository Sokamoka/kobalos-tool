import emitter from "tiny-emitter/instance";

export const confirmPromise = ({
  title,
  confirmText = "Yes",
  cancelText = "Cancel",
  icon = "delete",
}) => {
  return new Promise((resolve) => {
    emitter.emit("add", {
      icon,
      title,
      confirmText,
      cancelText,
      cb: resolve,
    });
  });
};
