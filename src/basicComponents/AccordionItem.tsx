/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
//Packages
import React, { Dispatch, MutableRefObject, useEffect, useReducer, useRef, useState } from "react";
import { bStateArrayAction, bStateArrayActionEnum, bStateArrayReducer } from "../constants/auxTypes";
import { ButtonState } from "../constants/viewOptions";
//Local files
import '../style/accordion.css';
import { Button } from "./Button";

interface AccordionItemProps {
    item: React.ReactNode;
    tittle: string;
    index: number;
    state: ButtonState;
    onClick: Dispatch<bStateArrayAction>;
}

/**
 * Basic UI element that shows the user the tittle of diferent panels and allows the user 
 * to click one of them to expand them and collapse the others
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
                    content={tittle}
                    state={state}
                    onClick={() => {
                        onClick({
                            action: bStateArrayActionEnum.activeOne,
                            index: index,
                            newState: state === ButtonState.active ? ButtonState.unactive : ButtonState.active
                        });
                    }}
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

function calculateElementMaxHeight(ref: React.MutableRefObject<null>) {
    if (ref !== undefined && ref.current !== null) {
        return (ref.current as unknown as HTMLElement).scrollHeight;
    } else {
        return 0;
    }
}