/**
 * @fileoverview This file creates an horizontal stacked bar graphic. 
 * Each bar portion shows the width % of the portion, hovering will also explain what value is being visualized there.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";
import { IExplicitCommData } from "../constants/perspectivesTypes";
//Local files
import { BarPortion } from "./BarPortion";

const stackedBarTittle: React.CSSProperties = {
    padding: "0em 0.5em",
    float: "left",
    margin: "3px 0px",
}

const barContainer: React.CSSProperties = {
    width: "100%",
    height: "30px",
    color: "black",
}

interface StackedBarGraphProps {
    /**
     * Tittle of the graph.
     */
    tittle: string,
    /**
     * pairs (string, number) that will be represented in the stacked bar.
     */
    commData: IExplicitCommData,
}

/**
 * UI component that shows data in a horizontal stackedbar.
 */
export const StackedBarGraph = ({
    tittle,
    commData,
}: StackedBarGraphProps) => {

    const bars = new Array<React.ReactNode>();
    const dim = commData.dimension;

    if (commData !== undefined && commData.array !== undefined) {
        for (let i = 0; i < commData.array.length; i++) {
            bars.push(
                <BarPortion
                    key={i}
                    hoverText={commData.array[i][0]}
                    percentile={commData.array[i][1]}
                    index={i}
                    dim={dim}
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

