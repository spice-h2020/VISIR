import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import { Dropdown } from "./Dropdown";

export interface AllPerspectives {
    files: string[];
}

export function isAllPerspectivesValid(arg: any): arg is AllPerspectives {
    return arg && arg.files && typeof (arg.files) == "object" && arg.files[0] && typeof (arg.files[0]) == "string";
}

interface SelectPerspectiveProps {
    onClick: (perspectiveKey: string) => any;
    perspectivesJSON: AllPerspectives;
    isValid: boolean;
}

/**
 * Dropdown component
 */
export const SelectPerspectiveDropdown = ({
    onClick,
    isValid,
    perspectivesJSON,
}: SelectPerspectiveProps) => {
    const [selectedItems, setSelectedItems] = useState<Array<boolean>>([]);

    useEffect(() => {
        if (isValid) {
            const newState = new Array<boolean>(perspectivesJSON.files.length);
            newState.fill(false);
            setSelectedItems(newState);
        }
    }, [perspectivesJSON]);

    if (!isValid) {
        console.log("Invalid")
        return (
            <Dropdown
                items={[]}
                mainLabel="No perspectives"
                extraClassName="dropdown-dark"
            />
        );
    }

    function selectPerspective(perspectiveKey: string, buttonId: number) {
        const newState = Object.assign(new Array(), selectedItems);
        newState[buttonId] = !newState[buttonId]; 

        setSelectedItems(newState);

        onClick(perspectiveKey);
    }

    const perspectivesButtons = new Array<React.ReactNode>();
    for (let i = 0; i < perspectivesJSON.files.length; i++) {
        perspectivesButtons.push(
            <Button
                content={perspectivesJSON.files[i]}
                state={selectedItems[i]}
                onClick={(buttonId: number) => {
                    selectPerspective(perspectivesJSON.files[i], buttonId);
                }}
                buttonId={i}
            />
        )
    }

    return (
        <Dropdown
            items={perspectivesButtons}
            mainLabel="Select Perspective"
            extraClassName="dropdown-dark"
        />
    );
};


