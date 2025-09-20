import { Severity } from '@music-ai/components-ui';
import { Tag, TagsGrouped } from '@music-ai/tags';

export type TagColorful = Tag & { severity: Severity };
export type TagSelected = TagColorful & { state: 'selected' };
export type TagUnselected = TagColorful & { state: 'unselected' };
export type TagSelection = TagSelected | TagUnselected;
export type TagGroupedColorful = { [key in keyof TagsGrouped]: TagColorful[] };
