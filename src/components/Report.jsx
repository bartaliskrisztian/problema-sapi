import React, {useState} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import "../assets/css/Report.css";

function Report() {

    const recaptchaRef = React.useRef();

    const [files, setFiles] = useState([]);
    const [problemText, setProblemText] = useState("");

    const handleTextChange = (e) => {
        setProblemText(e.target.value);
    }

    const onCaptchaChange = (value) => {
        console.log("Captcha value:", value);
    }

    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();
     
        // apply to form data
    }
    /*
    

    const handleFileChange = (e) => {
        setFiles([...files, ...e.target.files]);
    }
   
    console.log(files);
    <ReCAPTCHA 
                ref = {recaptchaRef}
                sitekey = "6LeDkuMZAAAAABPwjt5qtMOC37LxIY-rZZXb_CI4"
                onChange = {onCaptchaChange}
            />
    */

    return (
        <div className="report-container">
            <div className="report-container__top">
                <textarea 
                    className="text-input" 
                    value = {problemText}
                    placeholder="Írja le problémáját, kérdését" 
                    onChange={handleTextChange}
                />
                <ImageDropzone />
            </div>
            <div className="report-container__bottom">

            </div>
        </div>
    );
}

export default Report;