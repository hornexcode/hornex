import { ParamMap } from '@/lib/request';

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

const trimRightSlash = /\/+$/;
const extractPathComponents = (path: string): string[] => {
  return path.replace(trimRightSlash, '').split('/').slice(1);
};

/**
 * extractParams extracts the parameters out of a route definition.
 *
 * @param path
 */
const extractParams = (path: string) => {
  const components = extractPathComponents(path);
  const params: string[] = [];
  components.forEach((component) => {
    if (component[0] === '[') {
      const length = component.length;
      if (component[length - 1] !== ']')
        throw new Error('Invalid path definition: mismatched []');
      params.push(component.substring(1, length - 1));
    }
  });
  return params;
};

/**
 * toQueryString generates a query string from the supplied params.
 *
 * @param params
 */
const toQueryString = (params: ParamMap) => {
  return Object.keys(params)
    .filter((key) => params[key] !== null && typeof params[key] !== 'undefined')
    .map((key) => {
      // if the value is an array, we need to add each value as a separate
      // param in the query string using the same key
      if (Array.isArray(params[key])) {
        return (params[key] as any[])
          ?.map(
            (value) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
          )
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        String(params[key])
      )}`;
    })
    .join('&');
};

/**
 * stringParam is a convenience function that coalesces the supplied param
 * into a string. It is useful when you get query params that can be either
 * a string or string array.
 *
 * @param s
 */
const stringParam = (s?: string | string[]) => {
  if (typeof s === 'undefined') {
    return '';
  } else if (typeof s === 'string') {
    return s;
  }
  return s[0];
};

/**
 * Get the query params from the URL.
 *
 * @return {params}  {{ [key: string]: string }}
 */
const getQueryParams = (selectedQueryParams: {
  [key: string]: Array<string>;
}): { [key: string]: string } => {
  const params: { [key: string]: string } = {};
  const queryParams = new URLSearchParams(window.location.search);

  for (const [source, queryParam] of Object.entries(selectedQueryParams)) {
    queryParam.some((param: string, _i: number) => {
      if (queryParams.has(param)) {
        const queryValue = queryParams.get(param);
        if (queryValue) {
          params[source] = queryValue;
          return true;
        }
      } else if (/^%.*%$/.test(param)) {
        params[source] = param.split(/[%%]/)[1];
        return true;
      }
      return false;
    });
  }
  return params;
};

/**
 * A version of stringParam helper above that coalesces the values of
 * a supplied param object into a string.
 * Useful for normalizing an object of many params that could either be a string
 * or a string array
 *
 * @param params
 */
const toStringParams = (
  params: Record<string, string | string[] | undefined>
): Record<string, string> => {
  return Object.keys(params).reduce((acc, key) => {
    return {
      ...acc,
      [key]: stringParam(params[key]),
    };
  }, {});
};

/**
 * Encapsulates a check on route params for permalink / query param validation
 * Returns stringifed values for params year/month/day/slug and a boolean flag if these params are valid or not
 * @param year
 * @param month
 * @param day
 * @param slug
 */
const validatePermalinkParams = (
  _year: string,
  _month: string,
  _day: string,
  _slug: string
): {
  year?: string;
  month?: string;
  day?: string;
  slug?: string;
  valid: boolean;
} => {
  const year = stringParam(_year);
  const month = stringParam(_month);
  const day = stringParam(_day);
  const slug = stringParam(_slug);
  const fourDigits = /\d{4}/;
  const twoDigits = /\d{2}/;
  const alphaNumDash = /[\w\d-]+/;

  if (
    !(
      !fourDigits.test(year) ||
      !twoDigits.test(month) ||
      !twoDigits.test(day) ||
      !alphaNumDash.test(slug)
    )
  ) {
    return {
      year,
      month,
      day,
      slug,
      valid: true,
    };
  }
  return {
    valid: false,
  };
};

export type RouteDefinition = {
  path: string;
  method?: Method;
};

export {
  extractParams,
  getQueryParams,
  Method,
  stringParam,
  toQueryString,
  toStringParams,
  validatePermalinkParams,
};
