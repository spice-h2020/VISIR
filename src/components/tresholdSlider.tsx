import React, { useEffect, useState } from "react";
import '../style/button.css';

interface TresholdSliderProps {
    /**
     * Optional input handler
     */
    onInput?: (value: number) => void;
}

const intialThreshold = 0.5;
/**
 * Primary UI component for user interaction
 */
export const TresholdSlider = ({
    onInput = (value: number): void => {
        console.log(`Slider input ${value}`);
    },
}: TresholdSliderProps) => {

    const [currentValue, setCurrentValue] = useState<number>(intialThreshold);


    return (
        <div>
            Minimum Similarity:
            <span> {currentValue} </span>
            <input type="range"
                min="0.0" max="1.0" step="0.1"
                value={currentValue}
                onInput={(): void => {
                    //setCurrentValue(value);
                }}
                onChange={(): void => {
                    onInput(currentValue);
                }}
            />
        </div>
    );
};
