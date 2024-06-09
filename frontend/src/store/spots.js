import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spots/loadSpots';
const SPOT_DETAILS = 'spots/spotDetails';
const LOAD_REVIEWS = 'spots/loadReviews';
const CREATE_SPOT = 'spots/createSpot';
const CREATE_IMAGE = 'spots/createImage';
const CREATE_REVIEW = 'spots/createReview';
const USER_SPOTS = 'spots/userSpots';
const UPDATE_SPOTS = 'spots/updateSpots';

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

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        payload: spot
    }
};

const createImage = (spotId, image) => {
    return {
        type: CREATE_IMAGE,
        payload: {
            spotId,
            image
        }
    }
};

const createReview = (spotId, review) => {
    return {
        type: CREATE_REVIEW,
        payload: {
            spotId,
            review
        }
    }
};

const userSpots = (payload) => {
    return {
        type: USER_SPOTS,
        payload
    }
};

const updateSpots = (spot) => {
    return {
        type: UPDATE_SPOTS,
        spot
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
        return data;
    }
};

// get all reviews for spot by id
export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data));
    }
};

// create a spot
export const formNewSpot = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(createSpot(data));
        return data;
    }
};

// create an image
export const formNewImage = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(createImage(spotId, data));
        return data;
    }
};

// create a review
export const formNewReview = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(createReview(spotId, data));
        return data;
    }
};

// get curr user spots
export const getCurrUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const data = await response.json();
        dispatch(userSpots(data));
    }
};

// update curr user spots
export const updateCurrUserSpots = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(updateSpots(data));
        return data;
    }
};


// helper func for calculating new star average
const calculateNewAvgStarRating = (reviews) => {
    const totalStars = Object.values(reviews).reduce((acc, review) => acc + review.stars, 0);
    const numReviews = Object.values(reviews).length;
    return totalStars / numReviews;
};


const initialState = {
    loadSpots: {},
    currSpot: null,
    reviews: {},
    images: {},
    currUser: {}
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
        case CREATE_REVIEW: {
            const { review } = action.payload;
            const newState = { ...state, reviews: { ...state.reviews } };
            newState.reviews[review.id] = review;
            newState.currSpot.avgStarRating = calculateNewAvgStarRating(newState.reviews);
            newState.currSpot.numReviews += 1;
            return newState;
        }
        case CREATE_SPOT: {
            const newState = { ...state, loadSpots: { ...state.loadSpots } };
            newState.loadSpots[action.payload.id] = action.payload;
            return newState;
        }
        case CREATE_IMAGE: {
            const { spotId, image } = action.payload;
            const newState = { ...state, images: { ...state.images } };
            if (!newState.images[spotId]) {
                newState.images[spotId] = [];
            }
            newState.images[spotId].push(image);
            return newState;
        }
        case USER_SPOTS: {
            const newState = { ...state, currUser: {} };
            action.payload.Spots.forEach(spot => {
                newState.currUser[spot.id] = spot;
            });
            return newState;
        }
        case UPDATE_SPOTS: {
            return {...state, [action.spot.id]: action.spot};
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
