import React, {useState} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import ImageDropzone from "./ImageDropzone";
import "../assets/css/Report.css";
import { db } from "../firebase/index";
import firebase from "firebase";

function Report() {

    const recaptchaRef = React.useRef();

    const [files, setFiles] = useState([]);
    const [problemText, setProblemText] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleTextChange = (e) => {
        setProblemText(e.target.value);
    }

    const onCaptchaChange = (token) => {
        if(token !== "" && token !== null) {
            setCaptchaError("");
        }
    }

    const resetPage = () => {
        setProblemText("");
        setFiles([]);
        setCaptchaError("");
        recaptchaRef.current.props.grecaptcha.reset();
    }

    const uploadFromBlobAsync = async ({blobUrl, name}) => {
        if (!blobUrl || !name) return null;
        try {
            const blob = await fetch(blobUrl).then((r) => r.blob());
            const snapshot = await firebase.storage().ref("report_images").child(name).put(blob);
            return await snapshot.ref.getDownloadURL();
        } catch (error) {
            throw error;
        }
    }

    const uploadReport = async (url) => {
        const id = `${Date.now()}`;
        db.collection("reports").doc(`${id}`).get().then((docRef) => {
            if(docRef.data() === undefined) {
                db.collection("reports").doc(`${id}`).set({
                    text: problemText,
                    imageDownloadURL: url
                });
            }
        });
    }

    const uploadToFirebase = () => {
        if(files.length) {
            try {
                const url = uploadFromBlobAsync({
                    blobUrl: URL.createObjectURL(files[0]),
                    name: `${files[0].name}_${Date.now()}`
                })
                url.then((downloadURL) => {
                    uploadReport(downloadURL);
                });
                return
            }
            catch (e) {
                setIsUploading(false)
                setError(e.message)
                return
            }
        }
        uploadReport(null);
    }

    const onSubmitWithReCAPTCHA = async () => {
        setError("");
        const token = await recaptchaRef.current.props.grecaptcha.getResponse();
        if(token === "" || token === null) {
            setCaptchaError("Igazolja, hogy Ön nem robot.")
            return;
        }
        if(problemText.length < 20) {
            setError("Túl rövid a megfogalmazott szöveg.")
            return;
        }

        setIsUploading(true);
        uploadToFirebase();
        setIsUploading(false);

        setError("Sikeres feltöltés");
        setTimeout(() => {setError("")}, 3000);
        
        resetPage();
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
                <ImageDropzone setUploadedImages={setFiles} files={files} />
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
                {isUploading && (<div className="loader"></div>)}
            </div>
        </div>
    );
}

export default Report;