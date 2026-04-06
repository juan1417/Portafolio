import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Dc7I5VrQ.mjs';
import { $ as $$Base, g as getTranslations, a as $$Footer } from '../chunks/Footer_Dp50GLLx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = Astro2.url.searchParams.get("lang") || "en";
  const t = getTranslations(lang);
  const cvPath = lang === "es" ? "/docs/CV_Juan_Manuel_Machado.pdf" : "/docs/CV_Juan_Manuel_Machado_EN.pdf";
  const cvFileName = lang === "es" ? "CV_Juan_Manuel_Machado.pdf" : "CV_Juan_Manuel_Machado_EN.pdf";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex flex-col flex-grow items-center justify-center px-4 py-8 gap-6 md:gap-8 relative min-h-[80vh]"> <!-- Glow effect behind text --> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div> <div class="flex flex-col items-center text-center gap-4 md:gap-6 relative z-10"> <h1 class="text-text text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[6rem] font-extrabold leading-tight">${t.home.title}</h1> <p class="text-text-muted text-base sm:text-[1.1rem] md:text-[1.25rem] font-normal max-w-2xl leading-relaxed px-2">${t.home.paragraph}</p> </div> <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-10 w-full sm:w-auto px-4 sm:px-0"> <a${addAttribute(`/projects?lang=${lang}`, "href")} class="bg-primary text-text px-6 sm:px-8 py-3 rounded-full font-semibold cursor-pointer hover:opacity-90 transition-all hover:scale-105 text-center"> ${t.home.project} </a> <a${addAttribute(cvPath, "href")}${addAttribute(cvFileName, "download")} class="bg-transparent text-text px-6 sm:px-8 py-3 rounded-full font-semibold cursor-pointer border border-text-muted/30 hover:border-text-muted hover:bg-surface-elevated transition-all flex items-center justify-center gap-2"> <span class="material-symbols-outlined text-lg">download</span> ${t.home.cv} </a> </div> <div class="flex gap-5 items-center relative z-10"> <a href="https://github.com/juan1417" target="_blank" class="text-text-muted hover:text-primary transition-colors text-2xl" aria-label="GitHub"> <i class="fa-brands fa-github"></i> </a> <a href="https://www.linkedin.com/in/juanmachado1234" target="_blank" class="text-text-muted hover:text-secondary transition-colors text-2xl" aria-label="LinkedIn"> <i class="fa-brands fa-linkedin"></i> </a> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/index.astro", void 0);

const $$file = "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
