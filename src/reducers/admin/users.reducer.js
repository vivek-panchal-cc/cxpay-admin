import { userConstants } from '../../constants/admin';
const initialState = {
  user_list: [],
  error: false,
  totalPage: 1,
  page: 1,
  loading : false
};

export function users(state = initialState, action) {
  
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case userConstants.GETALL_SUCCESS:
      return {
          ...state,
          loading: false,
          error: false,
          totalPage:action.users.totalPage,
          page:action.users.page,
          user_list: action.users.result
      };
    case userConstants.GETALL_FAILURE:
      return {
        ...state, 
        error: true,
        loading: false,
        message:'Something Went Wrong!'
      };
    default:
      return state
  }
}