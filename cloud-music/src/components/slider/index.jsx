import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import 'swiper/swiper-bundle.css'
import Swiper from "swiper";
// 轮播图可以改造一下

const Slider = (props) => {
    const { bannerList } = props;
    const [sliderSwiper, setSliderSwiper] = useState (null);

    useEffect (() => {
        if (bannerList.length && !sliderSwiper){
            let newSliderSwiper = new Swiper(".slider-container", {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {el:'.swiper-pagination'},
            });
            setSliderSwiper(newSliderSwiper);
        }
    }, [bannerList.length, sliderSwiper]);


    return (
        <SliderContainer>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {
                        bannerList.map (slider => {
                            return (
                                <div className="swiper-slide" key={slider.imageUrl}>
                                    <div className="slider-nav">
                                        <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="swiper-pagination"/>
            </div>
            <div className="before"/>
        </SliderContainer>
    )
}

export default React.memo(Slider)