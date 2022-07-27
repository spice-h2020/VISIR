import React, { useState, useEffect, PointerEvent } from "react";

import './Dropdown.css';

interface DropdownProps {
    /**
     * Text of each of the dropdown options
     */
    optionsLabels: string[];
    /**
     * Text of the button that toggles the dropdown
     */
    mainLabel?: string;
    /**
     * Choose how dropdown options buttons will behave: 
     * selectDiferents will toggle button active state of any node u click.
     * selectOnlyOne will disactive all buttons except the one selected
     */
    selectOptions?: 'selectDiferents' | 'selectOnlyOne';
    /**
     * Function executed when a dropdown option is selected
     */
    onClick?: () => void;
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
 * Primary UI component for user interaction
 */
export const Dropdown = ({
    optionsLabels = [],
    mainLabel = "Dropdown",
    selectOptions = "selectDiferents",
    onClick = () => { },

}: DropdownProps) => {

    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);

    const ref = React.useRef<HTMLDivElement>(null);

    useOutsideClick(showDropDown, ref, () => {
        setShowDropDown(false);
    });

    function optionClick(key: string) {
        if (selectOptions === "selectOnlyOne") {
            setSelectedOptions([key])
        } else {

            if (selectedOptions.includes(key)) {
                setSelectedOptions(selectedOptions => selectedOptions.filter((arrKey) => arrKey !== key));
            } else {
                setSelectedOptions([...selectedOptions, key]);
            }
        }

    }

    return (
        <div
            className={showDropDown ? 'dropdown active' : 'dropdown'}
            ref={ref}
        >
            <button
                className="dropbtn"
                onClick={(): void => {
                    setShowDropDown(!showDropDown);
                }}
                onBlur={(): void => {

                }}
            >
                {mainLabel}
            </button>
            <div
                className="dropdown-content"
            >
                {optionsLabels.map(
                    (option: string, index: number): JSX.Element => {

                        return (
                            <a
                                className={selectedOptions.includes(option) ? 'active' : ''}
                                onClick={(): void => {
                                    optionClick(option);
                                }}
                                key={index}
                            >
                                {option}
                            </a>
                        );
                    })
                }
            </div>
        </div >


    );
};

/**
 * <div className="dropdown">
            <span> {mainLabel} </span>
            <div className="dropdown-content">
                {optionsLabels.map(
                    (option: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                            >
                                {option}
                            </p>
                        );
                    })
                }
            </div>
        </div>
 */
