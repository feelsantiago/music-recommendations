import { Severity } from '@music-ai/components-ui';
export type TagType = 'genre' | 'mood' | 'custom';

export interface Tag {
  id: string;
  name: string;
  type: TagType;
  severity: Severity;
}

export type TagSelected = Tag & { state: 'selected' };
export type TagUnselected = Tag & { state: 'unselected' };
export type SelectedTag = TagSelected | TagUnselected;

export type GroupedTagsDto = { [key in TagType]: Omit<Tag, 'severity'>[] };
export type GroupedTags = { [key in TagType]: Tag[] };
