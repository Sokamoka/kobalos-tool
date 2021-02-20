import emitter from "tiny-emitter/instance";

export const confirmPromise = ({
  title,
  icon = "delete",
  confirmText = "Yes",
  cancelText = "Cancel",
}) =>
  new Promise((resolve) => {
    emitter.emit("add", {
      icon,
      title,
      confirmText,
      cancelText,
      cb: resolve,
    });
  });
