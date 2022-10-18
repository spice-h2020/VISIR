/**
 * @fileoverview This file creates an horizontal stacked bar graphic. 
 * Each bar portion shows the width % of the portion, hovering will also explain what value is being visualized there.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, nodeConst } from "../constants/nodes";
//Packages
import React from "react";
//Local files
import { ColorStain } from "./ColorStain";

const stackedBarTittle: React.CSSProperties = {
    padding: "0em 0.5em",
    float: "left",
    margin: "auto 0px",
}

const barContainer: React.CSSProperties = {
    width: "100%",
    height: "30px",
    color: "black",
}

const barPortionContent: React.CSSProperties = {
    alignItems: "center",
    height: "100%",
    cursor: "default",
}

const barPortion: React.CSSProperties = {
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
    /**
     * Tittle of the graph
     */
    tittle: string,
    /**
     * pairs (string, number) that will be represented in the stacked bar.
     */
    pairs: any[],
    /**
     * Optional parameter. Dimension related to this value. Adds the legend icons to the stacked bar
     */
    dimension?: Dimensions,
}

/**
 * UI component that shows data in a stackedbar format
 */
export const StackedBar = ({
    tittle,
    pairs,
    dimension,

}: StackedBarProps) => {

    const bars = new Array<React.ReactNode>();

    if (pairs !== undefined) {
        for (let i = 0; i < pairs.length; i++) {
            let style: React.CSSProperties = JSON.parse(JSON.stringify(barPortion));
            let content = getBarPortionContent(pairs[i][1], i, dimension);

            if(i === 0){
                style.borderLeft = "1px solid black";
            }else if (i === pairs.length - 1){
                style.borderRight = "1px solid black";
            }

            style.width = `${pairs[i][1]}%`;

            if (pairs[i][1] < 25)
                style.justifyContent = "left";

            if(i%2){
                style.background = "var(--secondaryButtonColor)";
            }else{
                style.background = "var(--bodyBackground)";
            }
            
            const hoverText = `${pairs[i][0] === "" ? "(empty)" : pairs[i][0]} ${pairs[i][1]}%`;

            bars.push(
            <span key={i} title={hoverText} style={style}>
                {content}
            </span>);
        }
    }

    return (
        <div>
            <div style={stackedBarTittle}>{tittle}</div>

            <div style={barContainer} className="row">
                {bars}
            </div>

        </div>);
};




function getBarPortionContent(value: string, index: number, dimension?: Dimensions): React.ReactNode {
    let style: React.CSSProperties = JSON.parse(JSON.stringify(barPortionContent));

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