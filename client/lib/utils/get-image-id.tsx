const getImageId = (url: string | undefined) => {
  if (!url) return '';
  const urlSplit = url.split('/');
  return urlSplit[urlSplit.length - 1];
};

export default getImageId;
