/**
 * @fileoverview This file creates a dropdown that changes the layout of the perspectives once there are more than one active.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ButtonState, initialOptions, AppLayout } from "../namespaces/ViewOptions";
//Packages
import { useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

interface LayoutDropdownProps {
    //On click handler
    setLayout: (key: AppLayout) => void;
}

/**
 * Dropdown component that holds the options to change the visual layout of the perspectives
 */
export const LayoutDropdown = ({
    setLayout,
}: LayoutDropdownProps) => {

    const [selectedItems, setSelectedItems] = useState<Array<ButtonState>>(initialState);

    function changeLayout(key: AppLayout) {
        if (!selectedItems[key]) {

            const newState = new Array(Object.keys(AppLayout).length / 2);
            newState.fill(ButtonState.inactive);
            newState[key] = ButtonState.active;

            setSelectedItems(newState);
            setLayout(key);
        }
    }

    const LayoutButtons = [
        <Button
            content="Horizontal"
            onClick={() => { changeLayout(AppLayout.Horizontal) }}
            state={selectedItems[0]}
            key={0}
        />,
        <Button
            content="Vertical"
            onClick={() => { changeLayout(AppLayout.Vertical) }}
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

/**
 * Calculates the initial state of the dropdown
 */
const initialState = new Array(Object.keys(AppLayout).length / 2);
const init = () => {
    initialState.fill(ButtonState.inactive);
    initialState[initialOptions.layout] = ButtonState.active;
}
init();