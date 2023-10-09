import { Route } from './route';

describe('route', () => {
  describe('href', () => {
    it('should return an url', () => {
      const route = new Route(
        'https://test.hornex.gg/api/v1/tournaments/[platform]/[game]/[id]'
      );

      const url = route.href({
        id: '6a94b864-def1-48a0-b410-4d875d090627',
        platform: 'pc',
        game: 'league-of-legends',
      });

      expect(url).toBe(
        'https://test.hornex.gg/api/v1/tournaments/pc/league-of-legends/6a94b864-def1-48a0-b410-4d875d090627'
      );
    });
  });
});
