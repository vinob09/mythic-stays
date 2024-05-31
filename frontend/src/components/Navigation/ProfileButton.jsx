import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    return (
        <>
            <button>
                <FaUserCircle />
            </button>
            <ul className="profile-dropdown">
                <li>Username: {user.username}</li>
                <li>Name: {user.firstName} {user.lastName}</li>
                <li>Email: {user.email}</li>
                <button onClick={logout}>Log Out</button>
            </ul>
        </>
    );
}

export default ProfileButton;
