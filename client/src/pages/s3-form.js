import React, { useState, useRef } from 'react';
import './s3-form.css';
import { useMutation } from '@apollo/client';
import { FILE_UPLOAD_URL } from '../utils/mutations';
export default function S3Form({s3ImgURL, setS3ImgURL}) {
    const inputRef = useRef();
    const [ uploadedImg, setUploadedImg ] = useState([]);
    const [ deletedImgKey, setDeletedImgKey] = useState();
    const [ fileUploadURL, { error }  ] = useMutation(FILE_UPLOAD_URL);
    
    // Run input element
    const handleClick = () => {
        inputRef.current.click();
    };

    /**
     * URL.creatObjectURL() method
     * it takes an object and creates a temporary local URL that is tied to the document in which it is created
     * (meaning it won’t remember the URL if you leave the page and come back).
     * This URL can be used to set the the src property of a <img/> element
     */
    const handleChange = async (event) => {
          const fileUploaded = [];
          const imageUrl = [];
          for(let i = 0; i < event.target.files.length; i++){
            fileUploaded.push(URL.createObjectURL(event.target.files[i])) // In files[i], there is image's URL of local location            
            try {
                // Get S3-UploadUrl
                const { data } = await fileUploadURL();

                // Upload Img to AWS S3
                await fetch(data.fileUploadURL.signedUrl, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "multipart/form-data"
                    },
                    body: event.target.files[i]
                })
        
                // Store imageUrl from AWS S3 ( to put imageUrl lists to product model )
                imageUrl.push(data.fileUploadURL.signedUrl.split('?')[0])
              } catch (err) {
                console.error(err);
              }
          }
          setS3ImgURL([...s3ImgURL, ...imageUrl]);
          setUploadedImg([...uploadedImg, ...fileUploaded]);
        };


    const onClickDeleteS3Img = async (event) => {
        const index = event.target.dataset.imageIndex;
        // const getS3Key = event.target.dataset.s3key.split("amazonaws.com/")[1];

        let tempImgArray = [...uploadedImg];
        tempImgArray.splice(index, 1);
        setUploadedImg(tempImgArray);
        let temp = [...s3ImgURL];
        temp.splice(index, 1);
        setS3ImgURL(temp);

        // if(deletedImgKey){
        //     setDeletedImgKey([...deletedImgKey, {'key': getS3Key}])
        // }else{
        //     setDeletedImgKey([{'key': getS3Key}]);
        // }
        // const response = await deleteS3Img({'key': getS3Key});
        // console.log(response);
    }

    return(
        <div className="s3-img-upload-wrapper">
            <p className='text-center'>Photos from Local</p>
            <input ref={inputRef} type="file" style={{"display": "none"}} accept="image/gif, image/jpeg, image/png" multiple onChange={handleChange} />
            {uploadedImg.length <= 0 
                ?
                <div className="add-photos-btn-wrapper">
                    <div className="add-photos-btn"  onClick={handleClick}>Add Photos</div>
                </div>
                : <></>
            }

            {uploadedImg.length > 0
                ?
                    <div className="show-multi-imgs">
                    {uploadedImg.map((img, index) => (
                        <div className="photo-box" key={`${img}-${index}`}>
                            <img src={img} alt="uploaded-product" width="99px" height="98px" />
                            <div className="delete-btn" onClick={onClickDeleteS3Img} data-image-index={index} data-s3key={img}>X</div>
                        </div>
                    ))}
                    {
                        uploadedImg.length < 12
                        ?
                            <label className="file-upload-label" onClick={handleClick}>
                                <div className="+">+</div>
                                <div>Add photos</div>
                            </label>
                        :<></>
                    }
            </div>
                : <></>
            }            
        </div>

    )
}