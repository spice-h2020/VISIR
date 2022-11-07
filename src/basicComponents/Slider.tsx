/**
 * @fileoverview This file creates a slider with an optional text above that tracks the current slider value.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import { useState } from "react";

const sliderContainer: React.CSSProperties = {
    padding: "12px 16px",
    margin: "0px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontSize: "1rem"
}

interface SliderProps {
    /**
     * Text above the slider.
     */
    content?: string;
    /**
     * Text after the content text and the current value number.
     */
    contentUnit?: string;
    /**
     * Minimum value of the slider.
     */
    minimum?: number;
    /**
     * Maximum value of the slider.
     */
    maximum?: number;
    /**
     * Steps of the slider thumb every time the user moves it.
     */
    step?: number;
    /**
     * Initial value of the slider.
     */
    initialValue: number;
    /**
     * Function executed when the slider is moved and after a timer has expired.
     */
    onInput: Function;
}


/**
 * UI component that creates a slider .
 */
export const Slider = ({
    content,
    contentUnit = "",
    minimum = 0.0,
    maximum = 1.0,
    step = 0.1,
    initialValue,
    onInput
}: SliderProps) => {

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(setTimeout(() => '', 10));
    const [value, setValue] = useState<string>(initialValue.toString());

    /*
    There is a timer reseted every time the user moves the slider to reduce the number of onInput calls while the user 
    is still moving the slider.
    */
    const updateValue = (newValue: string) => {
        if (timer !== undefined && timer !== null)
            clearTimeout(timer);

        setValue(newValue);
        setTimer(setTimeout(() => onInput(newValue), 200));
    }

    const label = getContent(content, contentUnit, value);
    const size = (parseFloat(value) - minimum) * 100 / (maximum - minimum) + '% 100%';

    return (
        <div style={sliderContainer}>
            {label}
            <input type="range"
                style={{ backgroundSize: size }}
                min={minimum} max={maximum} step={step}
                value={value}
                onChange={(e) => {
                    if (e.target.value !== undefined) {
                        updateValue(e.target.value);
                    }
                }}
            />
        </div>
    );
};


/**
 * Aux function that returns the text above the slider combining content, value and contentUnit. 
 * If there is no content unit, it will change "0" and "0.0" to "1" and "1.0" to mantain the same size across all 
 * values.
 * @param content content of the slider.
 * @param contentUnit text after text and value.
 * @param value current value of the slider.
 * @returns a react node with the text that will go above the slider.
 */
function getContent(content: string | undefined, contentUnit: string, value: string): React.ReactNode {

    if (contentUnit === "")
        return content === undefined ? "" : `${content} ${value === "0" ? "0.0" : value === "1" ? "1.0" : value}`;

    //if (contentUnit === "%") Commented because there are no other options
    return content === undefined ? "" : `${content} ${value === "0" ? `0 ${contentUnit}` : `${value} ${contentUnit}`}`;
}

