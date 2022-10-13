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
    paddingRight: "1em",
    float: "left",
    alignSelf: "center",
}

const box: React.CSSProperties = {
    padding: "0.5em 0px",
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    alignSelf: "center",
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

            style.width = pairs[i][1];
            switch (i) {
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

            bars.push(<div key={i} title={pairs[i][0]} style={style}>{content}</div>)
        }
    }

    return (
        <div className="row bar-stacked">
            <div style={tittleStyle}>{tittle}</div>
            {bars}
        </div>
    );
};




function getContent(value: string, index: number, dimension?: Dimensions): React.ReactNode {
    if (dimension !== undefined) {
        switch (dimension) {
            case Dimensions.Color:
                return (
                    <div>
                        {value}
                        <ColorStain
                            color={nodeConst.nodeDimensions.getColor(index)}
                            scale={1.3}
                        />
                    </div>);
            case Dimensions.Shape:
                return (
                    <div>
                        {value}
                        <div className={`legend-shape ${nodeConst.nodeDimensions.getShape(index).name}`}></div>
                    </div>);
            case Dimensions.Border:
                return (
                    <div>
                        {value}
                        <div className="box" style={{ borderColor: nodeConst.nodeDimensions.getBorder(index), borderWidth: "4px" }}></div>
                    </div>);

        }
    } else {
        return <div>{value}</div>;
    }


}