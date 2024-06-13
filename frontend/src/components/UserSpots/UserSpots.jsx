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
            <h2 className='manage-spots-title'>Manage Spots</h2>
            {userSpots.length === 0 ? (
                <button className='new-user-create-spot-button'>
                    <Link to={'/spots/new'} className='new-user-link'>Create a New Spot</Link>
                </button>
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
