import { next, rewrite } from "@vercel/functions";
import {
  AGENT_DISCOVERY_LINKS,
  getMarkdownAlternate,
  getMarkdownDocument,
  getStaticMarkdownPath,
  markdownResponse,
  negotiateRepresentation,
} from "./src/agent-content.js";

const VARY_HEADER = "Accept, Accept-Encoding";
const APEX_ORIGIN = "https://runtars.com";
const WWW_HOST = "www.runtars.com";

export const config = {
  matcher: ["/((?!api|_astro|.*\\..*).*)", "/sitemap.xml"],
};

function permanentRedirect(location: string): Response {
  return new Response(null, {
    status: 301,
    headers: { Location: location },
  });
}

export default function middleware(request: Request): Response {
  const url = new URL(request.url);

  if (url.hostname.toLowerCase() === WWW_HOST) {
    // Set the path after parsing the origin so leading slashes cannot replace the host.
    const destination = new URL(APEX_ORIGIN);
    destination.pathname = url.pathname;
    destination.search = url.search;
    return permanentRedirect(destination.toString());
  }

  if (url.pathname === "/sitemap.xml") {
    const destination = new URL(`/sitemap-index.xml${url.search}`, APEX_ORIGIN);
    return permanentRedirect(destination.toString());
  }

  if (request.method !== "GET" && request.method !== "HEAD") return next();

  if (negotiateRepresentation(request.headers.get("accept")) === "markdown") {
    const markdown = getMarkdownDocument(url.pathname);
    if (markdown) return markdownResponse(markdown, request.method);
    const staticMarkdown = getStaticMarkdownPath(url.pathname);
    if (staticMarkdown) {
      const destination = new URL(url);
      destination.pathname = staticMarkdown;
      return rewrite(destination, {
        headers: {
          "Content-Language": "en",
          "Content-Type": "text/markdown; charset=utf-8",
          Link: AGENT_DISCOVERY_LINKS,
          Vary: VARY_HEADER,
        },
      });
    }
  }

  const markdownAlternate = getMarkdownAlternate(url.pathname);
  return next({
    headers: {
      Link: [
        AGENT_DISCOVERY_LINKS,
        ...(markdownAlternate
          ? [`<${markdownAlternate}>; rel="alternate"; type="text/markdown"`]
          : []),
      ].join(", "),
      Vary: VARY_HEADER,
    },
  });
}
