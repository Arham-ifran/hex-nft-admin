import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './FullPageLoader.css';

function FullPageLoader() {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <React.Fragment>
            <div className="fullpage-loader-holder d-flex justify-content-center align-items-center">
                <div className='img-loader'>
                    <img className="img-fluid" src="https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1655727474/hex-nft/assets/mynist_s1vmud.png" alt="" />
                </div> 
            </div>
        </React.Fragment>
    );
};

export default FullPageLoader;