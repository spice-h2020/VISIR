//TODO WIP component. Will be used to create the legend and to show node/community info on click
import React, { useEffect, useRef, useState } from "react";
import '../style/Tooltip.css';
import { DataRow } from "./Datatable";

export interface TooltipInfo {
    x: number;
    y: number;
    tittle: string;
    mainDataRow: DataRow[];
    subDataRow: DataRow[];
}

interface TooltipProps {
    /**
     * Active state of the tooltip
     */
    state?: boolean;

    /**
     * Content of the tooltip
     */
    content: TooltipInfo;
}

/**
 * Dropdown component
 */
export const Tooltip = ({
    state = false,
    content,
}: TooltipProps) => {

    const [tooltipState, setTooltipState] = useState<boolean>(state);
    const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo>(content);
    const [height, setHeight] = useState<number>(0);

    const elementRef = useRef(null);


    useEffect(() => {
        setTooltipState(state);
    }, [state]);

    useEffect(() => {
        setTooltipInfo(content);
    }, [content]);

    useEffect(() => {
        const ref = elementRef as any;
        setHeight(ref.current.clientHeight);
    }, []);

    return (
        <div
            className={`tooltip ${tooltipState ? "active" : ""}`}
            style={{ top: tooltipInfo.y - height / 2, left: tooltipInfo.x }}
        >
            <div ref={elementRef} className={`tooltip-content right`}>
                <div className={"tooltip-header"}>
                    <h3> {tooltipInfo.tittle} </h3>
                    
                </div>
                <div className={"tooltip-body"}>
                    {tooltipInfo.mainDataRow.map((item: DataRow, index: number): JSX.Element => {
                        return (
                            <div key={index} className="main-row row">
                                <strong> <React.Fragment >{item.key}</React.Fragment></strong> 
                                {"\u00a0\u00a0"}
                                <React.Fragment >{ item.value}</React.Fragment>
                            </div>
                        );
                    })}
                    {tooltipInfo.subDataRow.map((item: DataRow, index: number): JSX.Element => {
                        return (
                            <div key={index} className="sub-row row">
                                <React.Fragment >{item.key}</React.Fragment> 
                                {"\u00a0\u00a0"}
                                <React.Fragment >{item.value}</React.Fragment>
                            </div>
                        );
                    })}
                </div>
                <div className="tooltip-arrow"> </div>
            </div >
        </div >
    );
};

