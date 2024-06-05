import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getSpotDetails } from '../../store/spots';
import './SpotsDetails.css';

const SpotsDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.currSpot);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
        .then(() => setIsLoaded(true))
    }, [dispatch, spotId]);

    return isLoaded ? (
        <div>
            <h2>{spot.name}</h2>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            <div>
                <img src={spot.SpotImages[0].url} className='details-image' />
                {/* images code here with flexbox displaying other imgs */}
            </div>
            <div className='details-description'>
                <h2>Hosted by {/* need owner name */}</h2>
                <p>{spot.description}</p>
                <div className='details-reserve'>
                    <h2>${spot.price}</h2>
                    <h3>night</h3>
                    {spot.avgRating ? (
                            <p className="spot-rating"><FaStar /> {spot.avgRating}</p>
                        ) : 'New!'}
                    <p>{/* need number of reviews */}</p>
                </div>
            </div>
        </div>
    ) : (
        <div>Loding...</div>
    )
};

export default SpotsDetails;
