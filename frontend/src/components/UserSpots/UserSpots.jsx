import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getCurrUserSpots } from '../../store/spots';
import SpotsCard from '../SpotsCard';
import './UserSpots.css';

const UserSpots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.currUser);

    const userSpots = Object.values(spots);

    useEffect(() => {
        dispatch(getCurrUserSpots())
    }, [dispatch]);

    return (
        <div>
            <h2>Manage Spots</h2>
            {userSpots.length === 0 ? (
                <Link to={'/spots/new'}>Create a New Spot</Link>
            ) : (<div className='user-spots-container'>
                {userSpots.map((spot) => (
                    <SpotsCard key={spot.id} spot={spot} manage />
                ))}
            </div>
            )}
        </div>
    )
};

export default UserSpots;
