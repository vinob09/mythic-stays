import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { WiStars } from "react-icons/wi";
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        setIsButtonDisabled(
            !email ||
            !username ||
            !firstName ||
            !lastName ||
            !password ||
            !confirmPassword ||
            username.length < 4 ||
            password.length < 6
        )
    }, [email, username, firstName, lastName, password, confirmPassword]);

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
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <>
            <div className='signup-modal-title-container'>
                <WiStars className='signup-modal-icon' />
                <h1 className='signup-modal-title'>Sign Up</h1>
                <WiStars className='signup-modal-icon' />
            </div>
            <form onSubmit={handleSubmit} className='signup-modal-form'>
                <label>
                    <input
                        type="text"
                        value={email}
                        placeholder='Email'
                        className='signup-modal-input'
                        onChange={handleInputs(setEmail, 'email')}
                        required
                    />
                </label>
                {errors.email && <p className='signup-modal-error-message'>{errors.email}</p>}
                <label>
                    <input
                        type="text"
                        value={username}
                        placeholder='Username'
                        className='signup-modal-input'
                        onChange={handleInputs(setUsername, 'username')}
                        required
                    />
                </label>
                {errors.username && <p className='signup-modal-error-message'>{errors.username}</p>}
                <label>
                    <input
                        type="text"
                        value={firstName}
                        placeholder='First Name'
                        className='signup-modal-input'
                        onChange={handleInputs(setFirstName, 'firstName')}
                        required
                    />
                </label>
                {errors.firstName && <p className='signup-modal-error-message'>{errors.firstName}</p>}
                <label>
                    <input
                        type="text"
                        value={lastName}
                        placeholder='Last Name'
                        className='signup-modal-input'
                        onChange={handleInputs(setLastName, 'lastName')}
                        required
                    />
                </label>
                {errors.lastName && <p className='signup-modal-error-message'>{errors.lastName}</p>}
                <label>
                    <input
                        type="password"
                        value={password}
                        placeholder='Password'
                        className='signup-modal-input'
                        onChange={handleInputs(setPassword, 'password')}
                        required
                    />
                </label>
                {errors.password && <p className='signup-modal-error-message'>{errors.password}</p>}
                <label>
                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder='Confirm Password'
                        className='signup-modal-input'
                        onChange={handleInputs(setConfirmPassword, 'confirmPassword')}
                        required
                    />
                </label>
                {errors.confirmPassword && <p className='signup-modal-error-message'>{errors.confirmPassword}</p>}
                <button type="submit" disabled={isButtonDisabled} className='signup-modal-button'>Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;
