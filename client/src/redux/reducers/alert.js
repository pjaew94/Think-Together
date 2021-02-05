import { SET_ALERT, REMOVE_ALERT } from '../types';

const initialState = {
    displayAlert: false,
    payload: ''
};


export default function state(state = initialState, action) { 
    const { type, payload } = action;

    switch(type) {
        case SET_ALERT:
            return {
                displayAlert: true,
                payload: payload
            }
        case REMOVE_ALERT:
            return {
                displayAlert: false,
                payload: ''
            }
        default:
            return state;
    }
}