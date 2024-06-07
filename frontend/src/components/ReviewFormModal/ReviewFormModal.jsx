import { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { fetchReviews, formNewReview, getSpotDetails } from '../../store/spots';
import './ReviewForm.css';

const ReviewFormModal = ({ spotId }) => {
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(null);
    const [hoverStars, setHoverStars] = useState(null);
    const [errors, setErrors] = useState({});
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        setButtonDisabled(review.length < 10 || stars === 0);
    }, [review, stars]);

    useEffect(() => {
        return () => {
            setReview("");
            setStars(null);
            setErrors({});
            setButtonDisabled(true);
        }
    }, [closeModal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(formNewReview(spotId, { review, stars }))
            .then(() => {
                dispatch(fetchReviews(spotId));
                dispatch(getSpotDetails(spotId));
                closeModal();
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
    };

    return (
        <div>
            <h2 className='review-modal-title'>How was your stay?</h2>
            {errors.message && <p className='review-modal-error-message'>{errors.message}</p>}
            <form onSubmit={handleSubmit} className='review-modal-form'>
                <textarea
                    value={review}
                    className='review-modal-input'
                    onChange={(e) => setReview(e.target.value)}
                    placeholder='Leave your review here...'
                />
                <div>
                    {[...Array(5)].map((_, index) => {
                        const starRating = index + 1;
                        return (
                            <FaStar
                                key={index}
                                className={`star ${starRating <= (hoverStars || stars) ? 'filled' : ''}`}
                                onMouseEnter={() => setHoverStars(starRating)}
                                onMouseLeave={() => setHoverStars(stars)}
                                onClick={() => setStars(starRating)}
                            />
                        );
                    })}
                    <p>Stars</p>
                </div>
                <button type='submit' disabled={buttonDisabled} className='review-modal-button'>Submit Your Review</button>
            </form>
        </div>
    )
};

export default ReviewFormModal;
