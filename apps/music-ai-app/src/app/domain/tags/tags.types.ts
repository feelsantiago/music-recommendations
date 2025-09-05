import { Severity } from '../theme/theme.types';

export type TagType = 'genre' | 'mood' | 'custom';

export interface Tag {
  id: number;
  name: string;
  type: TagType;
}

export type ColorizedTag = Tag & { color: Severity };
export type GroupedTags = { [key in TagType]: Tag[] };
export type GoupredColorizedTags = { [key in TagType]: ColorizedTag[] };
