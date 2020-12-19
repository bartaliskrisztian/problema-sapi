import React, {useMemo, useEffect, useState} from 'react';
import { useDropzone } from "react-dropzone";
import Compress from "client-compress";
import "../assets/css/ImageDropzone.css";

function ImageDropzone(prop) {

    const compress = new Compress(
        {
            targetSize: 5
        }
    );
    // style attributes for dropzone container
    const baseStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: 1,
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
        height: "100%",
        padding: "10px"
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
    
    const [errors, setErrors] = useState(""); // variable to store error messages


    // get properties for dropzone
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
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        // when the user drops an image on the dropzone
        onDrop: (acceptedFiles, fileRejections) => {
            setErrors("");
    
            compress.compress(acceptedFiles).then((images) => {
                    const { photo, info } = images[0];
                    const file = new File([photo.data], photo.name, 
                        {
                          lastModified: new Date(),
                          type: photo.type,
                          path: photo.name
                        }
                    );
                    prop.setUploadedImages([Object.assign(file, {preview: URL.createObjectURL(file)})]);
            });

            // on error
            fileRejections.forEach( (file) => {
                file.errors.forEach((err) => {
                    // when the file is too large
                    if (err.code === "file-too-large") {
                        setErrors(`${file.file.name} túl nagy méretű`);
                    }
                    // when the file's type is not acccepted
                    if (err.code === "file-invalid-type") {
                        setErrors(`${file.file.name} érvénytelen fájlformátum`);
                    }
                });
            });
        }
    });


    // removes all images from the dropzone and from the state
    const removeImages = () => {
        setErrors("");
        prop.setUploadedImages([]);
    }

    // setting style depending on the user's interaction
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

    const thumbs = prop.files.map((file, i) => (
        <div className="thumb-image__holder" key={i}>
            <img className="thumb-image" src={file.preview} alt={file.name} />
            <div>{file.path} - {file.size} bytes</div>
        </div>
    ));

    
    useEffect(
    () => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        prop.files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [prop.files]
    );
    

    return (
        <div className="dropzone-container">
        <div {...getRootProps({ style })}>
            <input {...getInputProps() } />
            {!prop.files.length ?
            (<div className="drop-title">
                Húzza ide az állományt (max. egy db., max. 5 MB)
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
                    Kép eltávolítása
                </button>
            </div>
        </div>
    </div>
    );
}

export default ImageDropzone;