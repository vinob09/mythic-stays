import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import './SpotsCard.css';

const SpotsCard = ({ spot }) => {
    return (
        <Link key={spot.id} to={`/spots/${spot.id}`} title={spot.name}>
            <div className="spot-card">
                <img src={spot.previewImage} alt={spot.name} className="spot-image" />
                <div className="spot-details">
                    <div className="city-stars">
                        <p>{spot.city}, {spot.state}</p>
                        {spot.avgRating ? (
                            <p className="spot-rating"><FaStar /> {(spot.avgRating).toFixed(1)}</p>
                        ) : ('New!')}
                    </div>
                    <p className="spot-price">${spot.price} night</p>
                </div>
            </div>
        </Link>
    )
};

export default SpotsCard;
