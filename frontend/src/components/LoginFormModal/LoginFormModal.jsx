import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleLogin = () => {
        return credential.length < 4 || password.length < 6
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors({ credential: 'The provided credentials were invalid' })
                }
            });
    };

    return (
        <>
            <h1 className='login'>Log In</h1>
            <form onSubmit={handleSubmit} className='form'>
                <label>
                    <input
                        type="text"
                        value={credential}
                        placeholder='Username or Email'
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (<p className='error-message'>{errors.credential}</p>)}
                <button type="submit" disabled={handleLogin()}>Log In</button>
            </form>
        </>
    );
}

export default LoginFormModal;
