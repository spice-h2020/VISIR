/**
 * @fileoverview This file creates a button that show/hides a tooltip with the legend of the active networks.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { DimAttribute, Dimensions, nodeConst } from '../namespaces/nodes';
//Packages
import React, { useEffect, useState } from "react";
//Local files
import '../style/Legend.css';
import { Dropdown } from '../basicComponents/Dropdown';
import { Button } from '../basicComponents/Button';

interface LegendTooltipProps {
    //Content of the legend
    legendData: DimAttribute[]
    //Activates / disable the legend
    state: boolean
    //Function to change the legend configuration that will change how nodes will be seen
    updateLegendConfig: Function
}

/**
 * Basic UI component that execute a function when clicked
 */
export const LegendTooltip = ({
    legendData,
    state,
    updateLegendConfig,
}: LegendTooltipProps) => {

    const [isActive, setIsActive] = useState<boolean>(false);
    const [data, setData] = useState<DimAttribute[]>(legendData);
    const [legendConfig, setLegendConfig] = useState(new Map<string, boolean>());

    useEffect(() => {
        setIsActive(state);

        if (state === false) {
            setData([]);
            setLegendConfig(new Map<string, boolean>())
        }
    }, [state]);

    useEffect(() => {
        if (!isActive) {
            setIsActive(state);
            setData(legendData);

            const newMap = new Map<string, boolean>();
            for (let i = 0; i < legendData.length; i++) {
                for (let j = 0; j < legendData[i].values.length; j++) {
                    newMap.set(legendData[i].values[j], true);
                }
            }
            
            setLegendConfig(newMap);
        }
    }, [legendData]);

    const buttonClick = (value: string) => {
        setLegendConfig(new Map(legendConfig.set(value, !legendConfig.get(value))));
    }

    useEffect(() => {
        updateLegendConfig(legendConfig)
    }, [legendConfig]);




    const testButtons = new Array<React.ReactNode>();

    for (let i = 0; i < data.length; i++) {

        const buttons = new Array<React.ReactNode>();
        for (let j = 0; j < data[i].values.length; j++) {
            buttons.push(
                <Button key={j}
                    content={getButtonContent(data[i].values[j], data[i].dimension, j)}
                    autoToggle={true}
                    onClick={() => {
                        buttonClick(data[i].values[j])
                    }}
                />
            )
        }
        const colum =
            <div className='col' key={i}>
                <h3>{data[i].key} </h3>
                <div className="legend-content">
                    {buttons}
                </div>
            </div>

        testButtons.push(colum);
    }

    if (testButtons.length > 0) {
        return (
            <Dropdown
                items={[<div className='row'>{testButtons}</div>]}
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