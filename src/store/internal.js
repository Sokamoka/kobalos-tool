export const convertSettings = (data) =>
  Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
