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
import { AccordionItem } from "./AccordionItem";
import { Button } from "./Button";

interface AccordionProps {
    items: React.ReactNode[];
    tittles: string[];
}

/**
 * Basic UI element that shows the user the tittle of diferent panels and allows the user 
 * to click one of them to expand them and collapse the others
 */
export const Accordion = ({
    items,
    tittles
}: AccordionProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, new Array(items.length).fill(ButtonState.unactive));

    return (
        <div className="accordion-group">
            {getCollapseMenus(items, tittles, states, setStates)}
        </div>
    );
};

function getCollapseMenus(items: React.ReactNode[], tittles: string[], states: ButtonState[], setStates: Dispatch<bStateArrayAction>) {

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

    return components;
}