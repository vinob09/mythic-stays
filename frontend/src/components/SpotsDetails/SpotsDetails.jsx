import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { LuDot } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { fetchReviews, getSpotDetails, selectReviewsArray } from '../../store/spots';
import './SpotsDetails.css';

const SpotsDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.currSpot);
    const sessionUser = useSelector(state => state.session.user);
    const reviews = useSelector(selectReviewsArray);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
            .then(() => setIsLoaded(true));
        dispatch(fetchReviews(spotId))
            .then(() => setIsLoaded(true));
    }, [dispatch, spotId]);

    const handleReserveButton = () => {
        return alert('Feature Coming Soon...')
    }

    // check session user is not owner
    const isOwner = sessionUser && spot && sessionUser.id === spot.Owner.id;
    // check review length
    const hasReviews = reviews.length > 0;

    return isLoaded ? (
        <div>
            <h2>{spot.name}</h2>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            <div className='details-image-container'>
                <img src={spot.SpotImages[0].url} className='details-image-main' />
                <div>
                    {spot.SpotImages.slice(1).map(image => (
                        <img key={image.id} src={image.url} className='details-image-secondary' />
                    ))}
                </div>
            </div>
            <div className='details-container'>
                <div>
                    <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                    <p>{spot.description}</p>
                </div>
                <div className='details-price-reviews'>
                    <h2>${spot.price} night</h2>
                    <div>
                        {spot.avgStarRating ? (
                            <p className="details-spot-rating"><FaStar /> {(spot.avgStarRating).toFixed(1)}</p>
                        ) : (<FaStar />)}
                    </div>
                    {spot.numReviews ? (
                        <p className="details-spot-rating"><LuDot />{spot.numReviews} {
                            spot.numReviews > 1 ? ('reviews') : ('review')
                        }</p>
                    ) : (
                        <p className="details-spot-rating">New!</p>
                    )}
                    <button onClick={handleReserveButton}>Reserve</button>
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
                    {sessionUser && !isOwner && !hasReviews ? (
                        <p>Be the first to post a review!</p>
                    ) : (
                        <div>
                            {reviews.map(review => {
                                // convert to month/year format
                                const reviewDate = new Date(review.createdAt);
                                const options = { year: 'numeric', month: 'long' };
                                const formattedDate = reviewDate.toLocaleDateString(undefined, options);
                                return (
                                    <div key={review.id}>
                                        <p>{review.User.firstName}</p>
                                        <p>{formattedDate}</p>
                                        <p>{review.review}</p>
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
