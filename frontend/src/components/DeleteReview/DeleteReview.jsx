import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteUserReview } from '../../store/spots';
import './DeleteReview.css';

const DeleteReview = ({ reviewId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteUserReview(reviewId))
            .then(() => {
                closeModal();
            })
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <form className='delete-review-modal-form'>
            <h2 className='delete-review-title'>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button
                type='button'
                onClick={handleDelete}
                className='delete-review-button delete-review-yes-button'
            >
                Yes (Delete Review)
            </button>
            <button
                type='button'
                onClick={handleCancel}
                className='delete-review-button delete-review-no-button'
            >
                No (Keep Review)
            </button>
        </form>
    )
};

export default DeleteReview;
