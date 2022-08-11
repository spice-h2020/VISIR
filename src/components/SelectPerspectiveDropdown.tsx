import React, { useState, useEffect } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { AllPerspectives, ButtonState } from "../constants/toolbarOptions"


interface SelectPerspectiveProps {
    //On click handler
    onClick: (perspectiveKey: string) => any;
    //Object that contains the name of all perspectives availables
    allPerspectives?: AllPerspectives;
    //Map that contains the relation between the name of a perspective and their visual state.
    itemsState: Map<string, ButtonState>;
}

/**
 * Dropdown component that holds the options to add/hide perspectives to the application
 */
export const SelectPerspectiveDropdown = ({
    onClick,
    allPerspectives,
    itemsState,
}: SelectPerspectiveProps) => {

    const [selectedItems, setSelectedItems] = useState(itemsState);

    useEffect(() => {
        setSelectedItems(itemsState);
    }, [itemsState]);

    if (allPerspectives === undefined) {
        return (
            <Dropdown
                items={[]}
                content="No available perspectives"
                extraClassName="dropdown-dark"
            />
        );
    }

    function selectPerspective(perspectiveKey: string, buttonId: number) {

        onClick(perspectiveKey);
    }

    const perspectivesButtons = new Array<React.ReactNode>();
    for (let i = 0; i < allPerspectives.names.length; i++) {
        perspectivesButtons.push(
            <Button
                content={allPerspectives.names[i]}
                state={selectedItems.get(allPerspectives.names[i])}
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


