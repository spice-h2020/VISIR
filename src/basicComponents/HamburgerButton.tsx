/**
 * @fileoverview This file creates a simple SVG image that looks like a hamburguer button. 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */

interface HamburguerIconProps {
    scale?: number;
}

/**
 * UI component that draws a SVG color stain.
 */
export const HamburguerIcon = ({
    scale = 1,
}: HamburguerIconProps) => {

    return (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            height={`${scale * 4}rem`} viewBox="0 0 64.000000 64.000000"
            preserveAspectRatio="xMidYMid meet">

            <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                fill="#000000" stroke="none">
                <path d="M90 495 l0 -45 230 0 230 0 0 45 0 45 -230 0 -230 0 0 -45z" />
                <path d="M90 325 l0 -45 230 0 230 0 0 45 0 45 -230 0 -230 0 0 -45z" />
                <path d="M90 155 l0 -45 230 0 230 0 0 45 0 45 -230 0 -230 0 0 -45z" />
            </g>
        </svg>
    );
};
