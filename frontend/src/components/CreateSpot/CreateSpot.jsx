import { useState } from 'react';
import './CreateSpot.css';

const CreateSpot = () => {
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    // const [errors, setErrors] = useState({});

    return (
        <div>
            <h1>Create a New Spot</h1>
            <form>
                <section>
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they book a reservation.</p>
                    <label> Country
                        <input
                            type='text'
                            value={country}
                            placeholder='Country'
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </label>
                    <label> Street Address
                        <input
                            type='text'
                            value={address}
                            placeholder='Street Address'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </label>
                    <label> City
                        <input
                            type='text'
                            value={city}
                            placeholder='City'
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </label>
                    <label> State
                        <input
                            type='text'
                            value={state}
                            placeholder='State'
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </label>
                </section>
                <section>
                    <h2>Describe your place to guests...</h2>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea
                        placeholder='Please write at least 30 characters...'
                        required
                    />
                </section>
                <section>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <label>
                        <input
                            type='text'
                            placeholder='Name of your spot'
                            required
                        />
                    </label>
                </section>
                <section>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label>
                        <input
                            type='number'
                            placeholder='Price per night (USD)'
                            required
                        />
                    </label>
                </section>
                <section>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <label>
                        <input
                            type='text'
                            placeholder='Preview Image URL'
                            required
                        />
                        <input
                            type='text'
                            placeholder='Image URL'
                        />
                        <input
                            type='text'
                            placeholder='Image URL'
                        />
                        <input
                            type='text'
                            placeholder='Image URL'
                        />
                        <input
                            type='text'
                            placeholder='Image URL'
                        />
                    </label>
                </section>
                <button>Create Spot</button>
            </form>
        </div>
    )
};

export default CreateSpot;
