// Define available transition types
export const transitionTypes = [
  'fade',
  'slide',
  'zoom',
  'wipe',
  'dissolve',
  'blur',
] as const;

export type TransitionType = typeof transitionTypes[number];

export const POPULAR_FONTS = [
  { name: 'Inter', value: 'var(--font-inter)' },
  { name: 'Roboto', value: 'var(--font-roboto)' },
  { name: 'Poppins', value: 'var(--font-poppins)' },
  { name: 'Open Sans', value: 'var(--font-open-sans)' },
  { name: 'Montserrat', value: 'var(--font-montserrat)' },
  { name: 'Lato', value: 'var(--font-lato)' },
  { name: 'Source Sans', value: 'var(--font-source-sans)' },
  { name: 'Oswald', value: 'var(--font-oswald)' },
];

export const TEXT_DECORATIONS = [
  { id: 'none', preview: 'Did you know?', style: {} },
  { id: 'shadow1', preview: 'Did you know?', style: { textShadow: '2px 2px 4px rgba(0,0,0,0.5)' } },
  { id: 'shadow2', preview: 'Did you know?', style: { textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)' } },
  { id: 'shadow3', preview: 'Did you know?', style: { textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' } },
]; 