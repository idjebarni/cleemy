export const setLoading = (loadingState: boolean, error = undefined) => {
  return (state: any) => {
    const newState = { ...state, loading: loadingState };

    if (error !== undefined) {
      newState.error = error;
    }

    return newState;
  };
};

export const setError = (error: any) => {
  return (state: any) => ({ ...state, loading: false, resource: null, error, total: null });
};

export const setResource = (resource: any, total: number = 0) => {
  return (state: any) => ({ ...state, loading: false, resource, error: null, total });
};
