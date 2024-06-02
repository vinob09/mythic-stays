import { useModal } from "../../context/Modal";

function OpenModalButton({ modalComponent, buttonText, onButtonClick, onModalClose }) {
    const { setModalContent, setOnModalClose } = useModal();

    const handleClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === 'function') onButtonClick();
    }

    return (
        <button onClick={handleClick}>{buttonText}</button>
    )
}

export default OpenModalButton;
