//CURRENTLY NOT USED. WAITING FOR THE FINAL DECISION ON THE LAYOUT

/**
 * @fileoverview This file creates a dropdown that changes the layout of the perspectives once there are more than one active.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState, initialOptions, AppLayout } from "../constants/viewOptions";
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

     //State with the state of all items
    const [itemsState, setItemsState] = useState<Array<ButtonState>>(initialState);

    const changeLayout = (key: AppLayout) => {
        if (!itemsState[key]) {

            const newState = new Array(Object.keys(AppLayout).length / 2);
            newState.fill(ButtonState.inactive);
            newState[key] = ButtonState.active;

            setItemsState(newState);
            setLayout(key);
        }
    }

    const LayoutButtons: React.ReactNode[] = getButtons(changeLayout, itemsState)

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

/**
 * Returns the buttons-reactComponents of the layout dropdown
 * @param changeLayout On click function for the buttons. Will receive a AppLayout parameter as an argument
 * @param selectedItems State of the buttons
 * @returns returns an array of React components
 */
function getButtons(changeLayout: Function, selectedItems: ButtonState[]): React.ReactNode[] {
    return [
        <Button
            content="Horizontal"
            onClick={() => { changeLayout(AppLayout.Horizontal); }}
            state={selectedItems[0]}
            key={0} />,
        <Button
            content="Vertical"
            onClick={() => { changeLayout(AppLayout.Vertical); }}
            state={selectedItems[1]}
            key={1} />
    ];
}
