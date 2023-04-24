import { notify, history } from './index';

/* Handle all http resopnse from all API */
export const handleResponse = (response) => {
    if (response !== undefined) {
        return response.text().then(text => {
            setLoading(false);
            const data = text && JSON.parse(text);
            if (data.type !== undefined && data.type === 'unauthorized' && data.status === false) {
                const error = (data && data.message) || response.statusText;
                notify.error(error);
                localStorage.removeItem('user');
                history.push('/admin/login');
                return Promise.reject(error);
            } else if (data.type !== undefined && data.type === 'access_denied' && data.status === false) {
                const error = (data && data.message) || response.statusText;
                notify.error(error);
                // history.push('/admin/dashboard');
                history.push({pathname: '/admin/dashboard',
                state: { access_message: true }});
                return Promise.reject(error);
            }
            return data;
        });
    } else {
        return Promise.reject('Something went wrong');
    }
}

/* Add/Remove loader */
export const setLoading = (flag) => {
    let loader = document.querySelector(".loader-container");
    if (flag) {
        loader.classList.add("loading");
    } else {
        loader.classList.remove("loading");
    }
}

/* Capitalized first character from string */
export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    var separateWord = s.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}

/* Checkiang for menu permission */
export const menuPermission = (navigation) => {
    let user = JSON.parse(localStorage.getItem('user'));
    let permission_nav = [];
    if (user.user_group_id === '60227751e2e5152364d34551') {
        return navigation;
    } else if (user.user_group === 'Super Users') {
        for (var key in navigation) {
            if (navigation[key].module_name !== 'system_modules') {
                permission_nav.push(navigation[key]);            
            }
        }
        return permission_nav;
    } else {
        for (var key in navigation) {
            if (navigation[key].module_name !== 'system_modules') {
                if (
                    user.user_permission[navigation[key].module_name] !== undefined ||
                    navigation[key].module_name === 'dashboard' ||
                    navigation[key].module_name === undefined
                ) {
                    permission_nav.push(navigation[key]);
                }
            }
        }
        return permission_nav;
    }
}

/* ACL page Access middleware */
export const _canAccess = (module, access = '', redirect = '') => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user.user_group_id === '60227751e2e5152364d34551') {
        return true;
    } else if (user.user_group === 'Super Users' && module !== 'system_modules') {
        return true;
    } else {
        if (user.user_permission[module] !== undefined && user.user_permission[module].includes(access)) {
            return true;
        } else if (redirect !== '') {
            notify.error('Access Denied Contact to Super User');
            history.push(redirect);
        } else if (redirect === '') {
            return false;
        } else {
            notify.error('Access Denied Contact to Super User');
            history.push('/admin');
        }
    }
}

/* Current user details send */
export const _loginUsersDetails = () => {
    return JSON.parse(localStorage.getItem('user'));    
}