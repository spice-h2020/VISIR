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

    //States to activate/disactivate the tooltip, hold tooltip info and change the tooltip position
    const [tState, setTState] = useState<boolean>(state);
    const [info, setInfo] = useState<TooltipInfo | undefined>(content);
    const [pos, setPos] = useState<Point | undefined>(position);

    //In order to center the arrow on the position, the tooltip needs vertical offset based on its own height
    const [yOffset, setYOffset] = useState<number>(0);

    //Reference of the tooltip body and this component. Used to calculate the vertical offset of the tooltip
    const bodyRef = useRef(null);
    const compRef = useRef(null);

    useEffect(() => {
        setTState(state);
    }, [state]);

    useEffect(() => {
        setPos(position);

    }, [position]);

    useEffect(() => {
        console.log(content);
        setInfo(content);
    }, [content]);

    useEffect(() => {

        //Calculates the vertical offset
        const ref = bodyRef as any;
        const pRef = compRef.current as any;

        if (ref.current !== null) {
            const parentPosition = getHTMLPosition(pRef.parentElement);
            setYOffset(ref.current.clientHeight / 2 + parentPosition.top);
        }

    }, [info]);

    const style = pos !== undefined ? { top: pos.y - yOffset, left: pos.x } : {};
    
    if (info === undefined) {
        return <div className={`tooltip`}></div>
    } else {
        console.log(info.mainDataRow);
        return (
            <div
                ref={compRef}
                className={`tooltip ${tState ? "active" : ""}`}
                style={style}
            >
                <div ref={bodyRef} className={`tooltip-content right`}>
                    <div className={"tooltip-header row"}>
                        <h3 className="col-10"> {info.tittle} </h3>
                        <Button
                            content=""
                            extraClassName="col-2 btn-close"
                            onClick={() => {
                                setTState(false);
                            }}
                        />
                    </div>
                    <div className={"tooltip-body"}>
                        {info.mainDataRow.map((item: DataRow, index: number): JSX.Element => {
                            return (
                                <div key={index} className="main-row row"
                                    dangerouslySetInnerHTML={{ __html: `${item.getKey()} &nbsp; ${item.getValue(true)}` }}
                                >
                                </div>
                            );
                        })}
                        {info.subDataRow.map((item: DataRow, index: number): JSX.Element => {
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