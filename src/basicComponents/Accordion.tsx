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

export interface AccordionItem {
    tittle: string,
    item: React.ReactNode,
}

interface AccordionProps {
    items: AccordionItem[];
}

/**
 * Basic UI element that shows the user the tittle of diferent panels and allows the user 
 * to click one of them to expand them and collapse the others
 */
export const Accordion = ({
    items
}: AccordionProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, [ButtonState.unactive, ButtonState.unactive]);

    return (
        <div className="accordion-group">
            {getCollapseMenus(items, states, setStates)}
        </div>
    );
};


function getCollapseMenus(items: AccordionItem[], states: ButtonState[], setStates: Dispatch<bStateArrayAction>) {

    const components: React.ReactNode[] = [];

    for (let i = 0; i < items.length; i++) {
        const contentRef = useRef(null);
        const maxHeight = calculateElementMaxHeight(contentRef);

        components.push(
            <div className="accordion-menu" key={i}>
                <div className="accordion-header">
                    <Button
                        content={items[i].tittle}
                        state={states[i]}
                        onClick={() => {
                            setStates({ action: bStateArrayActionEnum.activeOne, index: i, newState: states[i] === ButtonState.active ? ButtonState.unactive : ButtonState.active })
                        }}
                    />
                </div>
                <div className={`panel ${states[i] === ButtonState.active ? "panel-open" : "panel-close"}`}
                    ref={contentRef} 
                    style={{ maxHeight: states[i] === ButtonState.active ? `${maxHeight}px` : "0px" }}
                >
                    {items[i].item}
                </div>
            </div >);
    }

    return components;
}

function calculateElementMaxHeight(ref: React.MutableRefObject<null>){
    if(ref !== undefined && ref.current !== null){
        return (ref.current as unknown as HTMLElement).scrollHeight;
    }else{
        return 0;
    }
}