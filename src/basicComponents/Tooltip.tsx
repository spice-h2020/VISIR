/**
 * @fileoverview This file creates a Tooltip fixated in a position. A floating container with some transparency and a button to close it.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { DataRow, TooltipInfo, SelectedObject, parseSelectedObjectIntoRows } from "../constants/auxTypes";
//Packages
import { useEffect, useRef, useState } from "react";
//Local files
import { Button } from "./Button";
import '../style/tooltip.css';


interface TooltipProps {
    //All important information about the tooltip
    selectedObject: SelectedObject | undefined;
    //If the tooltip should hide users' labels and ids when shown 
    hideLabels: boolean;
}

/**
 * Tooltip component
 */
export const Tooltip = ({
    selectedObject,
    hideLabels,
}: TooltipProps) => {

    const [isActive, setActive] = useState<Boolean>(false);
    const [yOffset, setYoffset] = useState<number>(0);

    const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo>();

    const bodyRef = useRef(null);
    const componentRef = useRef(null);

    //Calculates the vertical offset based on the height of the tooltip to center it around the focused object
    useEffect(() => {
        //Calculates the vertical offset
        const ref = bodyRef as any;
        const pRef = componentRef.current as any;

        if (ref.current !== null) {
            const parentPosition = getHTMLPosition(pRef.parentElement);
            setYoffset(ref.current.clientHeight / 2 + parentPosition.top);
        }

    }, [selectedObject?.position]);

    //Update the data of the tooltip
    useEffect(() => {
        setActive(true);
        
        const result = parseSelectedObjectIntoRows(selectedObject?.obj, hideLabels);
        if (result === undefined)
            setTooltipInfo(undefined);
        else {
            setTooltipInfo({ tittle: result.tittle, mainDataRow: result.main, subDataRow: result.sub });
        }

    }, [selectedObject?.obj, hideLabels])

    if (tooltipInfo !== undefined && selectedObject !== undefined && selectedObject.position !== undefined && isActive) {

        const style = { top: selectedObject.position.y - yOffset, left: selectedObject.position.x };
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

    } else
        return <div className={`tooltip`}></div>

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