/**
 * @fileoverview This file creates a dropdown that changes the source of the files with All the info from all perspectives.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource, initialOptions, ButtonState } from "../constants/viewOptions";
//Packages
import { useReducer, useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { bStateArrayActionEnum, bStateArrayReducer } from "../constants/auxTypes";

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

    //State of all items
    const [states, setStates] = useReducer(bStateArrayReducer, init());

    const changeFileSource = (key: FileSource) => {
        if (states[key] === ButtonState.inactive) {

            setStates({ action: bStateArrayActionEnum.activeOne, index: key, newState: ButtonState.active });
            setFileSource(key);

        }
    }

    const fileSourceButtons: React.ReactNode[] = getButtons(changeFileSource, states)

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
const init = (): ButtonState[] => {
    const initialState = new Array(Object.keys(FileSource).length / 2);

    initialState.fill(ButtonState.inactive);
    initialState[initialOptions.fileSource] = ButtonState.active;

    return initialState;
}

/**
 * Returns the buttons-reactComponents of the file source dropdown
 * @param changeFileSource On click function for the buttons. Will receive a FIleSource parameter as an argument
 * @param selectedItems State of the buttons
 * @returns returns an array of React components
 */
function getButtons(changeFileSource: Function, selectedItems: ButtonState[]): React.ReactNode[] {
    return [
        <Button
            content="Local app files"
            onClick={() => { changeFileSource(FileSource.Local); }}
            state={selectedItems[FileSource.Local]}
            key={1} />,
        <Button
            content="Github Develop"
            onClick={() => { changeFileSource(FileSource.Develop); }}
            state={selectedItems[FileSource.Develop]}
            key={2} />,
        <Button
            content="Use the API (WIP)"
            onClick={() => { changeFileSource(FileSource.Api); }}
            state={selectedItems[FileSource.Api]}
            key={3} />
    ];
}
