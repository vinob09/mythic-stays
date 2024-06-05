import { useCallback, useEffect, useState } from 'react';
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

    const handleLogin = useCallback(() => {
        const newErrors = {};
        if (credential.length < 4 || password.length < 6) {
            newErrors.credential = 'The provided credentials were invalid'
        }
        return newErrors;
    }, [credential, password]);

    useEffect(() => {
        const newErrors = handleLogin();
        setIsButtonDisabled(Object.keys(newErrors).length > 0)
    }, [credential, password, handleLogin]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = handleLogin();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            try {
                await dispatch(sessionActions.login({ credential, password }));
                closeModal();
            } catch (res) {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                } else {
                    setErrors({credential: 'The provided credentials were invalid.'})
                }
            }
        }
    };

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
                <label>
                    <input
                        type="text"
                        className='login-modal-input'
                        value={credential}
                        placeholder='Username or Email'
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        className='login-modal-input'
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (<p className='login-modal-error-message'>{errors.credential}</p>)}
                <button type="submit" disabled={isButtonDisabled} className='login-modal-button'>Log In</button>
                <a href='#' onClick={handleDemoUserLogin} className='login-modal-demo-link'>Log In as a Demo User</a>
            </form>
        </>
    );
}

export default LoginFormModal;
