import { nanoid } from 'nanoid';

const MATRICES_LIMIT = 3;

export const convertFeatures = (data) =>
  Object.keys(data).map((key) => ({
    id: key,
    title: data[key].title,
    name: data[key].name,
    variants: data[key].matrices?.map((value) => value.name) ?? [],
    tags: (data[key].matrices || []).map((item) => item.name).slice(0, MATRICES_LIMIT),
    tagsOverLimit: (data[key].matrices || []).length - MATRICES_LIMIT,
  }));

export const convertFeaturePayload = (data) => ({
  title: data.title,
  name: data.name,
  matrices: data.variants.map((item) => ({
    id: nanoid(6),
    name: item,
    checked: false,
  })),
});

export const convertSettings = (data) =>
  Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
    title: data[key].label,
    tags: data[key].values?.map((value) => value.label) ?? [],
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

export const convertEnvironments = (data) =>
  Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));

export const convertEnvironmentsPayload = (data) =>
  data.map((item) => ({
    label: item.label,
    value: item.value,
  }));

export const newEnvironment = () => ({
  id: nanoid(6),
  label: '',
  value: '',
  isNew: true,
});
