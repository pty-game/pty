export const setError = (payload) => {
  return {
    type: 'SET_ERROR',
    payload,
  };
};

const initialState = {
  error: '',
};

export const metaReducer = (
  state = initialState,
  { type, payload },
) => {
  switch (type) {
    case 'SET_ERROR':
      return { error: payload };
    default:
      return state;
  }
};
