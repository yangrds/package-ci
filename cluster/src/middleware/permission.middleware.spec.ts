import { PermissionMiddleware } from './permission.middleware';

describe('PermissionMiddleware', () => {
  it('should be defined', () => {
    expect(new PermissionMiddleware()).toBeDefined();
  });
});
