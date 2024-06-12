import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // handle errors to clear when input is updated
    const handleInputs = (setter, field) => (e) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            })
        }
    };

    // handle button disabling
    useEffect(() => {
        setIsButtonDisabled(credential.length < 4 || password.length < 6)
    }, [credential, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setHasSubmitted(true);
        try {
            await dispatch(sessionActions.login({ credential, password }));
            closeModal();
        } catch (res) {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
            }
            else {
                setErrors({ credential: 'The provided credentials were invalid.' })
            }
        }
    };

    // handle demo user login
    const handleDemoUserLogin = async (e) => {
        e.preventDefault();
        try {
            await dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }));
            closeModal();
        } catch (res) {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ credential: 'The provided credentials were invalid' });
            }
        }
    };

    return (
        <>
            <h1 className='login-modal-title'>Log In</h1>
            <form onSubmit={handleSubmit} className='login-modal-form'>
            {hasSubmitted && errors.credential && (<p className='login-modal-error-message'>{errors.credential}</p>)}
                <label>
                    <input
                        type="text"
                        className='login-modal-input'
                        value={credential}
                        placeholder='Username or Email'
                        onChange={handleInputs(setCredential, 'credential')}
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        className='login-modal-input'
                        value={password}
                        placeholder='Password'
                        onChange={handleInputs(setPassword, 'password')}
                        required
                    />
                </label>
                <button type="submit" disabled={isButtonDisabled} className='login-modal-button'>Log In</button>
                <a href='#' onClick={handleDemoUserLogin} className='login-modal-demo-link'>Log in as Demo User</a>
            </form>
        </>
    );
}

export default LoginFormModal;
