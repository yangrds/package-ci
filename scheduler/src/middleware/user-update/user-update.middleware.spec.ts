import { UserUpdateMiddleware } from './user-update.middleware';

describe('UserUpdateMiddleware', () => {
  it('should be defined', () => {
    expect(new UserUpdateMiddleware()).toBeDefined();
  });
});
