import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spots/loadSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const LOAD_REVIEWS = 'spots/loadReviews';

const loadSpots = (payload) => {
    return {
        type: LOAD_SPOTS,
        payload
    }
};

const spotDetails = (spotId) => {
    return {
        type: SPOT_DETAILS,
        payload: spotId
    }
};

const loadReviews = (spotId) => {
    return {
        type: LOAD_REVIEWS,
        payload: spotId
    }
};

// load all spots
export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpots(data));
    }
};

// get spot details by id
export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const data = await response.json();
        dispatch(spotDetails(data));
    }
};

// get all reviews for spot by id
export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data));
    }
}


const initialState = {
    loadSpots: {},
    currSpot: null,
    reviews: {}
};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newState = { ...state, loadSpots: {} };
            action.payload.Spots.forEach(spot => {
                newState.loadSpots[spot.id] = spot;
            });
            return newState;
        }
        case SPOT_DETAILS: {
            return { ...state, currSpot: action.payload };
        }
        case LOAD_REVIEWS: {
            const newState = { ...state, reviews: {} };
            action.payload.Reviews.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        }
        default:
            return state;
    }
};

export default spotsReducer;

// selectors for memoized data
const selectReviews = state => state.spots.reviews;

export const selectReviewsArray = createSelector(
    [selectReviews],
    (reviews) => Object.values(reviews)
);
