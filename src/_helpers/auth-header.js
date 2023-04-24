export function authHeader(module_name = '',action = '') {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { 'x-access-token':user.accessToken, 'Content-Type': 'application/json','module_name':module_name,'action':action };
    } 
    else {
        return {'Content-Type': 'application/json'};
    }
}

export function authHeaderMutlipart (module_name = '',action = '') {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { 'x-access-token':user.accessToken };
    } 
    else {
        return {'Content-Type': 'application/json'};
    }
}