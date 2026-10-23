// COLORIST page at /colorist: one block per project, in this order.
// Stills are paths in src/assets, e.g. 'colorist/my-project/still-1.jpg'. The grid adapts
// to how many there are (1–6); a portrait ratio puts them all in one row.

import { stillsIn, type RolePage } from './role-page';

const stills = stillsIn('colorist');

export const colorist: RolePage = {
  role: 'COLORIST',
  description: 'Ilya Arzhinovsky — colorist',

  projects: [
    {
      title: 'RUSSIAN VILLAGE BOYS — SUNRISE AT 6AM',
      credits: 'Music video',
      link: 'https://youtu.be/s4unlViiWPU',
      stills: stills('rvb', 6),
    },
    {
      title: 'DEREZA — RUN',
      credits: 'Music video',
      link: 'https://vimeo.com/1091971087',
      ratio: '3/2',
      // Same stills as the project on the main site (src/content/projects/dereza.md).
      stills: ['1', '2', '3', '4-cropped', '5', '6'].map((n) => `projects/dereza begi/still-${n}.jpg`),
    },
    // {
    //   title: 'PROJECT NAME',
    //   credits: 'Music video · Dir. Name Surname',
    //   link: 'https://youtu.be/...',
    //   stills: stills('project-folder', 6),
    // },
  ],
};
