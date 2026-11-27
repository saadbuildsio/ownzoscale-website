// Work page projects. Empty until real work exists.
// kind: 'client' for real client work (with permission), 'concept' for work made by OwnzoScale to show the approach.
// Add results only if they are real and verified.
export type Project = {
  slug: string; title: string; service: string; kind: 'client' | 'concept'; summary: string;
  goal: string; challenge: string; whatWeDid: string; delivered: string; results?: string;
};
export const projects: Project[] = [];
