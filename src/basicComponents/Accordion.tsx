/**
 * @fileoverview This file creates a group of buttons, each one with a hidden component. 
 * When a button is clicked, all components will be hided except the component of th ebutton clicked, that one will be shown.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { bStateArrayReducer } from "../constants/auxTypes";
import { ButtonState } from "../constants/viewOptions";
//Packages
import React, { useReducer} from "react";
//Local files
import { AccordionItem } from "./AccordionItem";

interface AccordionProps {
    items: React.ReactNode[];
    tittles: string[];
}

/**
 * Group of elements that shows the user the tittle of diferent panels and allows the user 
 * to click one of them to expand them and collapse the others
 */
export const Accordion = ({
    items,
    tittles
}: AccordionProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, new Array(items.length).fill(ButtonState.unactive));

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
        <React.Fragment>
            {components}
        </React.Fragment>
    );
};