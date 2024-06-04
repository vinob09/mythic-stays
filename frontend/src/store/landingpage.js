import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/loadSpots';

const loadSpots = (payload) => {
    return {
        type: LOAD_SPOTS,
        payload
    }
};

export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpots(data));
    }
}


const initialState = {};

const landingPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newState = {};
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        default:
            return state;
    }
};

export default landingPageReducer;
