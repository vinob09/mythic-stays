import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu)
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className='profile-button-container'>
            <button onClick={toggleMenu} className='profile-button'>
                <FaBars className='icon' />
                <FaUserCircle className='icon' />
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className='profile-details'>
                        <span>Username: {user.username}</span>
                        <span>User: {user.firstName} {user.lastName}</span>
                        <span>Email: {user.email}</span>
                        <button onClick={logout}>Log Out</button>
                    </div>
                ) : (
                    <div className='auth-buttons'>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onButtonClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onButtonClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
