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
    //Activates / disable the legend
    state: boolean
    //Function to change the legend configuration that will change how nodes will be seen
    updateLegendConfig: Function
}

let counter = 0;
/**
 * Legend component
 */
export const LegendTooltip = ({
    legendData,
    state,
    updateLegendConfig,
}: LegendTooltipProps) => {

    //activates/disactivates the button that shows the legend
    const [isActive, setIsActive] = useState<boolean>(false);
    //Data that will be seen in the legend
    const [data, setData] = useState<DimAttribute[]>(legendData);
    //Configuration that tells the component what option is selected and what not
    const [legendConfig, setLegendConfig] = useState(new Map<string, boolean>());

    useEffect(() => {
        setIsActive(state);

        if (state === false) {
            setData([]);
            setLegendConfig(new Map<string, boolean>())
        }
    }, [state]);

    //When legendData changes
    useEffect(() => {
        counter = counter + 1;
        if (!isActive) {
            setIsActive(state);
        }

        setData(legendData);

        const newMap = new Map<string, boolean>();
        for (let i = 0; i < legendData.length; i++) {
            for (let j = 0; j < legendData[i].values.length; j++) {
                newMap.set(legendData[i].values[j], true);
            }
        }

        setLegendConfig(newMap);

    }, [legendData]);

    useEffect(() => {
        updateLegendConfig(legendConfig)
    }, [legendConfig]);

    const buttonClick = (value: string) => {
        setLegendConfig(new Map(legendConfig.set(value, !legendConfig.get(value))));
    }

    const legendRows: React.ReactNode[] = getLegendRows(buttonClick, data);

    if (legendRows.length > 0) {
        return (
            <Dropdown
                items={[<div className='row'>{legendRows}</div>]}
                content="Legend"
                extraClassName="dropdown-dark legend-dropdown"
                closeWhenOutsideClick={false}
            />
        );
    } else {
        return (
            <Dropdown
                items={[]}
                content="Unactive Legend"
                extraClassName="dropdown-dark legend-dropdown"
                closeWhenOutsideClick={false}
            />
        );
    }
};

/**
 * Returns the reactComponents of each row of the legend
 * @param buttonClick On click function for the buttons
 * @param data Content of the buttons
 * @returns returns an array of React components
 */
function getLegendRows(buttonClick: Function, data: DimAttribute[]): React.ReactNode[] {
    const rows = new Array<React.ReactNode>();

    if (data === undefined)
        return rows;

    for (let i = 0; i < data.length; i++) {
        if (data[i].active) {
            const buttons = new Array<React.ReactNode>();
            for (let j = 0; j < data[i].values.length; j++) {
                buttons.push(
                    <Button
                        key={counter * 100 + j}
                        content={getButtonContent(data[i].values[j], data[i].dimension, j)}
                        state={ButtonState.inactive}
                        autoToggle={true}
                        onClick={() => {
                            buttonClick(data[i].values[j]);
                        }} />
                );
            }
            const colum = <div className='col' key={i}>
                <h3>{data[i].key} </h3>
                <div className="legend-content">
                    {buttons}
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
