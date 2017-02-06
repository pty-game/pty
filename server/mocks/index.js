import Chance from 'chance';
import { getLevelFromExperience, getNextLevelExperienceFromLevel } from '../helpers';

const chance = new Chance();

export const mockUser = (experience = chance.integer({ min: 0, max: 1000000 })) => {
  const gamesTotal = chance.integer({ min: 50, max: 100 });
  const gamesWon = gamesTotal - 10;
  const gamesLoose = 5;
  const gamesDraw = 5;

  const level = getLevelFromExperience(experience);
  const nextLevelExperience = getNextLevelExperienceFromLevel(level);

  return {
    login: chance.name(),
    experience,
    nextLevelExperience,
    level,
    gamesTotal,
    gamesWon,
    gamesLoose,
    gamesDraw,
  };
};

export const mockGameUser = (userId, gameId) => {
  return {
    userId,
    gameId,
  };
};

export const mockGame = () => {
  return {
  };
};

export const mockUsersFactory = (count) => {
  const users = [];

  for (let i = 0; i < count; i += 1) {
    users.push(mockUser());
  }

  return users;
};
