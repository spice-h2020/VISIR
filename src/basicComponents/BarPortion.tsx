/**
 * @fileoverview This file creates a portion of an horizontal stacked bar graphic. 
 * If the bar is too thin, the shown text will be hidden.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { nodeConst } from "../constants/nodes";
//Packages
import React, { useEffect, useRef, useState } from "react";

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
     * Tittle of the graph
     */
    value: number,
    /**
     * Pairs (string, number) that will be represented in the stacked bar.
     */
    hoverText: string,
    /**
     * Index of this bar portion in a stacked bar
     */
    index: number,
}

/**
 * UI component that shows data in a stackedbar format
 */
export const BarPortion = ({
    value,
    hoverText,
    index,
}: StackedBarProps) => {

    const [text, setText] = useState<string>(`${value}%`);

    const htmlRef = useRef(null);

    //Remove the inner text if the width of the portion is too small
    useEffect(() => {
        if (htmlRef !== null && htmlRef.current !== null) {
            const width = (htmlRef.current as HTMLElement).clientWidth;

            if (width <= 14.0) {
                setText("");
            } else if (width <= 29) {
                setText((value.toFixed(0)).toString());
            }
        }

    }, [htmlRef, value]);

    let style: React.CSSProperties = JSON.parse(JSON.stringify(barPortion));

    style.width = `${value}%`;
    style.background = nodeConst.nodeDimensions.getColor(index);

    hoverText = `${hoverText === "" ? "(empty)" : hoverText} ${value}%`;

    return (
        <span ref={htmlRef} title={hoverText} className="bar-portion" style={style}>
            {text}
        </span>);
};