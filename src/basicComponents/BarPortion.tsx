/**
 * @fileoverview This file creates a portion of an horizontal stacked bar graphic. 
 * If the bar is too thin, the inside text will be hidden.
 * The color of the bar depends on the dimension of the bar. Shape dimension additionaly add the shape figure to the 
 * shown text.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, nodeConst } from "../constants/nodes";
//Packages
import React, { useEffect, useRef, useState } from "react";
import { ShapeForm } from "./ShapeForm";

const barPortion: React.CSSProperties = {
    display: "flex",
    height: "100%",

    float: "left",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
    whiteSpace: "nowrap",

    cursor: "default",

    fontSize: "small",
}

interface StackedBarProps {
    /**
     * Tittle/value of the graph.
     */
    percentile: number,
    /**
     * Text to show when hovering a bar portion.
     */
    hoverText: string,
    /**
     * Order of this bar portion in a stacked bar.
     */
    portionOrder: number,
    /**
     * Dimensions represented in the portion.
     */
    dim: Dimensions | undefined
    /**
     * Index of the value of this stacked bar in its dimension. Used to know what color/shape to use.
     */
    dimensionIndex: number,
}

/**
 * UI component that creates a portion of a stacked bar graph.
 */
export const BarPortion = ({
    percentile: value,
    hoverText,
    portionOrder,
    dim,
    dimensionIndex
}: StackedBarProps) => {

    const [text, setText] = useState<string>(`${value}%`);
    const [symbolActive, setSymbolActive] = useState<boolean>(true);

    const htmlRef = useRef(null);

    //Remove the inner text if the width of the portion is too small
    useEffect(() => {
        if (htmlRef !== null && htmlRef.current !== null) {
            const width = (htmlRef.current as HTMLElement).clientWidth;

            if (width <= 14.0) {
                setText("");
                setSymbolActive(false);
            } else if (width <= 38) {
                setText((value.toFixed(0)).toString());
                setSymbolActive(false);
            } else {
                setText(`${value}%`);
                setSymbolActive(true);
            }
        }

    }, [htmlRef, value]);

    let style: React.CSSProperties = JSON.parse(JSON.stringify(barPortion));

    style.width = `${value}%`;
    style.background = getBackgroundColor(dimensionIndex, dim, portionOrder);
    style.color = getTextColor(dimensionIndex, dim, portionOrder);

    hoverText = `${hoverText === "" ? "(empty)" : hoverText} ${value}%`;

    return (
        <span ref={htmlRef} title={hoverText} className="bar-portion" style={style}>
            <div className="row" style={{ alignItems: "center" }}>
                {text}
                <span style={{ width: "3px" }} />
                {symbolActive === true ? getSymbol(dimensionIndex, dim, portionOrder) : ""}
            </div>
        </span>);
};

function getBackgroundColor(dimensionIndex: number, dim: Dimensions | undefined, portionOrder: number) {
    switch (dim) {
        case Dimensions.Color: {
            return nodeConst.nodeDimensions.getColor(dimensionIndex);
        }
        case Dimensions.Shape: {
            return portionOrder % 2 ? "white" : "black";
        }
        default: {
            switch (portionOrder % 3) {
                case 1: {
                    return "red";
                }
                case 2: {
                    return "blue";
                }
                case 0: {
                    return "yellow";
                }
            }
        }
    }
}


function getTextColor(dimensionIndex: number, dim: Dimensions | undefined, portionOrder: number) {
    switch (dim) {
        case Dimensions.Color: {
            if (dimensionIndex === 0) {
                return "white";
            } else {
                return "black";
            }
        }
        case Dimensions.Shape: {
            return portionOrder % 2 ? "black" : "white";
        }
        default: {
            switch (portionOrder % 3) {
                case 1: {
                    return "white";
                }
                default: {
                    return "black";
                }
            }
        }
    }
}


function getSymbol(dimensionIndex: number, dim: Dimensions | undefined, portionOrder: number) {
    switch (dim) {
        case Dimensions.Color: {
            return "";
        }
        case Dimensions.Shape: {
            return <ShapeForm
                shape={nodeConst.nodeDimensions.getShape(dimensionIndex).name}
                color={getTextColor(dimensionIndex, dim, portionOrder)}
                scale={0.95}
            />;
        }
        default: {
            return "";
        }
    }
}