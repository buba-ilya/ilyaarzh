// GAFFER page at /gaffer: one block per project, in this order.
// Stills are paths in src/assets, e.g. 'gaffer/my-project/still-1.jpg'. The grid adapts
// to how many there are (1–6); a portrait ratio puts them all in one row.

import { stillsIn, type RolePage } from './role-page';

const stills = stillsIn('gaffer');

export const gaffer: RolePage = {
  role: 'GAFFER',
  description: 'Ilya Arzhinovsky — gaffer',

  projects: [
    {
      title: 'ULTIMA',
      credits: 'Commercial · DoP Danya Komarov',
      link: 'https://www.instagram.com/p/DacfrqaDKBG/',
      ratio: '4/5',
      stills: stills('ultima', 6),
    },
    {
      title: 'AMINA PIRMANOVA',
      credits: 'YouTube · DoP Ivan Krasikov',
      link: 'https://youtu.be/6IEiCSMN0Y0',
      stills: stills('amina-yt', 6),
    },
    {
      title: 'ROZALIA — BOLSHE NE POYMAESH',
      credits: 'Music video · DoP Danya Komarov',
      link: 'https://youtu.be/_LK-Hs24x1k',
      ratio: '3/2',
      stills: stills('rosalia', 6),
    },
    {
      title: 'BLAGODUSHIE',
      credits: 'Short film · DoP Danya Komarov',
      link: '',
      ratio: '19/10',
      stills: stills('blagodushie', 3),
    },
    {
      title: 'SUDEAL — BLESS MODE',
      credits: 'Music video · DoP Lev Margera',
      link: 'https://youtu.be/gF3eUHOWT_s',
      ratio: '19/10',
      stills: stills('sudeal-bless', 6),
    },
    {
      title: 'MOLODOY PLATON — AP',
      credits: 'Music video · DoP Lev Margera',
      link: 'https://youtu.be/ivo0vpo6XWY',
      stills: stills('molodoy-platon', 5),
    },
    {
      title: 'SUDEAL — MTV',
      credits: 'Music video · DoP Lev Margera',
      link: 'https://youtu.be/Fd98BB42X2A',
      stills: stills('sudeal-mtv', 5),
    },
  ],
};
