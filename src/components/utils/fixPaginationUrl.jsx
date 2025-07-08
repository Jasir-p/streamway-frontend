export const fixPaginationUrl = (url) => {
  return url?.replace(/^http:/, 'https:');
};