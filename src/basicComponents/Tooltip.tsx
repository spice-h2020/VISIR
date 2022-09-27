/**
 * @fileoverview This file creates a Tooltip fixated in a position. A floating container with some transparency and a button to close it.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { DataRow, TooltipInfo, Point } from "../constants/auxTypes";
//Packages
import React, { useEffect, useRef, useState } from "react";
//Local files
import { Button } from "./Button";
import '../style/tooltip.css';

interface TooltipProps {
    //All important information about the tooltip
    tooltipInfo: TooltipInfo | undefined;
}

/**
 * Tooltip component
 */
export const Tooltip = ({
    tooltipInfo
}: TooltipProps) => {
    const [isActive, setActive] = useState<Boolean>(false);
    const [yOffset, setYoffset] = useState<number>(0);

    const bodyRef = useRef(null);
    const componentRef = useRef(null);

    useEffect(() => {
        setActive(true);

        //Calculates the vertical offset
        const ref = bodyRef as any;
        const pRef = componentRef.current as any;

        if (ref.current !== null) {
            const parentPosition = getHTMLPosition(pRef.parentElement);
            setYoffset(ref.current.clientHeight / 2 + parentPosition.top);
        }

    }, [tooltipInfo?.position]);

    if (tooltipInfo === undefined || tooltipInfo.position === undefined || !isActive || Object.keys(tooltipInfo).length <= 3) {
        return <div className={`tooltip`}></div>
    }

    const style = { top: tooltipInfo.position.y - yOffset, left: tooltipInfo.position.x };

    return (
        <div
            ref={componentRef}
            className="tooltip active"
            style={style}
        >
            <div ref={bodyRef} className={`tooltip-content right`}>
                <div className={"tooltip-header row"}>
                    <h3 className="col-10"> {tooltipInfo.tittle} </h3>
                    <Button
                        content=""
                        extraClassName="col-2 btn-close"
                        onClick={() => { setActive(false); }}
                    />
                </div>
                <div className={"tooltip-body"}>
                    {tooltipInfo.mainDataRow.map((item: DataRow, index: number): JSX.Element => {
                        return (
                            <div key={index} className="main-row row"
                                dangerouslySetInnerHTML={{ __html: `${item.getKey()} &nbsp; ${item.getValue(true)}` }}
                            >
                            </div>
                        );
                    })}
                    {tooltipInfo.subDataRow.map((item: DataRow, index: number): JSX.Element => {
                        return (
                            <div key={index} className="sub-row row"
                                dangerouslySetInnerHTML={{ __html: `${item.getKey(false)} &nbsp; ${item.getValue()}` }}
                            >
                            </div>
                        );
                    })}
                </div>
                <div className="tooltip-arrow"> </div>
            </div >
        </div >
    );
}


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