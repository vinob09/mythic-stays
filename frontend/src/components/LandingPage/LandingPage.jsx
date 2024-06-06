import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';
import SpotsCard from '../SpotsCard';
import './LandingPage.css';

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.loadSpots);

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]);

    return (
        <div className='spots-container'>
            {Object.values(spots).map((spot) => (
                <SpotsCard key={spot.id} spot={spot}/>
            ))}
        </div>
    )
};

export default LandingPage;
