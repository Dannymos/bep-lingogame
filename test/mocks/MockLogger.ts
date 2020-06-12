export const mockLogger = jest.fn(() => ({
    error: jest.fn(),
    log: jest.fn()
}));