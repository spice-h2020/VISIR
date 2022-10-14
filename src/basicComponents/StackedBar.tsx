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
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
            let style: React.CSSProperties = JSON.parse(JSON.stringify(box));
            let content = getContent(pairs[i][1], i, dimension);

            style.width = `${pairs[i][1]}%`;

            switch (i % 3) {
                case 0:
                    style.background = "white";
                    break;
                case 1:
                    style.background = "lightgray";
                    break;
                case 2:
                    style.background = "gray";
                    break;
            }

            bars.push(<div key={i} title={`${pairs[i][0]} ${pairs[i][1]}`} style={style}>{content}</div>)
        }
    }

    return (
        <div className="row bar-stacked">
            <div style={tittleStyle}>{tittle}</div>
            <div style={{ width: "100%" }} className="row">
                {bars}
            </div>
        </div >
    );
};




function getContent(value: string, index: number, dimension?: Dimensions): React.ReactNode {
    let style: React.CSSProperties = JSON.parse(JSON.stringify(rowStyle));
    if (parseFloat(value) < 10.0) {
        style.float = "left";
    }
    value = `${value}%`;

    if (dimension !== undefined) {
        switch (dimension) {
            case Dimensions.Color:
                return (
                    <div className="row" style={style}>
                        {value}
                        <ColorStain
                            color={nodeConst.nodeDimensions.getColor(index)}
                            scale={1.3}
                        />
                    </div>);
            case Dimensions.Shape:
                return (
                    <div className="row" style={style}>
                        {value}
                        <div className={`legend-shape ${nodeConst.nodeDimensions.getShape(index).name}`}></div>
                    </div>);
            case Dimensions.Border:
                return (
                    <div className="row" style={style}>
                        {value}
                        <div className="box" style={{ borderColor: nodeConst.nodeDimensions.getBorder(index), borderWidth: "4px" }}></div>
                    </div>);

        }
    } else {
        return <div className="row" style={style}>{value}</div>;
    }


}