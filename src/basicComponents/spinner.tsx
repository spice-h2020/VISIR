/**
 * @fileoverview This file creates a SVG of a spinner... spining around itself. Used mostly for loading feedback.
 * Can change its color and its scale
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */

interface SpinnerProps {
    scale?: number;
    color?: string;
}

/**
 * UI component that draws a SVG spinner.
 */
export const Spinner = ({
    scale = 1,
    color = "red"
}: SpinnerProps) => {

    const style: React.CSSProperties = {}

    style.height = ` ${4 * scale}rem`;

    return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill={color} xmlns="http://www.w3.org/2000/svg"
            style={style} className="loading-spinner">
            <path d="M16 8a7.917 7.917 0 00-2.431-5.568A7.776 7.776 0 005.057.896c-.923.405-1.758.992-2.449 1.712S1.371 4.182 1.011 5.105a7.531 7.531 0 00.115 5.742c.392.892.961 1.7 1.658 2.368S4.307 14.41 5.2 14.758a7.286 7.286 0 002.799.493 7.157 7.157 0 006.526-4.547 6.98 6.98 0 00.415-1.622l.059.002a1 1 0 00.996-1.083h.004zm-1.589 2.655c-.367.831-.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434a6.759 6.759 0 01-2.608.454 6.676 6.676 0 01-4.685-2.065 6.597 6.597 0 01-1.38-2.173 6.514 6.514 0 01.116-4.976c.342-.77.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c.771-.298 1.596-.438 2.416-.416s1.629.202 2.368.532c.74.329 1.41.805 1.963 1.387s.988 1.27 1.272 2.011a6.02 6.02 0 01.397 2.32h.004a1 1 0 00.888 1.077 6.872 6.872 0 01-.481 1.578z">
            </path>
        </svg>

    );
};
