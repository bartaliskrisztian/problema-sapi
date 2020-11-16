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
        'box-shadow': '2px 2px 7px #dbdbdb',
        backgroundColor: "#f5ecec",
        color: 'rgb(94, 90, 90)',
        'font-size': 'large',
        outline: "none",
        transition: "border .24s ease-in-out",
        width: "100%",
        height: "100%"
      };
      
      const activeStyle = {
        borderColor: "#2196f3"
      };
      
      const acceptStyle = {
        borderColor: "#00e676"
      };
      
      const rejectStyle = {
        borderColor: "#ff1744"
      };
      
      const thumbsContainer = {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 16
      };
      
      const thumb = {
        display: "inline-flex",
        borderRadius: 2,
        border: "1px solid #eaeaea",
        marginBottom: 8,
        marginRight: 8,
        width: "auto",
        height: 200,
        padding: 4,
        boxSizing: "border-box"
      };
      
      const thumbInner = {
        display: "flex",
        minWidth: 0,
        overflow: "hidden"
      };
      
      const img = {
        display: "block",
        width: "auto",
        height: "100%"
      };

    const [files, setFiles] = useState([]);
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
    noClick: true,
    noKeyboard: true,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );


    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img src={file.preview} style={img} />
          </div>
        </div>
      ));
    
      useEffect(
        () => () => {
          // Make sure to revoke the data uris to avoid memory leaks
          files.forEach(file => URL.revokeObjectURL(file.preview));
          console.log(files);
        },
        [files]
      );
    
      const filepath = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));

    return (
        <div className="dropzone-container">
        <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here</p>
            <button type="button" onClick={open}>
            Open File Dialog
            </button>
        </div>
        {/* <div>
            <h4>Files</h4>
            <ul>{filepath}</ul>
        </div>
         <div style={thumbsContainer}>{thumbs}</div>  */}
    </div>
    );
}

export default ImageDropzone;