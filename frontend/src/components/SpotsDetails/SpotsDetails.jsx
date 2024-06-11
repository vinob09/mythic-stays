import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { LuDot } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { useModal } from '../../context/Modal';
import { fetchReviews, getSpotDetails, selectReviewsArray } from '../../store/spots';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import './SpotsDetails.css';
import DeleteReview from '../DeleteReview/DeleteReview';

const SpotsDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent } = useModal();

    const spot = useSelector(state => state.spots.currSpot);
    const sessionUser = useSelector(state => state.session.user);
    const reviews = useSelector(selectReviewsArray);

    const [isLoaded, setIsLoaded] = useState(false);
    const [userHasReviewed, setUserHasReviewed] = useState(false);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
            .then(() => setIsLoaded(true));
        dispatch(fetchReviews(spotId))
            .then(() => setIsLoaded(true));
    }, [dispatch, spotId]);

    // checking for session user's reviews for the spot, if any
    useEffect(() => {
        if (sessionUser && reviews) {
            setUserHasReviewed(reviews.some(review => review.userId === sessionUser.id))
        }
    }, [sessionUser, reviews]);

    // handle window alert to return
    const handleReserveButton = () => {
        return alert('Feature Coming Soon...')
    }

    // check if session user is owner of spot
    const isOwner = sessionUser && spot && sessionUser.id === spot.Owner.id;
    // check review length
    const hasReviews = reviews.length > 0;
    // sort reviews to show newest to oldest
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // handle broken image links
    const handleImageError = (e) => {
        e.target.src = '/sorry-image-not-available.jpg';
    }

    return isLoaded ? (
        <div className='details-page-container'>
            <h2>{spot.name}</h2>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            <div className='details-image-container'>
                <img src={spot.SpotImages[0].url} className='details-image-main' onError={handleImageError} />
                <div className='details-secondary-images'>
                    {spot.SpotImages.slice(1, 5).map(image => (
                        <img key={image.id} src={image.url} className='details-image-secondary' onError={handleImageError} />
                    ))}
                </div>
            </div>
            <div className='details-container'>
                <div>
                    <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                    <p>{spot.description}</p>
                </div>
                <div className='details-price-reviews'>
                    <div className='details-price-reviews-top'>
                        <h2>${parseFloat(spot.price).toFixed(2)} night</h2>
                        <div className="details-spot-rating">
                            {spot.avgStarRating ? (
                                <p><FaStar /> {(spot.avgStarRating).toFixed(1)}</p>
                            ) : (<FaStar />)}
                            {spot.numReviews ? (
                                <p><LuDot />{spot.numReviews} {
                                    spot.numReviews > 1 ? ('reviews') : ('review')
                                }</p>
                            ) : (
                                <p>New!</p>
                            )}
                        </div>
                    </div>
                    <button onClick={handleReserveButton} className='details-spot-button'>Reserve</button>
                </div>
            </div>
            <div>
                <div className='reviews-comments-container'>
                    <div className='reviews-stars-comments'>
                        {spot.avgStarRating ? (
                            <p className="details-spot-rating"><FaStar /> {(spot.avgStarRating).toFixed(1)}</p>
                        ) : (<FaStar />)}
                        {spot.numReviews ? (
                            <p className="details-spot-rating"><LuDot />{spot.numReviews} {
                                spot.numReviews > 1 ? ('reviews') : ('review')
                            }</p>
                        ) : (
                            <p className="details-spot-rating">New!</p>
                        )}
                    </div>
                </div>
                <div>
                    {sessionUser && !isOwner && !userHasReviewed && (
                        <button onClick={() => setModalContent(<ReviewFormModal spotId={spotId} />)}>
                            Post Your Review
                        </button>
                    )}
                    {sessionUser && !isOwner && !hasReviews ? (
                        <p>Be the first to post a review!</p>
                    ) : (
                        <div>
                            {sortedReviews.map(review => {
                                // convert to month/year format
                                const reviewDate = new Date(review.createdAt);
                                const options = { year: 'numeric', month: 'long' };
                                const formattedDate = reviewDate.toLocaleDateString(undefined, options);
                                return (
                                    <div key={review.id}>
                                        <p>{review.User ? review.User.firstName : (sessionUser && sessionUser.firstName)}</p>
                                        <p>{formattedDate}</p>
                                        <p>{review.review}</p>
                                        {sessionUser && hasReviews && (
                                            <button onClick={() => setModalContent(<DeleteReview spotId={spotId} />)}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div>Loding...</div>
    )
};

export default SpotsDetails;
