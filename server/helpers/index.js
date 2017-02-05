import gameConfig from '../game-config';

export const checkReqFormatAsync = arr => new Promise((resolve) => {
  arr.forEach((item) => {
    if (item === undefined) {
      throw new Error('Wrong body format recieved');
    }
  });

  resolve();
});

export const getNextLevelExperienceFromLevel = level =>
gameConfig.GAME_WON_EXPERIENCE_VALUE * (level + 1) * (level + 1);

export const getLevelFromExperience = experience =>
Math.floor(Math.sqrt(experience) / Math.sqrt(gameConfig.GAME_WON_EXPERIENCE_VALUE));
