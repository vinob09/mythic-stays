import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import './SpotsCard.css';

const SpotsCard = ({ spot, manage }) => {
    const price = spot.price ? parseFloat(spot.price) : 0;

    return (
        <div>
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
                        <p className="spot-price">${price.toFixed(2)} night</p>
                    </div>
                </div>
            </Link>
            {manage && (
                <div>
                    <button>Update</button>
                    <button>Delete</button>
                </div>
            )}
        </div>
    )
};

export default SpotsCard;
