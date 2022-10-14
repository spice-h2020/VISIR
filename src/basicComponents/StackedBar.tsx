/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "../constants/viewOptions";
//Packages
import React, { useEffect, useState } from "react";
import { Dimensions, nodeConst } from "../constants/nodes";
import { ColorStain } from "./ColorStain";

const tittleStyle: React.CSSProperties = {
    padding: "0em 0.5em",
    float: "left",
    margin: "auto 0px",
}

const box: React.CSSProperties = {
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    alignSelf: "center",
    height: "100%",
}

const rowStyle: React.CSSProperties = {
    alignItems: "center",
    height: "100%",
    cursor: "default",
}

const stackedGraph: React.CSSProperties = {
    width: "100%",
    height: "30px",
    color: "black",
}

const barStyle: React.CSSProperties = {
    display: "flex",
    height: "100%",

    float: "left",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
    whiteSpace: "nowrap",

    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    boxSizing: "border-box",

    cursor: "default",

}

interface StackedBarProps {
    tittle: string,
    pairs: any[],
    dimension?: Dimensions,
    commIndex?: number,
}


/**
 * Basic UI component that execute a function when clicked
 */
export const StackedBar = ({
    tittle,
    pairs,
    dimension,

}: StackedBarProps) => {

    const bars = new Array<React.ReactNode>();

    if (pairs !== undefined) {
        for (let i = 0; i < pairs.length; i++) {
            let style: React.CSSProperties = JSON.parse(JSON.stringify(barStyle));
            let content = getContent(pairs[i][1], i, dimension);

            style.width = `${pairs[i][1]}%`;

            if (pairs[i][1] < 25)
                style.justifyContent = "left";

            switch (i % 3) {
                case 0:
                    style.background = "cyan";
                    break;
                case 1:
                    style.background = "orange";
                    break;
                case 2:
                    style.background = "pink";
                    break;
            }
            const hoverText = `${pairs[i][0] === "" ? "(empty)" : pairs[i][0]} ${pairs[i][1]}%`;

            bars.push(<span key={i} title={hoverText} style={style}>

                {content}

            </span>)
        }
    }

    return (
        <div>
            <div style={tittleStyle}>{tittle}</div>

            <div style={stackedGraph} className="row">
                {bars}
            </div>

        </div>);
};




function getContent(value: string, index: number, dimension?: Dimensions): React.ReactNode {
    let style: React.CSSProperties = JSON.parse(JSON.stringify(rowStyle));

    value = `${value}%`;

    if (dimension !== undefined) {
        switch (dimension) {
            case Dimensions.Color:
                return (
                    <div className="row" style={style}>
                        {value}
                        <div style={{ marginLeft: "5px" }}>
                            <ColorStain
                                color={nodeConst.nodeDimensions.getColor(index)}
                                scale={1.3}
                            />
                        </div>
                    </div>);
            case Dimensions.Shape:
                return (
                    <div className="row" style={style}>
                        {value}
                        <div className={`legend-shape ${nodeConst.nodeDimensions.getShape(index).name}`}
                            style={{ marginLeft: "5px" }} />
                    </div>);
            case Dimensions.Border:
                return (
                    <div className="row" style={style}>
                        {value}
                        <div className="box" style={{ borderColor: nodeConst.nodeDimensions.getBorder(index), borderWidth: "4px", marginLeft: "5px" }} />
                    </div>);

        }
    } else {
        return <div className="row" style={style}>{value}</div>;
    }


}