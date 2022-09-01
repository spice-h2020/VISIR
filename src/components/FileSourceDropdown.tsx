/**
 * @fileoverview This file creates a dropdown that changes the source of the files with All the info from all perspectives.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, initialOptions, ButtonState } from "../constants/viewOptions";
//Packages
import { useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

interface FileSourceDropdownProps {
    //On click handler
    setFileSource: (key: FileSource) => void;
}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool
 */
export const FileSourceDropdown = ({
    setFileSource,
}: FileSourceDropdownProps) => {

    //State with the state of all items
    const [itemsState, setItemsState] = useState<Array<ButtonState>>(initialState);

    const changeFileSource = (key: FileSource) => {
        if (!itemsState[key]) {

            const newState = new Array(Object.keys(FileSource).length / 2);
            newState.fill(ButtonState.inactive);
            newState[key] = ButtonState.active;

            setItemsState(newState);
            setFileSource(key);
        }
    }

    const fileSourceButtons: React.ReactNode[] = getButtons(changeFileSource, itemsState)

    return (
        <Dropdown
            items={fileSourceButtons}
            content="File Source"
            extraClassName="dropdown-light"
        />
    );
};

/**
 * Calculates the initial state of the dropdown
 */
const initialState = new Array(Object.keys(FileSource).length / 2);
const init = () => {
    initialState.fill(ButtonState.inactive);
    initialState[initialOptions.fileSource] = ButtonState.active;
}
init();

/**
 * Returns the buttons-reactComponents of the file source dropdown
 * @param changeFileSource On click function for the buttons. Will receive a FIleSource parameter as an argument
 * @param selectedItems State of the buttons
 * @returns returns an array of React components
 */
function getButtons(changeFileSource:Function, selectedItems: ButtonState[]): React.ReactNode[] {
    return [
        <Button
            content="Github Main"
            onClick={() => { changeFileSource(FileSource.Main); }}
            state={selectedItems[0]}
            key={0} />,
        <Button
            content="Local"
            onClick={() => { changeFileSource(FileSource.Local); }}
            state={selectedItems[1]}
            key={1} />,
        <Button
            content="Github Develop"
            onClick={() => { changeFileSource(FileSource.Develop); }}
            state={selectedItems[2]}
            key={2} />,
        <Button
            content="Use the API (WIP)"
            onClick={() => { changeFileSource(FileSource.Api); }}
            state={selectedItems[3]}
            key={3} />
    ];
}
