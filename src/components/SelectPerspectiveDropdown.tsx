import React, { useState, useEffect } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

export interface AllPerspectives {
    names: string[];
}

//Function to make sure the AllPerspective object received is valid
export function isAllPerspectivesValid(arg: any): arg is AllPerspectives {
    return arg && arg.names && typeof (arg.names) == "object" && arg.names[0] && typeof (arg.names[0]) == "string";
}

interface SelectPerspectiveProps {
    //On click handler
    onClick: (perspectiveKey: string) => any;
    //Object that contains the name of all perspectives availables
    allPerspectives: AllPerspectives;
    //Validity state of the allPerspective item, if its not valid, the dropdown will be disabled
    isValid: boolean;
}

/**
 * Dropdown component that holds the options to add/hide perspectives to the application
 */
export const SelectPerspectiveDropdown = ({
    onClick,
    isValid,
    allPerspectives,
}: SelectPerspectiveProps) => {

    const [selectedItems, setSelectedItems] = useState<Array<boolean>>([]);

    useEffect(() => {
        if (isValid) {
            const newState = new Array<boolean>(allPerspectives.names.length);
            newState.fill(false);
            setSelectedItems(newState);
        }
    }, [allPerspectives]);

    if (!isValid) {
        return (
            <Dropdown
                items={[]}
                content="No available perspectives"
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
    for (let i = 0; i < allPerspectives.names.length; i++) {
        perspectivesButtons.push(
            <Button
                content={allPerspectives.names[i]}
                state={selectedItems[i]}
                onClick={(buttonId: number) => {
                    selectPerspective(allPerspectives.names[i], buttonId);
                }}
                buttonId={i}
            />
        )
    }

    return (
        <Dropdown
            items={perspectivesButtons}
            content="Select Perspective"
            extraClassName="dropdown-dark"
        />
    );
};


