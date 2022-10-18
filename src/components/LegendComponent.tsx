/**
 * @fileoverview This file creates a button that show/hides the legend of the app.
 * The legend allows the user to understand the relations between the node's dimensions and the value of its explicit communities.
 * The user can also toggle any Legend value to hide all node's with that value.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { DimAttribute, Dimensions, nodeConst } from '../constants/nodes';
import { ButtonState } from '../constants/viewOptions';
//Packages
import React from "react";
//Local files
import { Dropdown } from '../basicComponents/Dropdown';
import { Button } from '../basicComponents/Button';
import { ColorStain } from '../basicComponents/ColorStain';

const columnTittle: React.CSSProperties = {
    whiteSpace: "nowrap",
    margin: "5px 10px",
    paddingBottom: "5px",
    borderBottom: "black 1px inset",
    overflow: "hidden",
    textOverflow: "ellipsis"
}

const buttonContentRow: React.CSSProperties = {
    alignItems: "self-end",
}

const columnStyle: React.CSSProperties = {
    borderRight: "1px solid black",
    width: "15vw",
    textAlign: "center",
}

interface LegendTooltipProps {
    /**
     * Data source to create the legend content
     */
    legendData: DimAttribute[];
    /**
     * Configuration of the legend with the explicit communities that should be hidden/shown
     */
    legendConf: Map<string, boolean>;
    /**
     * Function to change the legend configuration that changes how nodes will be seen
     */
    onLegendClick: Function;
}

/**
 * Legend component
 */
export const LegendComponent = ({
    legendData,
    legendConf,
    onLegendClick,
}: LegendTooltipProps) => {

    if (legendData !== undefined && legendData.length > 0) {

        const legendRows: React.ReactNode[] = getLegendButtons(legendData, legendConf, onLegendClick);

        return (
            <div className="legend-container">
                <Dropdown
                    items={[<div className='row' style={{ direction: "ltr" }} key={-2}>{legendRows}</div>]}
                    content="Legend"
                    extraClassButton="plus primary"
                    closeWhenOutsideClick={false}
                />
            </div>
        );

    } else {
        return (<Dropdown
            items={[]}
            content="Unactive Legend"
            extraClassButton="plus primary"
            closeWhenOutsideClick={false}
        />)

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
                        extraClassName={"btn-legend btn-dropdown"}
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
                <div className='col' style={getLegendColumnStyle(i === legendData.length)}
                    key={i}>
                    <h3 style={columnTittle} title={legendData[i].key}>{legendData[i].key} </h3>
                    {buttonsColumn}
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
                <div className="row" style={buttonContentRow} key={index}>
                    <div className="col-9" style={{ alignSelf: "center" }}> {value} </div>
                    <ColorStain
                        color={nodeConst.nodeDimensions.getColor(index)}
                        scale={1.3}
                    />
                </div>
            );

        case Dimensions.Shape:
            return (
                <div className="row" style={buttonContentRow} key={index}>
                    <div className="col-9"> {value} </div>
                    <div className={`legend-shape ${nodeConst.nodeDimensions.getShape(index).name}`}></div>
                </div>
            );
        case Dimensions.Border:
            return (
                <div className="row" style={buttonContentRow} key={index}>
                    <div className="col-9"> {value} </div>
                    <div className="col-3 box" style={{ borderColor: nodeConst.nodeDimensions.getBorder(index), borderWidth: "4px" }}></div>
                </div>
            );
        default:
            return <div> ERROR WHILE CREATING THIS ROW CONTENT</div>
    }
}

function getLegendColumnStyle(isLast: boolean): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(columnStyle)));

    if (isLast) {
        newStyle.borderRight = "none";
    }

    return newStyle;
}