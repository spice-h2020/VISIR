//WIP component
import React, { useState, useEffect } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { ButtonState, tbOptions } from "../constants/toolbarOptions";
import { Layouts } from "../constants/perspectivesTypes"

interface LayoutDropdownProps {
    //On click handler
    onClick: (key: Layouts) => any;
}

//Calculate the initial state of the LayoutDropdown on start
const initialState = new Array(Object.keys(Layouts).length / 2);
const init = () => {
    initialState.fill(ButtonState.inactive);
    initialState[tbOptions.initialLayout] = ButtonState.active;
}
init();

export const LayoutDropdown = ({
    onClick,
}: LayoutDropdownProps) => {

    const [selectedItems, setSelectedOptions] = useState<Array<ButtonState>>(initialState);

    function changeLayout(key: Layouts) {
        if (!selectedItems[key]) {

            const newState = new Array(Object.keys(Layouts).length / 2);
            newState.fill(ButtonState.inactive);
            newState[key] = ButtonState.active;

            setSelectedOptions(newState);
            onClick(key);
        }
    }

    const LayoutButtons = [
        <Button
            content="Horizontal"
            onClick={() => { changeLayout(Layouts.Horizontal) }}
            state={selectedItems[0]}
            key={0}
        />,
        <Button
            content="Vertical"
            onClick={() => { changeLayout(Layouts.Vertical) }}
            state={selectedItems[1]}
            key={1}
        />]

    return (
        <Dropdown
            items={[LayoutButtons]}
            content="Layout"
            extraClassName="dropdown-light"
        />
    );
};