import { Result } from '@sapphire/result';

export type ResultAsync<T, E = unknown> = Promise<Result<T, E>>;
