import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import '../style/Dropdown.css';

interface DropdownProps {
    items?: React.ReactNode[];
    /**
     * Text of the button that toggles the dropdown.
     */
    mainLabel?: string;
    extraClassName?: string;
}

const useOutsideClick = (removeEvent: boolean, ref: React.RefObject<HTMLDivElement>, callback: Function) => {

    const handleClick = (ev: Event) => {
        if (ref.current && !ref.current.contains(ev.target as Node)) {
            callback();
        }
    };

    useEffect(() => {
        if (removeEvent) {
            document.addEventListener("click", handleClick);

        } else {
            document.removeEventListener("click", handleClick);
        }


        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [removeEvent]);
};

/**
 * Dropdown component
 */
export const Dropdown = ({
    items = [],
    mainLabel = "Dropdown",
    extraClassName = ""

}: DropdownProps) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    const ref = React.useRef<HTMLDivElement>(null);

    useOutsideClick(showDropDown, ref, () => {
        setShowDropDown(false);
    });

    if (items.length !== 0)
        return (
            <div
                className={showDropDown ? `dropdown ${extraClassName} active` : `dropdown ${extraClassName}`}
                ref={ref}
            >
                <Button
                    content={mainLabel}
                    state={showDropDown}
                    onClick={() => {
                        setShowDropDown(!showDropDown);
                    }}
                />

                <div
                    className="dropdown-content"
                >
                    {items.map((item: any, index: number): JSX.Element => {
                        return (<React.Fragment key={index}>{item}</React.Fragment>);
                    })}
                </div>
            </div >
        );
    else
        return (
            <div
                className={`dropdown ${extraClassName} disabled`}
                ref={ref}
            >
                <Button
                    content={mainLabel}
                    state={false}
                />
            </div >
        );
};