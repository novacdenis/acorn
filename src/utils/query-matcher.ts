import type { Query, QueryKey } from "@tanstack/react-query";

export function queryMather(source: string[]) {
  return (target: Query<unknown, Error, unknown, QueryKey>) => {
    if (typeof target.queryKey[0] === "string") {
      return source.includes(target.queryKey[0]);
    }
    return false;
  };
}
