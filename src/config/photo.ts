// PHOTO page at /photo: one block per series, in this order.
// Every image in src/assets/photo/<folder>/ shows up on its own, sorted by file name
// (01.jpg, 02.jpg … to set the order). The scattered layout is random but fixed per file,
// so it does not jump around between builds.

export interface PhotoSeries {
  title: string;
  /** Small line under the title. Empty -> hidden. */
  credits: string;
  /** Folder in src/assets/photo/. */
  folder: string;
  /** 'gallery': even rows of uncropped photos. Default: scattered across the page. */
  layout?: 'gallery' | 'scatter';
}

export const photo = {
  role: 'PHOTOGRAPHER',
  description: 'Ilya Arzhinovsky — photographer',

  series: [
    { title: 'EVENT', credits: '', folder: 'event', layout: 'gallery' },
    { title: 'OTHER', credits: '', folder: 'other', layout: 'gallery' },
  ] as PhotoSeries[],
};
