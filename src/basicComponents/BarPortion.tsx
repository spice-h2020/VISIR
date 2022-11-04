/**
 * @fileoverview This file creates a portion of an horizontal stacked bar graphic. 
 * If the bar is too thin, the shown text will be hidden.
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
     * Tittle/value of the graph
     */
    percentile: number,
    /**
     * Text to show when hovering a bar portion
     */
    hoverText: string,
    /**
     * Index of this bar portion in a stacked bar
     */
    index: number,
    /**
     * Dimensions represented in the portion
     */
    dim: Dimensions | undefined
}

/**
 * UI component that shows data in a stackedbar format
 */
export const BarPortion = ({
    percentile: value,
    hoverText,
    index,
    dim,
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
            } else if (width <= 29) {
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
    style.background = getBackgroundColor(index, dim);
    style.color = getTextColor(index, dim);

    hoverText = `${hoverText === "" ? "(empty)" : hoverText} ${value}%`;

    return (
        <span ref={htmlRef} title={hoverText} className="bar-portion" style={style}>
            <div className="row" style={{ alignItems: "center" }}>
                {text}
                <span style={{ width: "3px" }} />
                {symbolActive === true ? getSymbol(index, dim) : ""}
            </div>
        </span>);
};

function getBackgroundColor(index: number, dim: Dimensions | undefined) {
    switch (dim) {
        case Dimensions.Color: {
            return nodeConst.nodeDimensions.getColor(index);
        }
        case Dimensions.Shape: {
            return index % 2 ? "white" : "black";
        }
        default: {
            switch (index % 3) {
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


function getTextColor(index: number, dim: Dimensions | undefined) {
    switch (dim) {
        case Dimensions.Color: {
            if (index === 0) {
                return "white";
            } else {
                return "black";
            }
        }
        case Dimensions.Shape: {
            return index % 2 ? "black" : "white";
        }
        default: {
            switch (index % 3) {
                case 1: {
                    return "white";
                }
                default:{
                    return "black";
                }
            }
        }
    }
}

function getSymbol(index: number, dim: Dimensions | undefined) {
    switch (dim) {
        case Dimensions.Color: {
            return "";
        }
        case Dimensions.Shape: {
            return <ShapeForm
                shape={nodeConst.nodeDimensions.getShape(index).name}
                color={getTextColor(index, dim)}
                scale={0.95}
            />;
        }
        default: {
            return "";
        }
    }
}