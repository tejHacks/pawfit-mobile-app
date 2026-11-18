import { defineBrand } from './lib/brand-type';

export const brand = defineBrand({
  name: 'PawFit',
  colors: { primary: '#0D9488', primaryText: '#FFFFFF', accent: '#EAB308' },
  screens: [
    { name: 'index', title: 'PawFit' },
    { name: 'pet/[id]', title: 'Pet' },
    { name: 'add-pet', title: 'Add a pet', modal: true },
  ],
});
