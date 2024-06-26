import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='nav-container'>
            <Link to='/'><img src='/Mythic-Stays-logo.png' alt='Mythic Stays Logo' className='logo'></img></Link>
            {isLoaded && (
                <div className='nav-items'>
                    {sessionUser ? (<Link to='/spots/new' className='create-spot-link'>Create a New Spot</Link>) : ("")}
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    )
}

export default Navigation;
