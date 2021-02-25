export const convertSettings = (data) =>
  Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
    values: data[key].values?.map((value) => value.label) ?? [],
  }));

export const convertSettingPayload = (data) => ({
  checked: false,
  key: data.key,
  label: data.label,
  values: data.values.map((item, index) => ({
    label: item,
    value: index,
  })),
});
