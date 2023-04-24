const initialState = {
  sidebarShow: 'responsive'
}

export const theme = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}