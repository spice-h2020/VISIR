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
import '../style/base.css';

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
            <div className="accordion-header">
                <Button
                    content={
                    <div className="row"> 
                        <div className="btn-text">
                            {tittle}
                        </div>
                        <div className="btn-icon plus">
                            {state === ButtonState.active ? "-" : "+"}
                        </div>
                    </div>}
                    state={state}
                    onClick={() => {
                        onClick({
                            action: bStateArrayActionEnum.activeOne,
                            index: index,
                            newState: state === ButtonState.active ? ButtonState.unactive : ButtonState.active
                        });
                    }}
                    hoverText={tittle}
                />
            </div>
            <div className={`panel ${state === ButtonState.active ? "panel-open" : "panel-close"}`}
                ref={contentRef}
                style={{ maxHeight: state === ButtonState.active ? `${maxHeight}px` : "0px" }}
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