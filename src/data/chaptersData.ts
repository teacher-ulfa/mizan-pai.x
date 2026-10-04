import { Chapter } from '../types';
import { CHAPTERS_SEMESTER_1 } from './chaptersSemester1';
import { CHAPTERS_SEMESTER_2 } from './chaptersSemester2';

export const ALL_CHAPTERS: Chapter[] = [
  ...CHAPTERS_SEMESTER_1,
  ...CHAPTERS_SEMESTER_2
];

export const getChapterById = (id: number): Chapter | undefined => {
  return ALL_CHAPTERS.find(ch => ch.id === id);
};
