export const fieldFilter = (data: any, ...allowedFields: string[]) => {
  const result: {
    [key: string]: any;
  } = {};

  Object.keys(data).forEach((field: string) => {
    if (allowedFields.includes(field)) {
      result[field] = data[field];
    }
  });

  return result;
};
