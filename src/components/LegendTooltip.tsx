/**
 * @fileoverview This file creates a button that show/hides a dropdown with the legend of the active networks.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { DimAttribute, Dimensions, nodeConst } from '../constants/nodes';
//Packages
import React, { useEffect, useState } from "react";
//Local files
import { Dropdown } from '../basicComponents/Dropdown';
import { Button } from '../basicComponents/Button';
import '../style/legend.css';
import { ButtonState } from '../constants/viewOptions';

interface LegendTooltipProps {
    //Content of the legend
    legendData: DimAttribute[]
    //Current legend configuration
    legendConf: Map<string, boolean>
    //Function to change the legend configuration that will change how nodes will be seen
    onLegendClick: Function
}

/**
 * Legend component
 */
export const LegendTooltip = ({
    legendData,
    legendConf,
    onLegendClick,
}: LegendTooltipProps) => {

    if (legendData === undefined) {
        return (<Dropdown
            items={[]}
            content="Unactive Legend"
            extraClassName="dropdown-dark legend-dropdown"
            closeWhenOutsideClick={false}
        />)

    } else {

        const legendRows: React.ReactNode[] = getLegendButtons(legendData, legendConf, onLegendClick);

        return (
            <Dropdown
                items={[<div className='row' key={-2}>{legendRows}</div>]}
                content="Legend"
                extraClassName="dropdown-dark legend-dropdown"
                closeWhenOutsideClick={false}
            />
        );
    }
};

/**
 * Get all the buttons that creates the legend tooltip
 * @param legendData Data that creates the legend
 * @param legendConf Configuration of what is active/inactive in the legend
 * @param onClick Function executed when a legend row is clicked
 * @returns all the column buttons
 */
function getLegendButtons(legendData: DimAttribute[], legendConf: Map<string, boolean>,
    onClick: Function): React.ReactNode[] {

    const rows = new Array<React.ReactNode>();

    for (let i = 0; i < legendData.length; i++) {
        if (legendData[i].active) {
            const buttonsColumn = new Array<React.ReactNode>();

            for (let j = 0; j < legendData[i].values.length; j++) {
                const value = legendData[i].values[j];

                buttonsColumn.push(
                    <Button
                        key={i * 10 + j}
                        content={getButtonContent(value, legendData[i].dimension, j)}
                        state={legendConf.get(value) ? ButtonState.active : ButtonState.unactive}

                        onClick={() => {
                            legendConf.set(value, !legendConf.get(value));
                            
                            const newMap = new Map(JSON.parse(
                                JSON.stringify(Array.from(legendConf))
                            ));

                            onClick(newMap);
                        }} />
                );
            }

            const colum =
                <div className='col' key={i}>
                    <h3>{legendData[i].key} </h3>
                    <div className="legend-content">
                        {buttonsColumn}
                    </div>
                </div>;

            rows.push(colum);
        }
    }

    return rows;
}

/**
 * Returns the content of a legend button based on data from a community and its related values and dimensions
 * @param value value of the attribute of this row
 * @param dim dimension of the attribute of this row
 * @param index index of the community
 * @returns a react component
 */
const getButtonContent = (value: string, dim: Dimensions, index: number): React.ReactNode => {
    switch (dim) {
        case Dimensions.Color:
            return (
                <div className="legend-row row" key={index}>
                    <div className="col-9"> {value} </div>
                    <div className="col-3 box" style={{ backgroundColor: nodeConst.nodeDimensions.getColor(index) }}></div>
                </div>
            );

        case Dimensions.Shape:
            return (
                <div className="legend-row row" key={index}>
                    <div className="col-9"> {value} </div>
                    <div className={`col-3 legend-shape ${nodeConst.nodeDimensions.getShape(index).name}`}></div>
                </div>
            );
        case Dimensions.Border:
            return (
                <div className="legend-row row" key={index}>
                    <div className="col-9"> {value} </div>
                    <div className="col-3 box" style={{ borderColor: nodeConst.nodeDimensions.getBorder(index), borderWidth: "4px" }}></div>
                </div>
            );
        default:
            return <div> ERROR WHILE CREATING THIS ROW CONTENT</div>
    }
}


