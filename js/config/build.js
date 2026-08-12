export const BUILD_VERSION = "0.11.43-ui-reset";
export function assetUrl(path) {
  if (!path || /^(?:data:|blob:)/i.test(path)) return path;
  const joiner = String(path).includes("?") ? "&" : "?";
  return `${path}${joiner}v=${encodeURIComponent(BUILD_VERSION)}`;
}
