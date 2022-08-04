import React, { useState, useRef } from 'react';

import './s3-form.css';

export default function S3Form() {
    const inputRef = useRef();
    const [ uploadedImg, setUploadedImg ] = useState([]);
    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = () => {
        inputRef.current.click();
    };

    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = async (event) => {
        // console.log(event.target.files);
        // URL.creatObjectURL() method takes an object (like our file) and 
        // creates a temporary local URL that is tied to the document in which it is created 
        // (meaning it won’t remember the URL if you leave the page and come back).
        // This URL can be used to set the the src property of a <img/> element
          const fileUploaded = [];
          const imageUrl = [];
          for(let i = 0; i < event.target.files.length; i++){
            fileUploaded.push(URL.createObjectURL(event.target.files[i])) // In files[i], there is image's URL of local location            
    
            // Get S3-UploadUrl
            // const s3UploadUrl = await s3GetUploadUrl();
            
            // // Upload Img to AWS S3
            // await fetch(s3UploadUrl, {
            //     method: "PUT",
            //     headers: {
            //       "Content-Type": "multipart/form-data"
            //     },
            //     body: event.target.files[i]
            // })
    
            // Store imageUrl from AWS S3 ( to put imageUrl lists to product model )
            // imageUrl.push(s3UploadUrl.split('?')[0])
          }
    
        //   setImgAWSUrl([...imgAWSUrl, ...imageUrl]);
          setUploadedImg([...uploadedImg, ...fileUploaded]);
        };

    return(
        <div className="container">
            <div className="s3-form-container mt-5" onClick={handleClick}>
                <input ref={inputRef} type="file" style={{"display": "none"}} id="upload-img-input" accept="image/gif, image/jpeg, image/png" multiple onChange={handleChange} />
                <div className="productForm-body-item productForm-img-box">
                    <div className="productForm-img-border">
                        <div><i className="fas fa-upload"></i></div>
                        <div>ADD IMAGES</div>
                    </div>
                </div>
            </div>
            <div id="multiple-image-upload">
                            {uploadedImg.map((img, index) => {
                                return (<div className="uploaded-images dragMenu"  data-draggable="true" key={index}>
                                    <div>
                                        <img src={img} alt="uploaded-product" width="110px" height="110px" />
                                    </div>
                                    <div id="img-delete-btn">
                                        {/* <button onClick={onClickDeleteS3Img} data-image-index={index} data-s3key={img}>X</button> */}
                                    </div>

                                </div>)
                            })}
                            {uploadedImg.length < 12?
                            <label className="file-upload-label" onClick={handleClick}>
                                <i className="fas fa-plus"></i>
                            </label>:<></>
                            }
                        </div>
        </div>

    )
}