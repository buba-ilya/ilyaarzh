export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface Social {
  type: 'instagram' | 'facebook' | 'vimeo' | 'youtube' | 'telegram' | 'email';
  url: string;
}

export interface Contact {
  email: string;
  phone: string;
}

export const site = {
  name: 'ILYA ARZHINOVSKY',
  role: 'CINEMATOGRAPHER',
  url: 'https://ilyaarzhinovsky.com',
  description: 'Ilya Arzhinovsky — cinematographer',

  nav: [
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/' },
    // Side work, kept a step back from the cinematography. An empty href makes it a toggle.
    {
      label: 'MORE',
      href: '',
      children: [
        { label: 'COLOR', href: '/colorist' },
        { label: 'LIGHTING', href: '/gaffer' },
        { label: 'PHOTO', href: '/photo' },
      ],
    },
  ] as NavItem[],

  // An empty url hides the icon.
  socials: [
    { type: 'instagram', url: 'https://www.instagram.com/ilyaarzh/' },
    { type: 'facebook', url: '' },
    { type: 'vimeo', url: 'https://vimeo.com/ilyaarzh' },
    { type: 'youtube', url: '' },
    { type: 'telegram', url: 'https://t.me/ilyaarzh' },
    { type: 'email', url: 'mailto:arzhinovsk@gmail.com' },
  ] as Social[],

  about: {
    // vimeo.com/ilyaarzh/showreel2026 redirects here; the numeric id is what embeds.
    showreel: 'https://vimeo.com/1234513679',
    photo: 'photo_2026-10-15 22.46.39.jpeg', // square portrait in src/assets; empty -> hidden
    intro: {
      name: 'Ilya Arzhinovsky',
      // One string per paragraph; links may be written as <a href="…">…</a>.
      bio: [
        'I’m Ilya Arzhinovsky, a cinematographer based in Moscow. In 2026 I graduated from GITR Film & Television School.',
        'I enjoy every part of the process: digging for references, talking through ideas, drawing storyboards, building lighting plans. Prep and location scouts are a special kind of love for me. And then there’s the shoot, the part I love most.',
        'I’m drawn to a living camera and natural, honest images, but I never stick to one look. I enjoy moving between very different visual worlds, and that range is what you’ll find in my work. I also have a soft spot for film and have shot on 8mm a handful of times.',
        'I work across commercials, music videos, fashion, narrative and documentary.',
        'Alongside cinematography I also work as a <a href="/colorist">colorist</a> and <a href="/gaffer">gaffer</a>, and shoot <a href="/photo">photography</a>.',
        'Based in Moscow. Available for projects in other cities and countries.',
      ],
    },
    representedBy: {
      show: false,
      name: 'AGENCY',
      url: '',
      logo: '', // empty -> SOON 204/70
    },
    contacts: [{ email: 'arzhinovsk@gmail.com', phone: '+7 968 428 50 70' }] as Contact[],
  },

  projectNav: false,

  analytics: { umamiWebsiteId: '' }, // empty -> script is not injected
};
