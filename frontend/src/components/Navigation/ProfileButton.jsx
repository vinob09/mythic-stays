import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const ulRef = useRef();
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);

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
        navigate('/');
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div>
            <button onClick={toggleMenu} className='profile-button'>
                <FaBars className='icon' />
                <FaUserCircle className='icon' />
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className='profile-details'>
                        <span>Hello, {user.firstName}!</span>
                        <span>{user.email}</span>
                        <Link to={'/spots/current'}>Manage Spots</Link>
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
