import { SET_ALERT, REMOVE_ALERT } from '../types';

export const setAlert = (msg, alertType, timeout = 2500) => dispatch => {
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType }
    })

    setTimeout(() => dispatch({ type: REMOVE_ALERT }), timeout)
}

export const closeAlert = () => dispatch => {
    dispatch({
        type: REMOVE_ALERT
    })
}