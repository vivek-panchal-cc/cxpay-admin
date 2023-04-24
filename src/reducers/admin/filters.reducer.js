const initialState = {
    
  }
  
  export const filters = (state = initialState, action) => {
    switch (action.type) {
      case 'INIT_FILTER':
        return {
          state,
            ...action.val
          };
        case 'SET_FILTER':
        return {
            ...action.val
          };
      default:
        return state
    }
  }