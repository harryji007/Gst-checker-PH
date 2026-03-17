import { useState, useRef, useCallback } from "react";
import axios from 'axios';
import './GSTChecker.css'; // Your custom styles

const GSTChecker = () => {
    const [gstNumber, setGstNumber] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const checkGSTStatus = useCallback(async () => {
        if (!gstNumber) return;
        setLoading(true);
        try {
            const response = await axios.get(`https://api.claudedemo.com/gst/${gstNumber}`);
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setStatus({error: 'Error fetching data. Please try again.'});
        } finally {
            setLoading(false);
        }
    }, [gstNumber]);

    const handleSubmit = (e) => {
        e.preventDefault();
        checkGSTStatus();
    };

    return (
        <div className="gst-checker">
            <h1>GST Checker</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter GST Number"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    ref={inputRef}
                />
                <button type="submit" disabled={loading}>Check Status</button>
            </form>
            {loading && <p>Loading...</p>}
            {status && <div className="result">
                <h2>Result:</h2>
                {status.error ? <p className="error">{status.error}</p> : <p>GST Status: {status.gst_status}</p>}
            </div>}
        </div>
    );
};

export default GSTChecker;