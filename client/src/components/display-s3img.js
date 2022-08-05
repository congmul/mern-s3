import React from 'react';
import './display-s3img.css';
export default function DisplayS3img( {s3ImgURL = []} ) {
    console.log(s3ImgURL);
    return(<>
        <div className="s3-img-upload-wrapper">
            <p className='text-center'>Photos from AWS-S3</p>
            <div className="show-multi-imgs">
                {s3ImgURL.map((img, index) => (
                    <div className="photo-box" key={`${img}-${index}`}>
                        <img src={img} alt="uploaded-product" width="99px" height="98px" />                        
                    </div>
                ))}                
            </div>
        </div>

    </>)
}