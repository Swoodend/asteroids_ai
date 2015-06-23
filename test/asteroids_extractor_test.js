describe('AsteroidsAi', function() {
  var Game;
  beforeEach(function() {
    var ship = {
        x: 100,
        y: 50,
        rot: 45
    };
    Game = {
      score: 50,
      ship: ship,
      sprites: [ship, {
        name: 'asteroid',
        x: 104,
        y: 53,
        visible: true
      },
      {
        name: 'asteroid',
        x: 150,
        y: 100,
        visible: true
      },
      {
        name: 'asteroid',
        x: 41.992071023909375,
        y: 451.0755308418457,
        visible: false
      }],
    };
  });

  it('is a global variable', function() {
    expect(typeof window.gAsteroidsAi).toBe('object');
  });

  describe('extractGameData', function() {
    var extractGameData;

    beforeEach(function() {
      extractGameData = window.gAsteroidsAi.extractGameData(Game);
    });

    it('should extract game score', function() {
      expect(extractGameData.score).toBe(50);
    });

    it('should have an array of vectors representing deadly objects', function() {
      expect(Array.isArray(extractGameData.sprites)).toBe(true);
    });

    it('should have length the same as number of visible deadly sprites', function() {
      expect(extractGameData.sprites.length).toBe(2);
    });

    it('should return deadly sprites with shootable, angle theta, distance magnitude', function() {
      var keys = Object.keys(extractGameData.sprites[0]);
      expect(keys).toContain('s');
      expect(keys).toContain('d');
      expect(keys).toContain('t');
    });

    it('should calculate the angle of asteroid relative to ship', function() {
      expect(extractGameData.sprites[1].t).toBeCloseTo(90, 1);
    });

    it('should calculate the distance of asteroid from ship', function() {
      expect(extractGameData.sprites[0].d).toBeCloseTo(5, 1);
    });

  });

});
