/**
 * @fileoverview This file creates a group of buttons, each one with a hidden sub-component linked to it. 
 * When a button is clicked, all sub-components will be hided except the sub-component of the clicked button, that one 
 * will be shown.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { bStateArrayReducer } from "../constants/auxTypes";
import { EButtonState } from "../constants/viewOptions";
//Packages
import React, { useReducer } from "react";
//Local files
import { AccordionItem } from "./AccordionItem";

interface AccordionProps {
    items: React.ReactNode[];
    tittles: string[];
}

/**
 * Group of elements that shows the user the tittle of diferent panels and allows the user to click one of them to 
 * expand a panel while collapsing others.
 */
export const Accordion = ({
    items,
    tittles
}: AccordionProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, new Array(items.length).fill(EButtonState.unactive));

    const components: React.ReactNode[] = [];

    for (let i = 0; i < items.length; i++) {
        components.push(
            <AccordionItem
                key={i}
                item={items[i]}
                tittle={tittles[i]}
                state={states[i]}
                index={i}
                onClick={setStates} />
        );
    }

    return (
        //This div is necesary for the :fistChild properties of all accordion item
        <div>
            {components}
        </div>
    );
};