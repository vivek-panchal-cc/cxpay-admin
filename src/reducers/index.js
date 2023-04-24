import { combineReducers } from 'redux';

import { authentication } from './admin/authentication.reducer';
import { alert } from './admin/alert.reducer';
import { users } from './admin/users.reducer';
import { theme } from './admin/theme.reducer';
import { filters } from './admin/filters.reducer';
import { cms_page } from './admin/Cms_reducer';
import { menus } from './frontend/menus.reducer';
import { banners } from './frontend/banners.reducer';
import {sitedata} from './frontend/site_setting.reducer';

const rootReducer = combineReducers({
  authentication,
  alert,
  users,
  theme,
  filters,
  cms_page,
  menus,
  banners,
  sitedata
});

export default rootReducer;