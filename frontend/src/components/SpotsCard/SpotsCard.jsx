import { FaStar } from "react-icons/fa";
import './SpotsCard.css';

const SpotsCard = ({ spot }) => {
    return (
        <div className="spot-card">
            <img src={spot.previewImage} alt={spot.name} className="spot-image"/>
            <h3>{spot.name}</h3>
            <p>{spot.city}, {spot.state}</p>
            <p><FaStar /> {spot.avgRating}</p>
            <p>${spot.price} night</p>
        </div>
    )
};

export default SpotsCard;
