export const getError = (error: any): string =>
  error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;
