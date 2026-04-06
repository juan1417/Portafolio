import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Dc7I5VrQ.mjs';
import { $ as $$Base, g as getTranslations, a as $$Footer } from '../chunks/Footer_Dp50GLLx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Skills = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Skills;
  const lang = Astro2.url.searchParams.get("lang") || "en";
  const t = getTranslations(lang);
  const categoryIcons = {
    backend: "terminal",
    frontend: "web",
    database: "storage",
    tools: "build",
    devops: "cloud_upload",
    others: "code"
  };
  const techIcons = {
    // Backend
    "Python": "devicon-python-plain",
    "Node.js": "devicon-nodejs-plain",
    "Java": "devicon-java-plain",
    "Go": "devicon-go-plain",
    // Frontend
    "React": "devicon-react-original",
    "Angular": "devicon-angular-plain",
    "Vue": "devicon-vuejs-plain",
    "JavaScript": "devicon-javascript-plain",
    "HTML": "devicon-html5-plain",
    "Tailwind CSS": "devicon-tailwindcss-original",
    "PHP": "devicon-php-plain",
    "Laravel": "devicon-laravel-original",
    // Database
    "SQL Server": "devicon-microsoftsqlserver-plain",
    "PostgreSQL": "devicon-postgresql-plain",
    "MySQL": "devicon-mysql-plain",
    "MongoDB": "devicon-mongodb-plain",
    // Tools
    "Git": "devicon-git-plain",
    "GitHub": "devicon-github-original",
    "Figma": "devicon-figma-plain",
    // DevOps
    "Vercel": "devicon-vercel-original",
    "Supabase": "devicon-supabase-plain",
    "Cloudflare": "devicon-cloudflare-plain",
    "Azure": "devicon-azure-plain",
    "AWS": "devicon-amazonwebservices-plain-wordmark",
    // Others
    "C#": "devicon-csharp-plain",
    "Kotlin": "devicon-kotlin-plain",
    ".NET": "devicon-dotnetcore-plain",
    "TypeScript": "devicon-typescript-plain"
  };
  return renderTemplate`${renderComponent($$result, "Base", $$Base, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex flex-col flex-grow px-4 py-16 max-w-6xl mx-auto w-full"> <div class="text-center mb-12"> <h1 class="text-text text-[3rem] md:text-[4rem] font-extrabold mb-4">${t.skill.title}</h1> <p class="text-text-muted text-lg max-w-2xl mx-auto">${t.skill.description}</p> </div> <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${Object.entries(t.skill.categories).map(([key, value]) => renderTemplate`<article class="bg-surface rounded-xl p-6 border border-surface-elevated hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10"> <div class="flex items-center gap-3 mb-4"> <span class="material-symbols-outlined text-primary text-3xl">${categoryIcons[key] || "code"}</span> <h2 class="text-text text-xl font-bold">${value.title}</h2> </div> <p class="text-text-muted text-sm mb-4 leading-relaxed">${value.description}</p> <ul class="flex flex-wrap gap-2"> ${value.technologies.map((tech) => renderTemplate`<li class="bg-surface-elevated text-text-muted px-3 py-2 rounded-lg text-sm hover:text-primary hover:bg-primary/10 transition-colors cursor-default flex items-center gap-2"> <i${addAttribute(`${techIcons[tech] || "fa-solid fa-code"} text-base`, "class")}></i> ${tech} </li>`)} </ul> </article>`)} </section> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/skills.astro", void 0);

const $$file = "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/skills.astro";
const $$url = "/skills";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Skills,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
