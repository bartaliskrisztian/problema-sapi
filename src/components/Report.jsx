import React, {useState} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import "../assets/css/Report.css";

function Report() {

    const recaptchaRef = React.useRef();

    const [files, setFiles] = useState([]);
    const [problemText, setProblemText] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const [error, setError] = useState("");

    const handleTextChange = (e) => {
        setProblemText(e.target.value);
    }
    const onCaptchaChange = (token) => {
        if(token !== "" && token !== null) {
            setCaptchaError("");
        }
    }

    const onSubmitWithReCAPTCHA = async () => {
        console.log(files);
        setError("");
        const token = await recaptchaRef.current.props.grecaptcha.getResponse();
        if(token === "" || token === null) {
            let e = document.getElementsByClassName("rc-anchor-error-msg");
            setCaptchaError("Igazolja, hogy Ön nem robot.")
        }
        if(problemText.length < 20) {
            setError("Túl rövid a megfogalmazott szöveg.")
        }
    }
    
    return (
        <div className="report-container">
            <div className="report-container__top">
                <textarea 
                    className="text-input" 
                    value = {problemText}
                    placeholder="Írja le problémáját, kérdését" 
                    onChange={handleTextChange}
                />
                <ImageDropzone setUploadedImages={setFiles} files={files}/>
            </div>
            <div className="report-container__bottom">
                <div className="error-message">{error}</div>
                <div className="recaptcha-container">
                <ReCAPTCHA 
                    className="recaptcha"
                    ref = {recaptchaRef}
                    sitekey = {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                    onChange = {onCaptchaChange}
                    onErrored={(error) => console.log(error)}
                />
                <div className="recaptcha__error-message">{captchaError}</div>
                </div>
                <button className="submit-button" type="submit" onClick={onSubmitWithReCAPTCHA}>Küldés</button>
            </div>
        </div>
    );
}

export default Report;