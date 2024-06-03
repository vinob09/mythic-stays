import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='nav-container'>
            <div>
                <Link to='/'><img src='MythicStays.png' alt='Mythic Stays Logo'></img></Link>
            </div>
            <div className='navlinks'>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                {isLoaded && (
                    <li>
                        <ProfileButton user={sessionUser} />
                    </li>
                )}
            </div>
        </div>
    );
}

export default Navigation;
