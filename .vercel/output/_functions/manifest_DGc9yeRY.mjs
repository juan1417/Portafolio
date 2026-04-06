import { p as decodeKey } from './chunks/astro/server_Dc7I5VrQ.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_kTdKAcJP.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/juani/Desktop/Projects/Portafolio/","cacheDir":"file:///C:/Users/juani/Desktop/Projects/Portafolio/node_modules/.astro/","outDir":"file:///C:/Users/juani/Desktop/Projects/Portafolio/dist/","srcDir":"file:///C:/Users/juani/Desktop/Projects/Portafolio/src/","publicDir":"file:///C:/Users/juani/Desktop/Projects/Portafolio/public/","buildClientDir":"file:///C:/Users/juani/Desktop/Projects/Portafolio/dist/client/","buildServerDir":"file:///C:/Users/juani/Desktop/Projects/Portafolio/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.16.6_@types+node@25_870ddeadbdf2f8aa1addcc4bdaf5ed04/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.D3R2g8jd.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.D3R2g8jd.css"},{"type":"inline","content":".line-clamp-3[data-astro-cid-aid3sr62]{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n"}],"routeData":{"route":"/projects","isIndex":false,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.D3R2g8jd.css"}],"routeData":{"route":"/skills","isIndex":false,"type":"page","pattern":"^\\/skills\\/?$","segments":[[{"content":"skills","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/skills.astro","pathname":"/skills","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/about.D3R2g8jd.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/juani/Desktop/Projects/Portafolio/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/Users/juani/Desktop/Projects/Portafolio/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/juani/Desktop/Projects/Portafolio/src/pages/projects.astro",{"propagation":"none","containsHead":true}],["C:/Users/juani/Desktop/Projects/Portafolio/src/pages/skills.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/projects@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/skills@_@astro":"pages/skills.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.16.6_@types+node@25_870ddeadbdf2f8aa1addcc4bdaf5ed04/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DGc9yeRY.mjs","C:/Users/juani/Desktop/Projects/Portafolio/node_modules/.pnpm/astro@5.16.6_@types+node@25_870ddeadbdf2f8aa1addcc4bdaf5ed04/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_Bv5svvWf.mjs","C:/Users/juani/Desktop/Projects/Portafolio/src/pages/projects.astro?astro&type=script&index=0&lang.ts":"_astro/projects.astro_astro_type_script_index_0_lang.BysUIWL3.js","C:/Users/juani/Desktop/Projects/Portafolio/src/components/Navegation.astro?astro&type=script&index=0&lang.ts":"_astro/Navegation.astro_astro_type_script_index_0_lang.CHHGivOz.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/juani/Desktop/Projects/Portafolio/src/pages/projects.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const e=document.querySelectorAll(\".filter-btn\"),c=document.querySelectorAll(\".project-card\");e.forEach(r=>{r.addEventListener(\"click\",()=>{e.forEach(t=>t.classList.remove(\"bg-primary\",\"text-text\")),r.classList.add(\"bg-primary\",\"text-text\");const a=r.getAttribute(\"data-category\");c.forEach(t=>{const s=(t.getAttribute(\"data-category\")||\"\").split(\",\").map(o=>o.trim());a===\"all\"||s.includes(a||\"\")?t.classList.remove(\"hidden\"):t.classList.add(\"hidden\")})})}),e[0]?.classList.add(\"bg-primary\",\"text-text\")});"],["C:/Users/juani/Desktop/Projects/Portafolio/src/components/Navegation.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const s=document.getElementById(\"language-select\"),n=document.getElementById(\"language-select-mobile\"),l=document.getElementById(\"menu-toggle\"),e=document.getElementById(\"mobile-menu\"),c=new URLSearchParams(window.location.search).get(\"lang\")||\"en\",r=a=>{const d=a.target.value,t=new URL(window.location.href);t.searchParams.set(\"lang\",d),window.location.href=t.toString()};s&&(s.value=c,s.addEventListener(\"change\",r)),n&&(n.value=c,n.addEventListener(\"change\",r)),l&&e&&(l.addEventListener(\"click\",()=>{const a=!e.classList.contains(\"translate-x-full\");a?(e.classList.add(\"translate-x-full\"),e.classList.remove(\"translate-x-0\"),document.body.style.overflow=\"\"):(e.classList.remove(\"translate-x-full\"),e.classList.add(\"translate-x-0\"),document.body.style.overflow=\"hidden\"),l.querySelectorAll(\".hamburger-line\").forEach((t,o)=>{a?t.classList.remove(\"rotate-45\",\"translate-y-2\",\"opacity-0\",\"-rotate-45\",\"-translate-y-2\"):(o===0&&t.classList.add(\"rotate-45\",\"translate-y-2\"),o===1&&t.classList.add(\"opacity-0\"),o===2&&t.classList.add(\"-rotate-45\",\"-translate-y-2\"))})}),e.querySelectorAll(\"a\").forEach(a=>{a.addEventListener(\"click\",()=>{e.classList.add(\"translate-x-full\"),e.classList.remove(\"translate-x-0\"),document.body.style.overflow=\"\"})}))});"]],"assets":["/_astro/about.D3R2g8jd.css","/favicon.svg","/profile.png","/docs/Desarrollador de Software.pdf"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"kX5eTChl5YE+y81A0puz8hyhulLtbFp0Ycb6g5p96jo="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
