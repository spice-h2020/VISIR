/**
 * @fileoverview This file creates a dropdown that changes activates/disactives diferent perspectives from the allPerspectives prop.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ButtonState } from "../namespaces/ViewOptions"
import { PerspectiveDetails } from '../namespaces/perspectivesTypes';
//Packages
import React, { useState, useEffect } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

interface SelectPerspectiveProps {
    //On click handler
    onClick: (perspectiveId: number) => void;
    //Object that contains the name of all perspectives availables
    allPerspectives?: PerspectiveDetails[];
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

    //Creates all perspective buttons components
    const perspectivesButtons: React.ReactNode[] = getButtons(allPerspectives, selectedItems, selectPerspective);


    return (
        <Dropdown
            items={perspectivesButtons}
            content="Select Perspective"
            extraClassName="dropdown-dark"
        />
    );
};


function getButtons(allPerspectives: PerspectiveDetails[], selectedItems: Map<number, ButtonState>, selectPerspective: (perspectiveId: number) => void): React.ReactNode[] {
    const buttons = new Array<React.ReactNode>();

    for (let i = 0; i < allPerspectives.length; i++) {
        buttons.push(
            <Button
                content={allPerspectives[i].name}
                state={selectedItems.get(allPerspectives[i].id)}
                onClick={() => {
                    selectPerspective(allPerspectives[i].id);
                }} />
        );
    }
    
    return buttons;
}

