/**
 * @fileoverview This file creates a dropdown menu. A button that can be clicked and will show aditional buttons/items to interact with.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ButtonState } from '../namespaces/ViewOptions';
//Packages
import React, { useState, useEffect } from "react";
//Local files
import { Button } from "./Button";
import '../style/Dropdown.css';

interface DropdownProps {
    //Items inside the dropdown
    items?: React.ReactNode[];
    //Context of the main dropdown button
    content?: React.ReactNode;
    //Extra class name to add and change the CSS
    extraClassName?: string;
}

/**
 * Dropdown Menu that toggle items visibility when the main button is clicked. The items are closed if u click outside the dropdown 
 */
export const Dropdown = ({
    items = [],
    content = "Dropdown",
    extraClassName ="",

}: DropdownProps) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    //Close the dropdown when u click outside of it
    const ref = React.useRef<HTMLDivElement>(null);
    useOutsideClick(showDropDown, ref, () => {
        setShowDropDown(false);
    });

    if (items.length !== 0)
        return (
            <div className={showDropDown ? `dropdown ${extraClassName} active` : `dropdown ${extraClassName}`}
                ref={ref}
            >
                <Button
                    content={content}
                    state={showDropDown ? ButtonState.active : ButtonState.inactive}
                    onClick={() => {
                        setShowDropDown(!showDropDown);
                    }}
                    extraClassName={extraClassName}
                />
                <div className="dropdown-content">
                    {items.map((item: React.ReactNode, index: number): JSX.Element => {
                        return (<React.Fragment key={index}>{item}</React.Fragment>);
                    })}
                </div>
            </div >
        );
    else
        return (
            <div className={`dropdown ${extraClassName} disabled`} ref={ref}>
                <Button
                    content={content}
                    state={ButtonState.inactive}
                />
            </div >
        );
};


/**
 * Aux function that execute a callback function when u click outside of the ref component. 
 * @param state State that will add/delete the events based on its value
 * @param ref Reference of the html object of the component to detect a click outside it
 * @param callback Function executed when the user clicks outside the ref component
 */
const useOutsideClick = (state: boolean, ref: React.RefObject<HTMLDivElement>, callback: Function) => {

    const handleClick = (ev: Event) => {
        if (ref.current && !ref.current.contains(ev.target as Node)) {
            callback();
        }
    };

    useEffect(() => {
        if (state) {
            document.addEventListener("click", handleClick);

        } else {
            document.removeEventListener("click", handleClick);
        }


        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [state]);
};