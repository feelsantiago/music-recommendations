export type TagType = 'genre' | 'mood' | 'custom';

export interface Tag {
  id: string;
  name: string;
  type: TagType;
}

export type TagsGrouped = { [key in TagType]: Tag[] };
export type SystemTags = Omit<TagsGrouped, 'custom'>;
