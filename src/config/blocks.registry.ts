import type { ComponentConfig } from './components.config';

export const blocks: ComponentConfig[] = [
  // HERO
  { id: 'kinetic-hero', name: 'Kinetic Hero', category: 'hero', type: 'block', isPro: true, isNew: true },
  { id: 'bold-hero', name: 'Bold Hero', category: 'hero', type: 'block', isPro: true, isNew: true },
  { id: 'cinematic-hero', name: 'Cinematic Hero', category: 'hero', type: 'block', isPro: true, isNew: true },
  { id: 'minimal-hero', name: 'Minimal Hero', category: 'hero', type: 'block', isPro: false, isNew: false },

  // FEATURES
  { id: 'bento-grid', name: 'Bento Grid', category: 'features', type: 'block', isPro: true, isNew: true },
  { id: 'feature-list', name: 'Feature List', category: 'features', type: 'block', isPro: false, isNew: false },
  { id: 'stats-showcase', name: 'Stats Showcase', category: 'features', type: 'block', isPro: true, isNew: true },

  // SOCIAL PROOF
  { id: 'testimonial-ticker', name: 'Testimonial Ticker', category: 'social-proof', type: 'block', isPro: true, isNew: true },
  { id: 'testimonial-wall', name: 'Testimonial Wall', category: 'social-proof', type: 'block', isPro: true, isNew: true },

  // PRICING
  { id: 'pricing-cards', name: 'Pricing Cards', category: 'pricing', type: 'block', isPro: true, isNew: true },

  // PROCESS
  { id: 'steps-accordion', name: 'Steps Accordion', category: 'process', type: 'block', isPro: false, isNew: false },
  { id: 'text-image-scroll', name: 'Text Image Scroll', category: 'process', type: 'block', isPro: true, isNew: true },

  // CONTENT
  { id: 'marquee-statement', name: 'Marquee Statement', category: 'content', type: 'block', isPro: true, isNew: false },
  { id: 'cinematic-split', name: 'Cinematic Split', category: 'content', type: 'block', isPro: true, isNew: true },
  { id: 'portfolio-showcase', name: 'Portfolio Showcase', category: 'content', type: 'block', isPro: true, isNew: true },
  { id: 'image-reveal', name: 'Image Reveal', category: 'content', type: 'block', isPro: true, isNew: true },
  { id: 'parallax-scroller', name: 'Parallax Scroller', category: 'content', type: 'block', isPro: true, isNew: true },
  { id: 'horizontal-scroll-section', name: 'Horizontal Scroll Section', category: 'content', type: 'block', isPro: true, isNew: true },
];

export const blockCategories = [
  'hero',
  'features',
  'social-proof',
  'pricing',
  'process',
  'content',
];
