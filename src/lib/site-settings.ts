import { queryOptions } from "@tanstack/react-query";
import { getSiteSettings } from "./settings.functions";

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 0,
  refetchInterval: 30000,
});