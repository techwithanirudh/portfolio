import { loader } from 'fumadocs-core/source';
import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { work } from '.source';

export const project = loader({
  baseUrl: '/work',
  source: createMDXSource(work),
});
export const { getPage: getProject, getPages: getProjects, pageTree } = project;

export type Project = ReturnType<typeof getProject>;

const projects = getProjects();

export const getSortedByDateProjects = () =>
  projects.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());

export type ProjectPage = InferPageType<typeof project>;
export type ProjectMeta = InferMetaType<typeof project>;
