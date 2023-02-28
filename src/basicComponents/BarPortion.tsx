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
import { IStringNumberRelation } from "../constants/perspectivesTypes";

interface StackedBarProps {
    data: IStringNumberRelation;
    /**
     * Dimensions represented in the portion.
     */
    dim: Dimensions | undefined
    /**
     * In case there is a dimension, the index of this data in the dimension map. Used to know what's the color/shape 
     */
    dimensionIndex: number,
    /**
     * The order of this portion in the whole barGraph
     */
    portionOrder: number,

}

/**
 * UI component that creates a portion of a stacked bar graph.
 */
export const BarPortion = ({
    data,
    dim,
    dimensionIndex,
    portionOrder
}: StackedBarProps) => {

    const [text, setText] = useState<string>(`${data.count}%`);
    const [isSymbolActive, setSymbolActive] = useState<boolean>(true);

    const htmlRef = useRef(null);


    useEffect(() => {
        clampTextInsidePortion(htmlRef, setText, setSymbolActive, data.count);
    }, [htmlRef, data, data.count]);

    let style: React.CSSProperties = {
        width: `${data.count}%`,
        background: getBackgroundColor(dimensionIndex, dim, portionOrder),
        color: getTextColor(dimensionIndex, dim, portionOrder),
    }

    const hoverTitle = `${data.value} ${data.count}%`;

    return (
        <span ref={htmlRef} title={hoverTitle} className="bar-portion" style={style}>
            <div className="row" style={{ alignItems: "center", fontWeight: "bold" }}>
                {text}
                <span style={{ width: "3px" }} />
                {isSymbolActive === true ? getSymbol(dimensionIndex, dim, portionOrder) : ""}
            </div>
        </span>);
};

function clampTextInsidePortion(htmlRef: React.MutableRefObject<null>, setText: React.Dispatch<React.SetStateAction<string>>,
    setSymbolActive: React.Dispatch<React.SetStateAction<boolean>>, count: number) {

    if (htmlRef !== null && htmlRef.current !== null) {
        const width = (htmlRef.current as HTMLElement).clientWidth;

        if (width <= 14.0) {
            setText("");
            setSymbolActive(false);
        } else if (width <= 38) {
            setText((count.toFixed(0)).toString());
            setSymbolActive(false);
        } else {
            setText(`${count}%`);
            setSymbolActive(true);
        }
    }
}

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
                case 1:
                case 2: {
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