/**
 * @fileoverview This file creates a Tooltip fixated in a position. A floating container with some transparency and a button to close it.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { SelectedObject } from "../constants/auxTypes";
//Packages
import { useEffect, useRef, useState } from "react";
//Local files
import { Button } from "./Button";
import '../style/base.css';
import { CommunityData, UserData } from "../constants/perspectivesTypes";


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

    const [selectObject, setSelecObject] = useState<CommunityData | UserData | undefined>();

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

        setSelecObject(selectedObject?.obj);

    }, [selectedObject?.obj, hideLabels])

    const tooltipTittle: React.ReactNode = getTooltipTittle(selectObject);
    const tooltipBody: React.ReactNode[] = getTooltipBody(selectObject, hideLabels);

    if (selectedObject !== undefined && selectedObject.position !== undefined && isActive) {

        const style = { top: selectedObject.position.y - yOffset, left: selectedObject.position.x };
        return (
            <div
                ref={componentRef}
                className="tooltip active"
                style={style}
            >
                <div ref={bodyRef} className={`tooltip-content`}>
                    <div className={"tooltip-header row"}>
                        <h3 style={{alignSelf: "center", whiteSpace: "nowrap"}}> {tooltipTittle} </h3>
                        <Button
                            content=""
                            extraClassName="btn-close transparent"
                            onClick={() => { setActive(false); }}
                        />
                    </div>
                    <div className={"tooltip-body"}>
                        {tooltipBody}
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


function getTooltipBody(selectedObject: CommunityData | UserData | undefined, hideLabel: boolean) {
    const body: React.ReactNode[] = []

    if(selectedObject !== undefined){
        if (selectedObject?.users) {
            
            body.push(<div className="row" key={-1}> <strong> Name: </strong> &nbsp; {selectedObject.name} </div>);
            body.push(<div className="row" key={-2}> <strong> Explanation: </strong> &nbsp; {selectedObject.explanation} </div>);
    
            // if (selectedObject.bb !== undefined) {
            //     body.push(<div className="row" key={-3}> {`Color: ${selectedObject.bb.color.name}`}</div>);
            // }
            // const users = selectedObject.users.toString();
            // body.push(<div className="row" key={-4}> {` Users: ${users.replace(/,/g, ', ')}`} </div>);

        }else{

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

function getTooltipTittle(selectedObject: CommunityData | UserData | undefined) {
    let tittle: React.ReactNode = "";

    if (selectedObject !== undefined)
        if (selectedObject?.users) {
            tittle = "Community Attributes"
        } else {
            tittle = "Citizen Attributes"
        }

    return tittle;
}