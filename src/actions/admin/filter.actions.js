const getInitFilter = (val) => {
    return dispatch => {
        dispatch(request(val));
    };
    function request() { return { type: "INIT_FILTER",val }}
}

const setFilter = (val) => {
    return dispatch => {
        dispatch(request(val));
    };
    function request() { return { type: "SET_FILTER",val }}
}
export  {
    getInitFilter, setFilter
};
