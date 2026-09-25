import config from '../config/index.js';

export function withYouTubeCookies(args) {
  if (!config.youtubeCookiesPath) return args;

  const url = args[args.length - 1];
  return [...args.slice(0, -1), '--cookies', config.youtubeCookiesPath, url];
}

export default withYouTubeCookies;