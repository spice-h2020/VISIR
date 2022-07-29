import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import './Dropdown.css';

interface DropdownProps {
    /**
     * Text of each of the dropdown options. If  the text is = "-", it will be interpreted as a separator inside the dropdown
     */
    itemsLabels: string[];
    /**
     * Text of the button that toggles the dropdown.
     */
    mainLabel?: string;
    /**
     * Choose how dropdown options buttons will behave: 
     * selectDiferents will toggle button active state of any node u click.
     * selectOnlyOne will disactive all buttons except the one selected
     */
    selectBehaviour?: 'selectDiferents' | 'selectOnlyOne';
    /**
     * Function executed when a dropdown option is selected
     */
    onClick?: (option: string) => boolean;
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
    itemsLabels,
    mainLabel = "Dropdown",
    selectBehaviour = "selectDiferents",
    onClick = (option: string) => {
        console.log(`Default onClick ${option}`);
        return true;
    },

}: DropdownProps) => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectedItems, setSelectedOptions] = useState<Array<string>>([]);

    const ref = React.useRef<HTMLDivElement>(null);

    useOutsideClick(showDropDown, ref, () => {
        setShowDropDown(false);
    });

    function optionClick(key: string) {
        const result = onClick(key);
        if (result === true || result === undefined) {
            if (selectBehaviour === "selectOnlyOne") {
                setSelectedOptions([key])
            } else {
                if (selectedItems.includes(key)) {
                    setSelectedOptions(selectedItems => selectedItems.filter((arrKey) => arrKey !== key));
                } else {
                    setSelectedOptions([...selectedItems, key]);
                }
            }
        }
    }

    return (
        <div
            className={showDropDown ? 'dropdown active' : 'dropdown'}
            ref={ref}
        >
            <Button
                content={mainLabel}
                toggleState={true}
                state={showDropDown}
                onClick={() => {
                    setShowDropDown(!showDropDown);
                }}
            />

            <div
                className="dropdown-content"
            >
                {itemsLabels.map(
                    (item: string, index: number): JSX.Element => {

                        if (item === "-")
                            return (<hr key={index}></hr>);
                        else
                            return (
                                <a
                                    className={selectedItems.includes(item) ? 'active' : ''}
                                    onClick={(): void => {
                                        optionClick(item);
                                    }}
                                    key={index}
                                >
                                    {item}
                                </a>
                            );
                    })
                }
            </div>
        </div >
    );
};