import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/landingpage';
import SpotsCard from '../SpotsCard';
import './LandingPage.css';

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]);

    return (
        <div>
            {Object.values(spots).map((spot) => (
                <SpotsCard key={spot.id} spot={spot}/>
            ))}
        </div>
    )
};

export default LandingPage;
