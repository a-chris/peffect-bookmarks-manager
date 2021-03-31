/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function unboxProxy(proxyObj: any): any {
  return { ...proxyObj };
}
