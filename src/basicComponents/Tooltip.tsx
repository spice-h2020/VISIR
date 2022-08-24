/**
 * @fileoverview This file creates a Tooltip fixated in a position. A floating container with some transparency and a button to close it.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React, { useEffect, useRef, useState } from "react";
//Local files
import { Point } from "../controllers/nodeVisuals";
import '../style/Tooltip.css';
import { Button } from "./Button";
import { DataRow } from "./Datatable";

//Interface that contains all the necesary info to show in a tooltip
export interface TooltipInfo {
    tittle: string;
    mainDataRow: DataRow[];
    subDataRow: DataRow[];
}

interface TooltipProps {
    //Active state of the tooltip
    state?: boolean;
    //Content of the tooltip
    content: TooltipInfo | undefined;
    //Coordinates of the tooltip
    position?: Point;
}

/**
 * Tooltip component
 */
export const Tooltip = ({
    state = false,
    content,
    position,
}: TooltipProps) => {

    const [tooltipState, setTooltipState] = useState<boolean>(state);
    const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | undefined>(content);
    const [pos, setPosition] = useState<Point | undefined>(position);

    //In order to center the arrow on the position, the tooltip needs vertical offset based on its own height
    const [yOffset, setYOffset] = useState<number>(0);

    const elementRef = useRef(null);
    const parentRef = useRef(null);

    useEffect(() => {
        setTooltipState(state);
    }, [state]);

    useEffect(() => {
        setPosition(position);
    }, [position]);

    useEffect(() => {
        setTooltipInfo(content);
    }, [content]);

    useEffect(() => {
        //Calculates the offset
        const ref = elementRef as any;
        const pRef = parentRef.current as any;

        if (ref.current !== null) {
            const parentPosition = getHTMLPosition(pRef.parentElement);
            setYOffset(ref.current.clientHeight / 2 + parentPosition.top);
        }
    }, [tooltipInfo]);

    const style = pos !== undefined ? { top: pos.y - yOffset, left: pos.x } : {};

    if (tooltipInfo === undefined) {
        return <div className={`tooltip`}></div>
    } else {
        return (
            <div
                ref={parentRef}
                className={`tooltip ${tooltipState ? "active" : ""}`}
                style={style}
            >
                <div ref={elementRef} className={`tooltip-content right`}>
                    <div className={"tooltip-header row"}>
                        <h3 className="col-10"> {tooltipInfo.tittle} </h3>
                        <Button
                            content=""
                            extraClassName="col-2 btn-close"
                            onClick={() =>{
                                setTooltipState(false);
                            }}
                        />
                    </div>
                    <div className={"tooltip-body"}>
                        {tooltipInfo.mainDataRow.map((item: DataRow, index: number): JSX.Element => {
                            return (
                                <div key={index} className="main-row row">
                                    <strong> <React.Fragment >{item.getKey()}</React.Fragment></strong>
                                    {"\u00a0\u00a0"}
                                    <React.Fragment >{item.getValue(true)}</React.Fragment>
                                </div>
                            );
                        })}
                        {tooltipInfo.subDataRow.map((item: DataRow, index: number): JSX.Element => {
                            return (
                                <div key={index} className="sub-row row">
                                    <React.Fragment >{item.getKey()}</React.Fragment>
                                    {"\u00a0\u00a0"}
                                    <React.Fragment >{item.getValue()}</React.Fragment>
                                </div>
                            );
                        })}
                    </div>
                    <div className="tooltip-arrow"> </div>
                </div >
            </div >
        );
    }
};

/**
 * Gets the position of a HTML element in the DOM
 * @param element element to get the position from
 * @returns returns an object with the format { top: number, left: number, right: number, bottom: number}
 */
export const getHTMLPosition = (element: HTMLDivElement) => {
    const cs = window.getComputedStyle(element);
    const marginTop = cs.getPropertyValue('margin-top');
    const marginLeft = cs.getPropertyValue('margin-left');

    const top = element.offsetTop - parseFloat(marginTop);
    const left = element.offsetLeft - parseFloat(marginLeft);

    return { top: top, left: left, right: left + element.offsetWidth, bottom: top + element.offsetHeight };
}