export type RecommondationRateLimitsState =
  | 'requests_per_minutes_exceeded'
  | 'requests_per_day_exceeded'
  | 'tokens_per_minutes_exceeded'
  | 'available';
