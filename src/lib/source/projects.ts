import { work } from 'fumadocs-mdx:collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const project = loader(toFumadocsSource(work, []), {
  baseUrl: '/work',
});

export const {
  getPage: getProject,
  getPages: getProjects,
  pageTree: projectPageTree,
} = project;

export type Project = ReturnType<typeof getProject>;
export type ProjectPage = ReturnType<typeof getProjects>[number];

const projects = getProjects();

export const getSortedByDateProjects = () =>
  projects.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
