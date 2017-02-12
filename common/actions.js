export function estimatorAction(gameUserId) => {
  return {
    instrument: 'estimate',
    gameUserId,
  }
}
