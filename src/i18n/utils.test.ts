import { describe, it, expect } from 'vitest';
import { getTranslations, languages, type Language } from './utils';

describe('i18n utils', () => {
  describe('languages', () => {
    it('should have en and es languages', () => {
      expect(languages).toHaveProperty('en');
      expect(languages).toHaveProperty('es');
    });

    it('should have valid translation structure for en', () => {
      expect(languages.en).toHaveProperty('nav');
      expect(languages.en).toHaveProperty('home');
      expect(languages.en).toHaveProperty('projects');
      expect(languages.en).toHaveProperty('skill');
      expect(languages.en).toHaveProperty('about');
      expect(languages.en).toHaveProperty('language');
      expect(languages.en).toHaveProperty('footer');
      expect(languages.en).toHaveProperty('error404');
    });

    it('should have valid translation structure for es', () => {
      expect(languages.es).toHaveProperty('nav');
      expect(languages.es).toHaveProperty('home');
      expect(languages.es).toHaveProperty('projects');
      expect(languages.es).toHaveProperty('skill');
      expect(languages.es).toHaveProperty('about');
      expect(languages.es).toHaveProperty('language');
      expect(languages.es).toHaveProperty('footer');
      expect(languages.es).toHaveProperty('error404');
    });

    it('should have matching keys between en and es', () => {
      const enKeys = Object.keys(languages.en);
      const esKeys = Object.keys(languages.es);
      expect(enKeys).toEqual(esKeys);
    });
  });

  describe('getTranslations', () => {
    it('should return translations for en', () => {
      const t = getTranslations('en');
      expect(t.nav.home).toBe('_hello');
      expect(t.home.title).toBe('Software Developer');
    });

    it('should return translations for es', () => {
      const t = getTranslations('es');
      expect(t.nav.home).toBe('_hola');
      expect(t.home.title).toBe('Desarrollador de Software');
    });

    it('should default to en for invalid language', () => {
      const t = getTranslations('invalid' as Language);
      expect(t).toEqual(languages.en);
    });

    it('should default to en when called with no argument', () => {
      const t = getTranslations();
      expect(t).toEqual(languages.en);
    });

    it('should have all required nav keys', () => {
      const t = getTranslations('en');
      expect(t.nav).toHaveProperty('home');
      expect(t.nav).toHaveProperty('projects');
      expect(t.nav).toHaveProperty('about');
      expect(t.nav).toHaveProperty('contact');
    });

    it('should have all required home keys', () => {
      const t = getTranslations('en');
      expect(t.home).toHaveProperty('title');
      expect(t.home).toHaveProperty('paragraph');
      expect(t.home).toHaveProperty('project');
      expect(t.home).toHaveProperty('cv');
    });

    it('should have all required projects keys', () => {
      const t = getTranslations('en');
      expect(t.projects).toHaveProperty('title');
      expect(t.projects).toHaveProperty('description');
      expect(t.projects).toHaveProperty('viewProject');
      expect(t.projects).toHaveProperty('viewCode');
      expect(t.projects).toHaveProperty('noDescription');
      expect(t.projects).toHaveProperty('noProjects');
      expect(t.projects).toHaveProperty('fetchError');
      expect(t.projects).toHaveProperty('categories');
      expect(t.projects).toHaveProperty('items');
    });

    it('should have skill categories with proper structure', () => {
      const t = getTranslations('en');
      expect(t.skill.categories).toHaveProperty('backend');
      expect(t.skill.categories).toHaveProperty('frontend');
      expect(t.skill.categories).toHaveProperty('database');
      expect(t.skill.categories).toHaveProperty('tools');
      expect(t.skill.categories).toHaveProperty('devops');
      expect(t.skill.categories).toHaveProperty('others');

      Object.entries(t.skill.categories).forEach(([key, category]) => {
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('technologies');
        expect(Array.isArray(category.technologies)).toBe(true);
      });
    });
  });
});