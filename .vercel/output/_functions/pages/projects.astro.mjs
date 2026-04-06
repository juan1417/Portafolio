import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Dc7I5VrQ.mjs';
import { $ as $$Base, g as getTranslations, a as $$Footer } from '../chunks/Footer_Dp50GLLx.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Projects;
  const lang = Astro2.url.searchParams.get("lang") || "en";
  const t = getTranslations(lang);
  const EXCLUDED_REPOS = /* @__PURE__ */ new Set([
    "juan1417",
    "Portafolio",
    "stunning-octo-chainsaw",
    "effective-octo-spork"
  ]);
  let repos = [];
  let fetchError = false;
  try {
    const res = await fetch(
      "https://api.github.com/users/juan1417/repos?per_page=100&sort=updated",
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (res.ok) {
      const all = await res.json();
      const filtered = all.filter(
        (r) => !r.fork && !EXCLUDED_REPOS.has(r.name)
      );
      repos = await Promise.all(
        filtered.map(async (repo) => {
          try {
            const langRes = await fetch(repo.languages_url, {
              headers: { Accept: "application/vnd.github+json" }
            });
            if (!langRes.ok) return repo;
            const langData = await langRes.json();
            const languages = Object.keys(langData);
            return { ...repo, languages };
          } catch {
            return repo;
          }
        })
      );
    } else {
      fetchError = true;
    }
  } catch {
    fetchError = true;
  }
  const langIcons = {
    "JavaScript": "devicon-javascript-plain",
    "TypeScript": "devicon-typescript-plain",
    "Python": "devicon-python-plain",
    "PHP": "devicon-php-plain",
    "Kotlin": "devicon-kotlin-plain",
    "Dart": "devicon-dart-plain",
    "Swift": "devicon-swift-plain",
    "Java": "devicon-java-plain",
    "C#": "devicon-csharp-plain",
    "C++": "devicon-cplusplus-plain",
    "C": "devicon-c-plain",
    "Objective-C": "devicon-objectivec-plain",
    "CMake": "devicon-cmake-plain",
    "Go": "devicon-go-plain",
    "Astro": "devicon-astro-plain",
    "HTML": "devicon-html5-plain",
    "CSS": "devicon-css3-plain"
  };
  const topicIcons = {
    "vue": "devicon-vuejs-plain",
    "vuejs": "devicon-vuejs-plain",
    "react": "devicon-react-original",
    "angular": "devicon-angular-plain",
    "nestjs": "devicon-nestjs-original",
    "nodejs": "devicon-nodejs-plain",
    "node": "devicon-nodejs-plain",
    "laravel": "devicon-laravel-original",
    "dotnet": "devicon-dotnetcore-plain",
    "net": "devicon-dotnetcore-plain",
    "postgresql": "devicon-postgresql-plain",
    "postgres": "devicon-postgresql-plain",
    "mysql": "devicon-mysql-plain",
    "mongodb": "devicon-mongodb-plain",
    "sqlserver": "devicon-microsoftsqlserver-plain",
    "vercel": "devicon-vercel-original",
    "tailwind": "devicon-tailwindcss-original",
    "tailwindcss": "devicon-tailwindcss-original",
    "git": "devicon-git-plain",
    "docker": "devicon-docker-plain",
    "supabase": "devicon-supabase-plain",
    "azure": "devicon-azure-plain",
    "aws": "devicon-amazonwebservices-plain-wordmark",
    "flutter": "devicon-flutter-plain",
    "dart": "devicon-dart-plain"
  };
  const CATEGORY_OVERRIDES = {
    "gestor-de-inventario": ["desktop"],
    "inventory-manager": ["desktop"],
    "menu-master": ["desktop"],
    "muelitas-felices": ["desktop"],
    "storage-manager": ["mobile"],
    "pro-finanzas": ["web", "mobile", "desktop"],
    "profinanzas": ["web", "mobile", "desktop"],
    "profinancas": ["web", "mobile", "desktop"],
    "pro-financas-app": ["web", "mobile", "desktop"],
    "pro-finanzas-app": ["web", "mobile", "desktop"]
  };
  function normalizeRepoName(name) {
    return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/_/g, "-");
  }
  function getCategories(repo) {
    const normalizedName = normalizeRepoName(repo.name);
    const override = CATEGORY_OVERRIDES[normalizedName];
    if (override) return override;
    const topics = repo.topics.map((t2) => t2.toLowerCase());
    const text = `${repo.name} ${repo.description || ""}`.toLowerCase();
    const isMobile = topics.includes("mobile") || topics.includes("android") || topics.includes("ios") || topics.includes("flutter") || topics.includes("dart") || text.includes("mobile") || text.includes("m\xF3vil") || text.includes("movil");
    const isDesktop = topics.includes("desktop") || topics.includes("winforms") || topics.includes("wpf") || text.includes("desktop") || text.includes("escritorio") || text.includes("winforms") || text.includes("wpf");
    if (isMobile && isDesktop) return ["mobile", "desktop"];
    if (isMobile) return ["mobile"];
    if (isDesktop) return ["desktop"];
    return ["web"];
  }
  function getTags(repo) {
    if (repo.languages && repo.languages.length > 0) return repo.languages;
    if (repo.topics.length > 0) return repo.topics;
    if (repo.language) return [repo.language];
    return [];
  }
  function getTagIcon(tag) {
    const exactLanguageIcon = langIcons[tag];
    if (exactLanguageIcon) return exactLanguageIcon;
    const topicIcon = topicIcons[tag.toLowerCase()];
    if (topicIcon) return topicIcon;
    return "fa-solid fa-tag";
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "data-astro-cid-aid3sr62": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-12 w-full" data-astro-cid-aid3sr62> <div class="text-center mb-8 md:mb-12" data-astro-cid-aid3sr62> <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4" data-astro-cid-aid3sr62>${t.projects.title}</h1> <p class="text-text-muted text-base md:text-lg" data-astro-cid-aid3sr62>${t.projects.description}</p> </div> <!-- Category filter --> <div class="flex justify-center mb-8 md:mb-10 overflow-x-auto pb-2" data-astro-cid-aid3sr62> <ul class="flex gap-1 sm:gap-2 bg-surface p-1.5 sm:p-2 rounded-xl" data-astro-cid-aid3sr62> <li data-astro-cid-aid3sr62> <button type="button" data-category="all" class="filter-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base text-text-muted hover:text-text hover:bg-surface-elevated transition-all whitespace-nowrap" data-astro-cid-aid3sr62>${t.projects.categories.all}</button> </li> <li data-astro-cid-aid3sr62> <button type="button" data-category="web" class="filter-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base text-text-muted hover:text-text hover:bg-surface-elevated transition-all whitespace-nowrap" data-astro-cid-aid3sr62>${t.projects.categories.web}</button> </li> <li data-astro-cid-aid3sr62> <button type="button" data-category="mobile" class="filter-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base text-text-muted hover:text-text hover:bg-surface-elevated transition-all whitespace-nowrap" data-astro-cid-aid3sr62>${t.projects.categories.mobile}</button> </li> <li data-astro-cid-aid3sr62> <button type="button" data-category="desktop" class="filter-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base text-text-muted hover:text-text hover:bg-surface-elevated transition-all whitespace-nowrap" data-astro-cid-aid3sr62>${t.projects.categories.desktop}</button> </li> </ul> </div> <!-- Error state --> ${fetchError && renderTemplate`<p class="text-center text-text-muted py-12" data-astro-cid-aid3sr62> <i class="fa-solid fa-triangle-exclamation mr-2 text-warning" data-astro-cid-aid3sr62></i> ${t.projects.fetchError} </p>`} <!-- Projects grid --> ${!fetchError && repos.length === 0 && renderTemplate`<p class="text-center text-text-muted py-12" data-astro-cid-aid3sr62>${t.projects.noProjects}</p>`} ${!fetchError && repos.length > 0 && renderTemplate`<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-astro-cid-aid3sr62> ${repos.map((repo) => {
    const categories = getCategories(repo);
    const tags = getTags(repo);
    return renderTemplate`<article class="project-card bg-surface rounded-2xl overflow-hidden border border-surface-elevated hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"${addAttribute(categories.join(","), "data-category")} data-astro-cid-aid3sr62> <!-- Repo header band --> <div class="h-2 bg-gradient-to-r from-primary to-secondary" data-astro-cid-aid3sr62></div> <div class="p-6 flex flex-col flex-1" data-astro-cid-aid3sr62> <!-- Name + language icon --> <div class="flex items-start justify-between gap-2 mb-2" data-astro-cid-aid3sr62> <h2 class="text-xl font-bold text-text leading-tight" data-astro-cid-aid3sr62>${repo.name}</h2> ${repo.language && renderTemplate`<span class="shrink-0 text-text-muted"${addAttribute(repo.language, "title")} data-astro-cid-aid3sr62> <i${addAttribute(`${langIcons[repo.language] || "fa-solid fa-code"} text-xl`, "class")} data-astro-cid-aid3sr62></i> </span>`} </div> <!-- Description --> <p class="text-text-muted text-sm mb-4 line-clamp-3 flex-1" data-astro-cid-aid3sr62> ${repo.description || t.projects.noDescription} </p> <!-- Topics / tech tags --> ${tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4" data-astro-cid-aid3sr62> ${tags.map((tag) => renderTemplate`<span class="flex items-center gap-1 text-xs bg-surface-elevated px-2 py-1 rounded-full text-text-muted" data-astro-cid-aid3sr62> <i${addAttribute(`${getTagIcon(tag)} text-xs`, "class")} data-astro-cid-aid3sr62></i> ${tag} </span>`)} </div>`} <!-- Action buttons --> <div class="flex gap-3 mt-auto" data-astro-cid-aid3sr62> ${repo.homepage ? renderTemplate`<a${addAttribute(repo.homepage, "href")} target="_blank" rel="noopener noreferrer" class="flex-1 text-center px-4 py-2 bg-primary text-text rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium" data-astro-cid-aid3sr62> <i class="fa-solid fa-external-link-alt mr-2" data-astro-cid-aid3sr62></i>${t.projects.viewProject} </a>` : renderTemplate`<span class="flex-1 text-center px-4 py-2 bg-surface-elevated text-text-muted rounded-lg text-sm font-medium cursor-default" data-astro-cid-aid3sr62> <i class="fa-solid fa-external-link-alt mr-2 opacity-40" data-astro-cid-aid3sr62></i>${t.projects.viewProject} </span>`} <a${addAttribute(repo.html_url, "href")} target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-text-muted/30 text-text-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-sm"${addAttribute(t.projects.viewCode, "title")} data-astro-cid-aid3sr62> <i class="fa-brands fa-github" data-astro-cid-aid3sr62></i> </a> </div> </div> </article>`;
  })} </section>`} </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-aid3sr62": true })} ` })} ${renderScript($$result, "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/projects.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/projects.astro", void 0);

const $$file = "C:/Users/juani/Desktop/Projects/Portafolio/src/pages/projects.astro";
const $$url = "/projects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
