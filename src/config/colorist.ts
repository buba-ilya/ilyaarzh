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
      title: 'TOMAS MRAZ, YANIX — SKOLKO ESHE',
      credits: 'Music video · Shot on Blackmagic PYXIS 12K',
      link: 'https://vimeo.com/1235862358',
      ratio: '9/16',
      // Same stills as the project on the main site (src/content/projects/skolko-eshe.md).
      stills: Array.from({ length: 6 }, (_, i) => `projects/skolko-eshe/still-${i + 1}.jpg`),
    },
    {
      title: '?¿ (QUESTION MARKS)',
      credits: 'Trailer · Shot on Sony VENICE',
      link: 'https://vimeo.com/1236014495',
      ratio: '2/1',
      // Same stills as the project on the main site (src/content/projects/question-marks.md).
      stills: Array.from({ length: 6 }, (_, i) => `projects/znaki/still-${i + 1}.jpg`),
    },
    {
      title: 'BEHOLDER — CONDUCTOR',
      credits: 'Music video · Shot on Sony VENICE',
      link: 'https://vimeo.com/1238753296',
      ratio: '4/3',
      stills: stills('beholder', 6),
    },
    {
      title: 'DEREZA — RUN',
      credits: 'Music video · Shot on RED Komodo',
      link: 'https://vimeo.com/1091971087',
      ratio: '3/2',
      // Same stills as the project on the main site (src/content/projects/dereza.md).
      stills: ['1', '2', '3', '4-cropped', '5', '6'].map((n) => `projects/dereza begi/still-${n}.jpg`),
    },
    {
      title: 'QUCHBI BAG',
      credits: 'Commercial · Shot on 8mm film',
      link: 'https://vimeo.com/1089848449',
      ratio: '2480/1750',
      // Same stills as the project on the main site (src/content/projects/quchbi-bag.md).
      stills: Array.from({ length: 6 }, (_, i) => `projects/quchbi-bag/still-${i + 1}.jpg`),
    },
    {
      title: 'MARSIANNA — WHERE AM I',
      credits: 'Music video · Shot on BMPCC 6K Pro',
      link: 'https://vimeo.com/1238753565',
      ratio: '3/2',
      stills: stills('marsianna', 6),
    },
    {
      title: 'BRUSNIKA — VSPOMNI MENYA',
      credits: 'Music video · Shot on Sony FX3',
      link: 'https://vimeo.com/1235880204',
      ratio: '9/16',
      stills: stills('vspomni-menya', 6),
    },
    {
      title: 'RUSSIAN VILLAGE BOYS — SUNRISE AT 6AM',
      credits: 'Music video · Shot on Sony FX30, A7S IV, Panasonic S1H, BMPCC 6K Pro',
      link: 'https://youtu.be/s4unlViiWPU',
      stills: stills('rvb', 6),
    },
    {
      title: 'INSOMNIA',
      credits: 'Experimental · Shot on BMPCC 4K',
      link: 'https://vimeo.com/1089714441',
      ratio: '3/2',
      // Same stills as the project on the main site (src/content/projects/insomnia.md).
      stills: Array.from({ length: 6 }, (_, i) => `projects/insomnia/still-${i + 1}.jpg`),
    },
    {
      title: 'GIPNOBAZA — POSLEDNIY DEN VESNY',
      credits: 'Music video · Shot on Fujifilm X-S10, Handycam',
      link: 'https://vimeo.com/1238753114',
      ratio: '4/3',
      stills: stills('pdv-gipnobaza', 6),
    },
    // {
    //   title: 'PROJECT NAME',
    //   credits: 'Music video · Dir. Name Surname',
    //   link: 'https://youtu.be/...',
    //   stills: stills('project-folder', 6),
    // },
  ],
};
