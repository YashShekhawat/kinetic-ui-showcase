export interface ComponentConfig {
  id: string;
  name: string;
  category: string;
  type: 'component' | 'block';
  isPro: boolean;
  isNew: boolean;
}

export { components, componentCategories } from './components.registry';
export { blocks, blockCategories } from './blocks.registry';

export const categoryLabels: Record<string, string> = {
  text: 'Text',
  cards: 'Cards',
  buttons: 'Buttons',
  loaders: 'Loaders',
  images: 'Images',
  backgrounds: 'Backgrounds',
  cursor: 'Cursor',
  scroll: 'Scroll',
  hero: 'Hero',
  features: 'Features',
  'social-proof': 'Social Proof',
  pricing: 'Pricing',
  process: 'Process',
  content: 'Content',
  'pre-loaders': 'Pre-Loaders',
};
