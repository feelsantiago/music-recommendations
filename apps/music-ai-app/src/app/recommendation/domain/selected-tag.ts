import { ColorizedTag } from '../../domain/tags/tags.types';

export class SelectedTag {
  constructor(
    public readonly data: ColorizedTag,
    public selected: boolean,
  ) {}

  public static from(
    tags: ColorizedTag[],
    selected: ColorizedTag[],
  ): SelectedTag[] {
    return tags.map((tag) => {
      const isSelected = selected.some(
        (selectedTag) => selectedTag.name === tag.name,
      );
      return new SelectedTag(tag, isSelected);
    });
  }

  public toggle(): void {
    this.selected = !this.selected;
  }
}
