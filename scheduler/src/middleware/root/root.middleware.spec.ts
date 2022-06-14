import { RootMiddleware } from './root.middleware';

describe('RootMiddleware', () => {
  it('should be defined', () => {
    expect(new RootMiddleware()).toBeDefined();
  });
});
