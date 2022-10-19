/**
 * @fileoverview This file creates an horizontal stacked bar graphic. 
 * Each bar portion shows the width % of the portion, hovering will also explain what value is being visualized there.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";
//Local files
import { BarPortion } from "./BarPortion";

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

interface StackedBarGraphProps {
    /**
     * Tittle of the graph
     */
    tittle: string,
    /**
     * pairs (string, number) that will be represented in the stacked bar.
     */
    pairs: any[],
}

/**
 * UI component that shows data in a stackedbar format
 */
export const StackedBarGraph = ({
    tittle,
    pairs,
}: StackedBarGraphProps) => {

    const bars = new Array<React.ReactNode>();

    if (pairs !== undefined) {
        for (let i = 0; i < pairs.length; i++) {
            bars.push(
                <BarPortion
                    key={i}
                    value={pairs[i][1]}
                    hoverText={pairs[i][0]}
                    index={i}
                />
            );
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

