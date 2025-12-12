export const languages = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      skills: "Skills & Technologies",
      about: "About/Contact"
    },
    language: {
      select: "Language"
    }
  },
  es: {
    nav: {
      home: "Inicio",
      projects: "Proyectos",
      skills: "Habilidades y Tecnologías",
      about: "Acerca de/Contacto"
    },
    language: {
      select: "Idioma"
    }
  }
};

export type Language = keyof typeof languages;

export function getTranslations(lang: Language = 'en') {
  return languages[lang] || languages.en;
}
