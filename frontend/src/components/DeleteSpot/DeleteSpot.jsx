import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteASpot } from '../../store/spots';
import './DeleteSpot.css';

const DeleteSpot = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteASpot(spotId))
            .then(() => {
                closeModal();
            })
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <form className='delete-modal-form'>
            <h2 className='confirm-delete-title'>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button
                type='button'
                className='delete-yes-button'
                onClick={handleDelete}
            >
                Yes (Delete Spot)
            </button>
            <button
                type='button'
                className='delete-no-button'
                onClick={handleCancel}
            >
                No (Keep Spot)
            </button>
        </form>
    )
};

export default DeleteSpot;
