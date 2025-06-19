interface urlSearchParamsProps {
  param: string;
  value?: string | number | Array<string | number>;
  prevQuery?: string;
}

export const UrlSearchParams = ({ param, value = '', prevQuery = '' }: urlSearchParamsProps) => {
  const urlParams = new URLSearchParams(prevQuery || window.location.search);
  const parsedValue = Array.isArray(value) ? value.join(',').trim() : value.toString().trim();

  if (!urlParams.has(param) && parsedValue.length) {
    urlParams.append(param, parsedValue);
  } else if (urlParams.has(param) && parsedValue.length) {
    urlParams.set(param, parsedValue);
  } else {
    urlParams.delete(param);
  }
  return decodeURIComponent(urlParams.toString());
};
