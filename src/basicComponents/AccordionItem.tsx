/**
 * @fileoverview This file creates a button and a hidden component linked to the button. 
 * They are intended to work inside an accordion component were a click will hide all visible components and will make 
 * this component unhidden.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IbStateArrayAction, EbuttonStateArrayAction } from "../constants/auxTypes";
import { EButtonState } from "../constants/viewOptions";
//Packages
import React, { Dispatch, useRef } from "react";
//Local files
import { Button } from "./Button";

const panelStyle: React.CSSProperties = {
    maxHeight: "0px",
    overflow: "hidden",
    transition: "max-height 0.2s ease-out"
}

interface AccordionItemProps {
    item: React.ReactNode;
    tittle: string;
    index: number;
    state: EButtonState;
    onClick: Dispatch<IbStateArrayAction>;
}

/**
 * UI component formed by a button that toggles the item state and hide all other active items in the accordion.
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
                    <div className="accordion-btn-content">
                        {tittle}
                    </div>}
                state={state}
                onClick={() => {
                    onClick({
                        action: EbuttonStateArrayAction.activeOne,
                        index: index,
                        newState: state === EButtonState.active ? EButtonState.unactive : EButtonState.active
                    });
                }}
                extraClassName="btn-accordion dropdown-mediumSize"
                hoverText={tittle}
                postIcon={<div className="dark plus" />}
            />
            <div
                ref={contentRef}
                style={getPanelStyle(state, maxHeight)}
            >
                {item}
            </div>
        </div >);
};

function calculateElementMaxHeight(ref: React.MutableRefObject<null>) {
    if (ref !== undefined && ref.current !== null) {
        return (ref.current as unknown as HTMLElement).scrollHeight;
    } else {
        return 0;
    }
}


function getPanelStyle(currentState: EButtonState, maxHeight: number): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(panelStyle)));

    if (currentState === EButtonState.active) {
        newStyle.maxHeight = maxHeight;
    } else {
        newStyle.maxHeight = "0px";
    }

    return newStyle;
}