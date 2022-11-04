/**
 * @fileoverview This file creates a simple SVG image that looks like a stain.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */

interface ShapeFormProps {
    shape: string;
    scale?: number;
    color?: string;
}

const shapeToPath = new Map<string, string>();
shapeToPath.set("diamond", "50 0, 0 50, 50 100, 100 50");
shapeToPath.set("star", "50 5, 61 40, 98 40, 68 62, 79 96, 50 75, 21 96, 32 62, 2 40, 39 40");
shapeToPath.set("triangle", "50 0, 100 100, 0 100");
shapeToPath.set("square", "100 0, 100 100, 0 100, 0 0");
shapeToPath.set("triangleDown", "0 0, 50 100, 100 0");
shapeToPath.set("hexagon", "25 5, 75 5, 100 50, 75 95, 25 95, 0 50");


/**
 * SVG component that draws a color stain
 */
export const ShapeForm = ({
    shape,
    scale = 1,
    color = "black",
}: ShapeFormProps) => {

    let figure = <circle cx="50" cy="50" r="50" />;

    if (shape !== "dot") {
        figure = <polygon points={shapeToPath.get(shape)} />
    }

    return (

        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            height={`${20 * scale}px`}
            viewBox="0 0 100.000000 100.000000"
            preserveAspectRatio="xMidYMid meet">

            <g
                fill={color} stroke="none">
                {figure}
            </g>
        </svg>
    );
};
