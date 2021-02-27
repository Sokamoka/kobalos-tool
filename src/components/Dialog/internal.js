import emitter from 'tiny-emitter/instance';

export const TYPE_CONFIRM = 'confirm';
export const TYPE_ERROR = 'error';
export const TYPE_SUCCESS = 'success';
export const TYPE_INFO = 'info';

const types = [TYPE_CONFIRM, TYPE_ERROR, TYPE_SUCCESS, TYPE_INFO];

export const notification = ({
  type = TYPE_INFO,
  title,
  icon = 'delete',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  duration = 4000,
}) => {
  const emit = (props) =>
    emitter.emit('add', {
      type,
      icon,
      title,
      confirmText,
      cancelText,
      duration,
      ...props,
    });

  if (!types.includes(type)) return;

  if (type === TYPE_CONFIRM) return new Promise((resolve) => emit({ cb: resolve }));
  return emit();
};
