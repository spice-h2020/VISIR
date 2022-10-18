/**
 * @fileoverview This file creates a button and a hidden component. They are intended to work inside an accordion component
 * were a click will hide all visible components and will make this component unhidden.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { bStateArrayAction, bStateArrayActionEnum } from "../constants/auxTypes";
import { ButtonState } from "../constants/viewOptions";
//Packages
import React, { Dispatch, useRef } from "react";
//Local files
import { Button } from "./Button";

const panelStyle: React.CSSProperties = {
    maxHeight: "0px",
    overflow: "hidden",
    transition: "max-height 0.2s ease-out"
}

const buttonText: React.CSSProperties = {
    width: "90%",
    float: "left",
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
}

interface AccordionItemProps {
    item: React.ReactNode;
    tittle: string;
    index: number;
    state: ButtonState;
    onClick: Dispatch<bStateArrayAction>;
}

/**
 * Basic UI element formed by a button that toggles the item state and hide all other active items in the accordion
 */
export const AccordionItem = ({
    item,
    tittle,
    index,
    state,
    onClick,
}: AccordionItemProps) => {

    const contentRef = useRef(null);
    const maxHeight = calculateElementMaxHeight(contentRef);

    return (
        <div className="accordion-menu">
            <Button
                content={
                    <div style={buttonText}>
                        {tittle}
                    </div>}
                state={state}
                onClick={() => {
                    onClick({
                        action: bStateArrayActionEnum.activeOne,
                        index: index,
                        newState: state === ButtonState.active ? ButtonState.unactive : ButtonState.active
                    });
                }}
                extraClassName="btn-accordion plus"
                hoverText={tittle}
            />
            <div
                ref={contentRef}
                style={getPanelStyle(state, maxHeight)}
            >
                {item}
            </div>
        </div >);
};

/**
 * Calculates the max Height of an HTML element
 * @param ref ref of the HTML element
 * @returns the height
 */
function calculateElementMaxHeight(ref: React.MutableRefObject<null>) {
    if (ref !== undefined && ref.current !== null) {
        return (ref.current as unknown as HTMLElement).scrollHeight;
    } else {
        return 0;
    }
}


function getPanelStyle(currentState: ButtonState, maxHeight: number): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(panelStyle)));

    if (currentState === ButtonState.active) {
        newStyle.maxHeight = maxHeight;
    } else {
        newStyle.maxHeight = "0px";
    }

    return newStyle;
}