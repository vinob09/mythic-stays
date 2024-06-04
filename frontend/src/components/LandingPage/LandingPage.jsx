import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/landingpage';
import './LandingPage.css';

const LandingPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]);

    return (
        <div>
            <h1>Landing Page</h1>
        </div>
    )
};

export default LandingPage;
