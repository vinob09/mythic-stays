import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';
import SpotsCard from '../SpotsCard';
import './LandingPage.css';

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.loadSpots));

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]);

    // sort spots to show newest on landing page
    const sortedSpots = spots.sort((a, b) => b.id - a.id);

    return (
        <div className='spots-container'>
            {sortedSpots.map((spot) => (
                <SpotsCard key={spot.id} spot={spot} />
            ))}
        </div>
    )
};

export default LandingPage;
