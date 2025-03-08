/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Audio, ThreeDots, ColorRing, Bars } from "react-loader-spinner";
import { ProgressBar } from "react-bootstrap";

function Spinners({ type }) {

    const [value, setValue] = useState(0);

    useEffect(()=> {
        let interval;
        if(value >=0 && value < 100){
            interval = setInterval(()=> {
                setValue((prev) => prev + 10)
            }, 1000);
        };

        return ()=> clearInterval(interval); 
    }, [value]);

    return (
        <>
            { type == 'audio' && <Audio /> }
            { type == 'threeDots' && <ThreeDots /> }
            { type == 'colorRing' && <ColorRing /> }
            { type == 'bars' && <Bars /> }
            { type == 'progressBar' && <ProgressBar animated variant="success" now={value} label={`${value}%`} className="w-50" /> }
        </>
    )
};

export default Spinners;