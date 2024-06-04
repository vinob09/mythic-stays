import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './SpotsDetails.css';

const SpotsDetails = () => {
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots[spotId]);

    return (
        <div>
            <h1>Spots Details</h1>
            <h2>{spot.name}</h2>
        </div>
    )
};

export default SpotsDetails;
