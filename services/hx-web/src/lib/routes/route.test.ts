import { Route } from './route';

const API_URL = 'https://test.hornex.gg/api/v1';

describe('route', () => {
  describe('href', () => {
    it('should return an url', () => {
      const route = new Route(API_URL);
      const url = route.href({
        id: '123',
        platform: 'pc',
        game: 'league-of-legends',
      });

      expect(url).toBe(
        'https://test.hornex.gg/api/v1/123/pc/league-of-legends'
      );
    });
  });
});
