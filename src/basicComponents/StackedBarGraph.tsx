/**
 * @fileoverview This file creates an horizontal bar graph. 
 * Each bar section shows the width % of the portion, hovering will also explain what value is being visualized there.
 * The color and icons of each section depends on the dimension of the represented data
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions } from "../constants/nodes";
import { IStringNumberRelation } from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { BarSection } from "./BarSection";

interface StackedBarGraphProps {
    /**
     * Key/tittle of the data represented in the graph.
     */
    tittle: string,
    /**
     * Dimension of the data represented in the graph.
     */
    dim: Dimensions | undefined,
    /**
     * pairs (string, number) that will be represented in the stacked bar. Props must include the index of the dimension
     * for graphs of attributes that have a dimension.
     */
    data: IStringNumberRelation[],

}

/**
 * UI component that shows data in a horizontal bar graph.
 */
export const StackedBarGraph = ({
    tittle,
    dim,
    data,
}: StackedBarGraphProps) => {

    const bars = new Array<React.ReactNode>();

    //Hack to represent values whose all value is 0, balancing all its values.
    if (isAllZero(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i].count = Number((1 / data.length * 100).toFixed(2));
        }
    }

    for (let i = 0; i < data.length; i++) {

        bars.push(
            <BarSection
                key={i}
                data={data[i]}
                dim={dim}
                dimensionIndex={dim !== undefined ? data[i].props : 0}
                portionOrder={i}
            />
        );
    }


    return (
        <div>
            <div className="stacked-bar-tittle">{tittle}</div>
            <div className="stacked-bar-container row">
                {bars}
            </div>
        </div>);
};


function isAllZero(data: IStringNumberRelation[]) {
    let isAllZero = true;

    for (let i = 0; i < data.length; i++) {
        if (data[i].count !== 0) {
            return false;
        }
    }

    return isAllZero;
}