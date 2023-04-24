import { CMSConstants } from '../../constants/admin';
const initialState = {
  cms_list: [],
  error: false,
  totalPage: 1,
  page: 1,
  loading : false
};

export function cms_page(state = initialState, action) {
 
  
  switch (action.type) {
    

    
    case CMSConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case CMSConstants.GETALL_SUCCESS:
      
      return {
        
          ...state,
          loading: false,
          error: false,
          totalPage:action.cms_page.totalPage,
          page:action.cms_page.page,
          cms_list: action.cms_page.result
      };
    case CMSConstants.GETALL_FAILURE:
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