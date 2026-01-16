import { Mock } from 'vitest';

// Helper type for mocked API client methods
export type MockedApiMethod = Mock<[...args: unknown[]], Promise<{ data: unknown }>>;

// Helper type for any mocked function
export type AnyMock = Mock<unknown[], unknown>;
