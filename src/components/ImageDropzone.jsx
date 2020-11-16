import React, {useMemo, useEffect, useState} from 'react';
import { useDropzone } from "react-dropzone";
import "../assets/css/ImageDropzone.css";

function ImageDropzone() {

    const baseStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#eeeeee",
        borderStyle: "dashed",
        boxShadow: '2px 2px 7px #dbdbdb',
        backgroundColor: "#f5ecec",
        color: 'rgb(94, 90, 90)',
        fontSize: 'large',
        outline: "none",
        transition: "border .24s ease-in-out",
        width: "100%",
        height: "100%"
    };
    
    const activeStyle = {
        borderColor: "#2196f3"
    };
    
    const acceptStyle = {
        borderColor: "#666464"
    };
    
    const rejectStyle = {
        borderColor: "#ff1744"
    };
    
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState("");

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        open
    } = useDropzone({
        accept: "image/*",
        maxFiles: 5,
        maxSize: 5242880,
        noClick: true,
        noKeyboard: true,
        onDrop: (acceptedFiles, fileRejections) => {
            setErrors("");
            setFiles([...files, 
                    ...acceptedFiles.map(file =>
                    Object.assign(file, {preview: URL.createObjectURL(file)}))]);
            fileRejections.forEach( (file) => {
                file.errors.forEach((err) => {
                    if (err.code === "file-too-large") {
                        setErrors(`Error: ${err.message}`);
                    }
                    if (err.code === "file-invalid-type") {
                        setErrors(`Error: ${err.message}`);
                    }
                });
            });
        }
    });

    const removeImages = () => {
        console.log(files);
        setFiles([]);
        console.log(files);
    }

    const style = useMemo(
        () => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
        }),
        // eslint-disable-next-line
        [isDragActive, isDragReject]
    );

    const thumbs = files.map(file => (
        <div className="thumb-image__holder" key={file.name}>
            <img className="thumb-image" src={file.preview} alt={file.name} />
            <div>{file.path} - {file.size} bytes</div>
        </div>
    ));

    useEffect(
    () => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
    );

    
    
    return (
        <div className="dropzone-container">
        <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {!files.length ?
            (<div className="drop-title">
                Húzza ide az állományokat
                <div className="drop-arrow">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>) :
            (<div className="images">
                {thumbs}
            </div>)}
            <div className="upload-buttons">
                <div className="image-errors">{errors}</div>
                <button className="upload-image__button" type="button" onClick={open}>
                    Kép kiválasztása
                </button>
                <button className="clear-images__button" type="button" onClick={removeImages}>
                    Képek eltávolítása
                </button>
            </div>
        </div>
    </div>
    );
}

export default ImageDropzone;