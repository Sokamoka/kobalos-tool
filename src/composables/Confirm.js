import emitter from "tiny-emitter/instance";

export const confirmPromise = ({
  title,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return new Promise((resolve) => {
    emitter.emit("add", {
      title,
      confirmText,
      cancelText,
      cb: resolve,
    });
  });
};
