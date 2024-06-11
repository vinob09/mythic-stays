import { csrfFetch } from './csrf';

const DELETE_REVIEW = 'reviews/deleteReview';

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        payload: reviewId
    }
};

export const deleteUserReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteReview(reviewId))
    }
};


const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state
    }
};

export default reviewsReducer;
