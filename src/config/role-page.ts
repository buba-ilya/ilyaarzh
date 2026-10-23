// Shared shape of the standalone role pages (/gaffer, /colorist), rendered by RolePage.astro.

export interface RoleProject {
  title: string;
  /** Small line under the title: format, director, DP. Empty -> hidden. */
  credits: string;
  /** Vimeo, YouTube or Instagram link; the button names the site. Empty -> hidden. */
  link: string;
  /** Up to 6 stills, all in the same frame shape. */
  stills: string[];
  /** Frame shape of the stills, e.g. '16/9' or '4/5'. Defaults to 16/9. */
  ratio?: string;
}

export interface RolePage {
  role: string;
  description: string;
  projects: RoleProject[];
}

/** Paths still-1.jpg … still-N.jpg in src/assets/<role>/<folder>/. */
export const stillsIn = (role: string) => (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${role}/${folder}/still-${i + 1}.jpg`);
