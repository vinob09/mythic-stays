import './SpotsCard.css';

const SpotsCard = ({ spot }) => {
    return (
        <div>
            <h3>{spot.name}, {spot.previewImage}</h3>
            <p>{spot.city}, {spot.state}</p>
            <p>{spot.avgRating}</p>
            <p>${spot.price} night</p>
        </div>
    )
};

export default SpotsCard;
