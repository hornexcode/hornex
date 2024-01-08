import { extractParams, toQueryString } from './utils';
import { ParamMap } from '@/lib/request';

/**
 * Route is a representation of route.
 */
class Route {
  path: string;
  params: string[];
  constructor(path: string) {
    this.path = path;
    this.params = extractParams(path);
  }

  /**
   * urls generates a pair of URLs for routing.
   *
   * @param params is a map of query params to add to both the internal
   *   and the address bar-visible urls.
   * @param extra is a map of query params that NextJS will process, but
   *   which won't be sent in the URL. They are only suitable for client-side
   *   page to page transitions.
   */
  url = (
    params: { [key: string]: string | number | undefined } = {},
    extra: { [key: string]: string | number | undefined } = {}
  ): string => {
    let href = this.href(params);

    const qs = toQueryString(extra);
    if (qs) {
      href = `${href}?${qs}`;
    }
    return href;
  };

  /**
   * Generates the href for this route, filled in with supplied parameters.
   *
   * @param params is a permissive set of parameters that are used to fill out the route definition.
   */
  href = (params: ParamMap = {}) => {
    let path = this.path;
    this.params.forEach((param) => {
      if (!params[param]) {
        throw new Error(`Missing parameter "${param}" in route "${path}"`);
      }
      path = path.replace(`[${param}]`, String(params[param]));
    });

    let extra: ParamMap = {};
    extra = Object.keys(params).reduce((extra, param) => {
      if (this.params.indexOf(param) === -1) {
        let p = params[param];
        if (Array.isArray(p)) {
          p = p.length > 0 ? p : undefined;
        }
        if (p) {
          extra[param] = p;
        }
      }
      return extra;
    }, extra);

    let qs = toQueryString(extra);
    if (qs) qs = `?${qs}`;

    return `${path}${qs}`;
  };
}

export { Route };
