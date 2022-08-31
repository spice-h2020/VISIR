//TODO WIP component. Will be used to change the edge value threshold view options


import { useEffect, useState } from "react";
//import "../style/slider.css"

interface TresholdSliderProps {
    /**
     * Optional input handler
     */
    content?: string;
    contentUnit?: string;
    minimum?: number;
    maximum?: number;
    step?: number;
    initialValue: number;

    /**
     * Optional input handler
     */
    onInput: Function;
}


/**
 * Primary UI component for user interaction
 */
export const TresholdSlider = ({
    content,
    contentUnit = "",
    minimum = 0.0,
    maximum = 1.0,
    step = 0.1,
    initialValue,
    onInput
}: TresholdSliderProps) => {

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(setTimeout(() => '', 10));
    const [value, setValue] = useState<string>(initialValue.toString());

    useEffect(() => {
        if (timer !== undefined && timer !== null)
            clearTimeout(timer);

        setTimer(setTimeout(() => onInput(value), 200));
    }, [value]);


    const label = getContent(content, contentUnit, value);

    return (
        <div className="slider-container">
            {label}
            <input type="range"
                min={minimum} max={maximum} step={step}
                value={value}
                onChange={(e) => {
                    if (e.target.value !== undefined) {
                        setValue(e.target.value);
                    }
                }}
            />
        </div>
    );
};



function getContent(content: string | undefined, contentUnit: string, value: string) {
    if (contentUnit === "")
        return content === undefined ? "" : `${content} ${value === "0" ? "0.0" : value === "1" ? "1.0" : value}`;

    //if (contentUnit === "%") Commented because there are no other options
    return content === undefined ? "" : `${content} ${value === "0" ? `0 ${contentUnit}` : `${value} ${contentUnit}`}`;
}

