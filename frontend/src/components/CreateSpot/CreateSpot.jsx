import { useEffect, useState, useRef, useMemo } from 'react';
import { BsCurrencyDollar } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { formNewSpot, formNewImage, updateCurrUserSpots } from '../../store/spots';
import './CreateSpot.css';

const CreateSpot = ({ isUpdate = false }) => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputRefs = useRef({});

    const spot = useSelector((state) => state.spots[spotId]);
    // fix memoized warning
    const memoizedSpot = useMemo(() => spot || {}, [spot]);

    const [country, setCountry] = useState(memoizedSpot.country || "");
    const [address, setAddress] = useState(memoizedSpot.address || "");
    const [city, setCity] = useState(memoizedSpot.city || "");
    const [state, setState] = useState(memoizedSpot.state || "");
    const [lat, setLat] = useState(memoizedSpot.lat || "");
    const [lng, setLng] = useState(memoizedSpot.lng || "");
    const [description, setDescription] = useState(memoizedSpot.description || "");
    const [name, setName] = useState(memoizedSpot.name || "");
    const [price, setPrice] = useState(memoizedSpot.price || "");
    const [previewImage, setPreviewImage] = useState(memoizedSpot.previewImage || "");
    const [imageOne, setImageOne] = useState("");
    const [imageTwo, setImageTwo] = useState("");
    const [imageThree, setImageThree] = useState("");
    const [imageFour, setImageFour] = useState("");
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (isUpdate && memoizedSpot) {
            setCountry(memoizedSpot.country || "");
            setAddress(memoizedSpot.address || "");
            setCity(memoizedSpot.city || "");
            setState(memoizedSpot.state || "");
            setLat(memoizedSpot.lat || "");
            setLng(memoizedSpot.lng || "");
            setDescription(memoizedSpot.description || "");
            setName(memoizedSpot.name || "");
            setPrice(memoizedSpot.price || "");
            setPreviewImage(memoizedSpot.previewImage || "");
        }
    }, [isUpdate, memoizedSpot]);


    // error validations
    const validationErrors = () => {
        const newErrors = {};
        if (!country) newErrors.country = 'Country is required';
        if (!address) newErrors.address = 'Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!lng) newErrors.lng = 'Longitude is required';
        if (!lat) newErrors.lat = 'Latitude is required';
        if (lat > 90 || lat < -90) newErrors.lat = 'Latitude must be within -90 and 90';
        if (lng > 180 || lng < -180) newErrors.lng = 'Longitude must be within -180 and 180';
        if (description.length < 30) newErrors.description = 'Description needs 30 or more characters';
        if (description.length > 255) newErrors.description = 'Description must be 255 characters or less';
        if (!name) newErrors.name = 'Name is required';
        if (name.length > 50) newErrors.name = 'Name must be less than 50 characters';
        if (!price) newErrors.price = 'Price per night is required';
        if (price < 0) newErrors.price = 'Price per day must be a positive number';
        if (!isUpdate && !previewImage) newErrors.previewImage = 'A preview image URL is required';
        return newErrors;
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = validationErrors();
        if (Object.keys(hasErrors).length > 0) {
            setErrors(hasErrors);
            const firstErrorField = Object.keys(hasErrors)[0];
            inputRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth' });
        } else {
            const spotData = {
                country,
                address,
                city,
                state,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                description,
                name,
                price: parseFloat(price)
            };
            try {
                // check form if updating or creating
                if (isUpdate) {
                    // dispatching update spot action
                    const updatedSpot = await dispatch(updateCurrUserSpots(spotId, spotData));
                    // navigate to spots details with updates
                    navigate(`/spots/${updatedSpot.id}`);
                } else {
                    // dispatching create new spot action
                    const newSpot = await dispatch(formNewSpot(spotData));
                    const spotId = newSpot.id;
                    // dispatching image upload creation
                    // use Promise.all()
                    const imageUrls = [previewImage, imageOne, imageTwo, imageThree, imageFour].filter(url => url);
                    const imagePromises = imageUrls.map(url => dispatch(formNewImage(spotId, { url })));
                    await Promise.all(imagePromises);
                    // navigate to new spot details after promise images are all loaded
                    navigate(`/spots/${newSpot.id}`);
                }
            } catch (res) {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            }
        }
    }

    return (
        <div className='create-form-container'>
            <h1 className='create-form-title'>{isUpdate ?
                'Update Your Spot' :
                'Create a New Spot'}
            </h1>
            <form className='spot-form' onSubmit={handleSubmit}>
                <section className='form-section'>
                    <h2 className='section-heading'>Where&apos;s your place located?</h2>
                    <p className='create-form-caption'>Guests will only get your exact address once they book a reservation.</p>
                    <label className='create-form-label'> Country
                        <input
                            type='text'
                            value={country}
                            className='create-form-input'
                            placeholder='Country'
                            onChange={handleInputs(setCountry, 'country')}
                            ref={(el) => inputRefs.current.country = el}
                        />
                    </label>
                    {errors.country && <p className='create-spot-error'>{errors.country}</p>}
                    <label className='create-form-label'> Street Address
                        <input
                            type='text'
                            value={address}
                            className='create-form-input'
                            placeholder='Street Address'
                            onChange={handleInputs(setAddress, 'address')}
                            ref={(el) => inputRefs.current.address = el}
                        />
                    </label>
                    {errors.address && <p className='create-spot-error'>{errors.address}</p>}
                    <div className='create-form-input-row'>
                        <label className='create-form-label'> City
                            <input
                                type='text'
                                value={city}
                                className='create-form-input'
                                placeholder='City'
                                onChange={handleInputs(setCity, 'city')}
                                ref={(el) => inputRefs.current.city = el}
                            />
                        </label>
                        <span className='create-form-input-comma'>,</span>
                        <label className='create-form-label'> State
                            <input
                                type='text'
                                value={state}
                                className='create-form-input'
                                placeholder='State'
                                onChange={handleInputs(setState, 'state')}
                                ref={(el) => inputRefs.current.state = el}
                            />
                        </label>
                    </div>
                    {errors.city && <p className='create-spot-error'>{errors.city}</p>}
                    {errors.state && <p className='create-spot-error'>{errors.state}</p>}
                    <div className='create-form-input-row'>
                        <label className='create-form-label'> Latitude
                            <input
                                type='number'
                                value={lat}
                                className='create-form-input'
                                placeholder='Latitude'
                                onChange={handleInputs(setLat, 'lat')}
                                ref={(el) => inputRefs.current.lat = el}
                            />
                        </label>
                        <span className='create-form-input-comma'>,</span>
                        <label className='create-form-label'> Longitude
                            <input
                                type='number'
                                value={lng}
                                className='create-form-input'
                                placeholder='Longitude'
                                onChange={handleInputs(setLng, 'lng')}
                                ref={(el) => inputRefs.current.lng = el}
                            />
                        </label>
                    </div>
                    {errors.lat && <p className='create-spot-error'>{errors.lat}</p>}
                    {errors.lng && <p className='create-spot-error'>{errors.lng}</p>}
                </section>
                <section className='form-section'>
                    <h2 className='section-heading'>Describe your place to guests...</h2>
                    <p className='create-form-caption'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea
                        value={description}
                        className='create-form-textarea'
                        onChange={handleInputs(setDescription, 'description')}
                        placeholder='Please write at least 30 characters...'
                        ref={(el) => inputRefs.current.description = el}
                    />
                    {errors.description && <p className='create-spot-error'>{errors.description}</p>}
                </section>
                <section className='form-section'>
                    <h2 className='section-heading'>Create a title for your spot</h2>
                    <p className='create-form-caption'>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <label className='create-form-label'>
                        <input
                            type='text'
                            value={name}
                            onChange={handleInputs(setName, 'name')}
                            className='create-form-input'
                            placeholder='Name of your spot'
                            ref={(el) => inputRefs.current.name = el}
                        />
                    </label>
                    {errors.name && <p className='create-spot-error'>{errors.name}</p>}
                </section>
                <section className='form-section'>
                    <h2 className='section-heading'>Set a base price for your spot</h2>
                    <p className='create-form-caption'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label className='create-form-label-price'> <BsCurrencyDollar />
                        <input
                            type='number'
                            value={price}
                            onChange={handleInputs(setPrice, 'price')}
                            className='create-form-input'
                            placeholder='Price per night (USD)'
                            ref={(el) => inputRefs.current.price = el}
                        />
                    </label>
                    {errors.price && <p className='create-spot-error'>{errors.price}</p>}
                </section>
                <section className='form-section'>
                    <h2 className='section-heading'>Liven up your spot with photos</h2>
                    <p className='create-form-caption'>Submit a link to at least one photo to publish your spot.</p>
                    <label className='create-form-label'>
                        <input
                            type='url'
                            value={previewImage}
                            onChange={handleInputs(setPreviewImage, 'previewImage')}
                            className='create-form-input'
                            placeholder='Preview Image URL'
                            ref={(el) => inputRefs.current.previewImage = el}
                        />
                        {errors.previewImage && <p className='create-spot-error'>{errors.previewImage}</p>}
                        <input
                            type='url'
                            value={imageOne}
                            onChange={(e) => setImageOne(e.target.value)}
                            className='create-form-input'
                            placeholder='Image URL'
                        />
                        <input
                            type='url'
                            value={imageTwo}
                            onChange={(e) => setImageTwo(e.target.value)}
                            className='create-form-input'
                            placeholder='Image URL'
                        />
                        <input
                            type='url'
                            value={imageThree}
                            onChange={(e) => setImageThree(e.target.value)}
                            className='create-form-input'
                            placeholder='Image URL'
                        />
                        <input
                            type='url'
                            value={imageFour}
                            onChange={(e) => setImageFour(e.target.value)}
                            className='create-form-input'
                            placeholder='Image URL'
                        />
                    </label>
                </section>
                <button type='submit' className='create-form-button'>Create Spot</button>
            </form>
        </div>
    )
};

export default CreateSpot;
