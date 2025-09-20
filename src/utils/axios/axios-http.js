const request = (instance, config) => {
  return instance({ ...config });
};

export { request };
