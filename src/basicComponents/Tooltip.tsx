/**
 * @fileoverview This file creates a Tooltip positioned close to an object. 
 * A floating container with some transparency and a button to close it. 
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ISelectedObject } from "../constants/auxTypes";
import { ICommunityData, IUserData } from "../constants/perspectivesTypes";
//Packages
import React, { useEffect, useRef, useState } from "react";
//Local files
import { Button } from "./Button";

const tooltipContainer: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    height: "0%",
    borderBottom: "1px dotted black"
}

const tooltipContent: React.CSSProperties = {
    position: "absolute",
    zIndex: "1",
    minWidth: "12rem",
    maxWidth: "14rem",
    opacity: "90%",
}

const tooltipHeader: React.CSSProperties = {
    paddingLeft: "1rem",
    marginBottom: "0",
    borderRadius: "6px 6px 0px 0px",
    backgroundColor: "var(--headerBackground)",
    border: "2px solid var(--grayLineColor)",

    display: "flex",
    justifyContent: "space-between",
}

const tooltipTittleStyle: React.CSSProperties = {
    padding: "0px",
    margin: "0px",
    fontSize: "1rem",
    alignSelf: "center",
    whiteSpace: "nowrap"
}

const tooltipBodyStyle: React.CSSProperties = {
    backgroundColor: "var(--textAreaBackground)",
    border: "2px solid var(--grayLineColor)",
    borderTop: "none",
    padding: "1rem 1rem",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
}

const tooltipArrow: React.CSSProperties = {
    position: "absolute",
    borderWidth: "0.5rem",
    borderStyle: "solid",
    top: "50%",
    right: "100%",
    marginTop: "-0.5rem",
    borderColor: "transparent black transparent transparent",
}

interface TooltipProps {
    /**
     *  All important information about the tooltip.
     */
    selectedObject: ISelectedObject | undefined;
    /**
     * If the tooltip should hide users' labels and ids when shown.
     */
    hideLabels: boolean;
}

/**
 * UI component that creates a tooltip based on the selectedObject position.
 */
export const Tooltip = ({
    selectedObject,
    hideLabels,
}: TooltipProps) => {
    const [isActive, setActive] = useState<Boolean>(false);
    const [yOffset, setYoffset] = useState<number>(0);

    const [selectObject, setSelecObject] = useState<ICommunityData | IUserData | undefined>();

    const bodyRef = useRef(null);
    const componentRef = useRef(null);

    //Calculates the vertical offset based on the height of the tooltip, to center it around the focused object.
    useEffect(() => {
        const ref = bodyRef as any;
        const pRef = componentRef.current as any;

        if (ref.current !== null) {
            const parentPosition = getHTMLPosition(pRef.parentElement);
            setYoffset(ref.current.clientHeight / 2 + parentPosition.top);
        }

    }, [selectedObject?.position]);


    useEffect(() => {
        setActive(true);
        setSelecObject(selectedObject?.obj);

    }, [selectedObject?.obj, hideLabels])

    const tooltipTittle: React.ReactNode = getTooltipTittle(selectObject);
    const tooltipBody: React.ReactNode[] = getTooltipBody(selectObject, hideLabels);

    if (selectedObject !== undefined && selectedObject.obj !== undefined && selectedObject.position !== undefined && isActive) {
        const style: React.CSSProperties = JSON.parse(JSON.stringify(tooltipContainer));
        style.top = selectedObject.position.y - yOffset;
        style.left = selectedObject.position.x;

        return (
            <div
                ref={componentRef}
                style={style}
            >
                <div ref={bodyRef} style={tooltipContent}>
                    <div className="row" style={tooltipHeader}>
                        <h3 style={tooltipTittleStyle}> {tooltipTittle} </h3>
                        <Button
                            content=""
                            extraClassName="btn-close transparent"
                            onClick={() => { setActive(false); }}
                        />
                    </div>
                    <div style={tooltipBodyStyle}>
                        {tooltipBody}
                    </div>
                    <div style={tooltipArrow} />
                </div >
            </div >
        );

    } else
        return <React.Fragment />;

}


/**
 * Gets the position of a HTML element in the DOM.
 * @param element element to get the position from.
 * @returns returns an object with the format { top: number, left: number, right: number, bottom: number}.
 */
export const getHTMLPosition = (element: HTMLDivElement) => {
    const cs = window.getComputedStyle(element);
    const marginTop = cs.getPropertyValue('margin-top');
    const marginLeft = cs.getPropertyValue('margin-left');

    const top = element.offsetTop - parseFloat(marginTop);
    const left = element.offsetLeft - parseFloat(marginLeft);

    return { top: top, left: left, right: left + element.offsetWidth, bottom: top + element.offsetHeight };
}


function getTooltipBody(selectedObject: ICommunityData | IUserData | undefined, hideLabel: boolean) {
    const body: React.ReactNode[] = []

    if (selectedObject !== undefined) {
        if (selectedObject?.users) {

            body.push(<div className="row" key={-1}> <strong> Name: </strong> &nbsp; {selectedObject.name} </div>);

        } else {

            if (!hideLabel) {
                body.push(<div className="row" key={-1}> <strong> Label: </strong> &nbsp; {selectedObject.label} </div>);
            }

            const keys = Object.keys(selectedObject.explicit_community);

            for (let i = 0; i < keys.length; i++) {
                body.push(<div className="row" key={i}> {`${keys[i]}: ${selectedObject.explicit_community[keys[i]]}`} </div>);
            }
        }
    }

    return body;
}

function getTooltipTittle(selectedObject: ICommunityData | IUserData | undefined) {
    let tittle: React.ReactNode = "";

    if (selectedObject !== undefined)
        if (selectedObject?.users) {
            tittle = "Community Attributes"
        } else {
            tittle = "Citizen Attributes"
        }

    return tittle;
}