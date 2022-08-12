import React, { useState, useEffect } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { ButtonState } from "../constants/toolbarOptions"
import { AllPerspectives } from '../constants/perspectivesTypes';

interface SelectPerspectiveProps {
    //On click handler
    onClick: (perspectiveId: number) => any;
    //Object that contains the name of all perspectives availables
    allPerspectives?: AllPerspectives;
    //Map that contains the relation between the name of a perspective and their visual state.
    itemsState: Map<number, ButtonState>;
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

    function selectPerspective(perspectiveId: number) {
        onClick(perspectiveId);
    }

    const perspectivesButtons = new Array<React.ReactNode>();
    for (let i = 0; i < allPerspectives.files.length; i++) {
        perspectivesButtons.push(
            <Button
                content={allPerspectives.files[i].name}
                state={selectedItems.get(allPerspectives.files[i].id)}
                onClick={() => {
                    selectPerspective(allPerspectives.files[i].id);
                }}
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


