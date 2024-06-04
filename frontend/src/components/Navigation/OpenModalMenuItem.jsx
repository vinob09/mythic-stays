import { useModal } from "../../context/Modal";

function OpenModalMenuItem({ modalComponent, itemText, onButtonClick, onModalClose }) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === 'function') onButtonClick();
    }

    return (
        <div onClick={onClick} className="modal-menu-item">{itemText}</div>
    )
}

export default OpenModalMenuItem;
