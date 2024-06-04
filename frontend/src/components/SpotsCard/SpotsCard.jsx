import { FaStar } from "react-icons/fa";
import './SpotsCard.css';

const SpotsCard = ({ spot }) => {
    return (
        <div className="spot-card">
            <img src={spot.previewImage} alt={spot.name} className="spot-image" />
            <div className="spot-details">
                <h3>{spot.name}</h3>
                <p>{spot.city}, {spot.state}</p>
                <p className="spot-rating"><FaStar /> {spot.avgRating}</p>
                <p className="spot-price">${spot.price} night</p>
            </div>
        </div>
    )
};

export default SpotsCard;
