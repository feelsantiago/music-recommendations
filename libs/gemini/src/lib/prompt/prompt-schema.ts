import { Type } from '@google/genai';

export const PROMPT_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      album: { type: Type.STRING },
      artist: { type: Type.STRING },
    },
    propertyOrdering: ['album', 'artist'],
  },
};
