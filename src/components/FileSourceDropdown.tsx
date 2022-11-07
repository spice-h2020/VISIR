/**
 * @fileoverview This file creates a dropdown that changes the source of the files of the request manager.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, initialOptions, EButtonState } from "../constants/viewOptions";
import { EbuttonStateArrayAction, bStateArrayReducer } from "../constants/auxTypes";
//Packages
import { useEffect, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

interface FileSourceDropdownProps {
    //On click handler
    setFileSource: (fileSource: EFileSource) => void;
}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool.
 */
export const FileSourceDropdown = ({
    setFileSource,
}: FileSourceDropdownProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, init());

    const changeFileSource = (newFileSource: EFileSource) => {
        if (states[newFileSource] === EButtonState.unactive) {
            setFileSource(newFileSource);

            setStates({
                action: EbuttonStateArrayAction.activeOne,
                index: newFileSource,
                newState: EButtonState.active
            });
        }
    }

    //Init the app with the initial option executed.
    useEffect(() => {
        setFileSource(initialOptions.fileSource);
        // eslint-disable-next-line
    }, []);

    const fileSourceButtons: React.ReactNode[] = getButtons(changeFileSource, states)

    return (
        <Dropdown
            items={fileSourceButtons}
            content="File Source"
            extraClassButton="transparent down-arrow"
        />
    );
};

/**
 * Calculates the initial state of the dropdown.
 */
const init = (): EButtonState[] => {
    const initialState = new Array(Object.keys(EFileSource).length / 2);

    initialState.fill(EButtonState.unactive);
    initialState[initialOptions.fileSource] = EButtonState.active;

    return initialState;
}

/**
 * Returns the buttons-reactComponents of the file source dropdown.
 * @param changeFileSource On click function for the buttons. Will receive a FIleSource parameter as an argument.
 * @param selectedItems State of the buttons.
 * @returns returns an array of React components.
 */
function getButtons(changeFileSource: Function, selectedItems: EButtonState[]): React.ReactNode[] {
    return [
        <Button
            content="Local app files"
            onClick={() => { changeFileSource(EFileSource.Local); }}
            state={selectedItems[EFileSource.Local]}
            key={1}
            extraClassName={"btn-dropdown"}
        />,
        <Button
            content="Github Develop"
            onClick={() => { changeFileSource(EFileSource.Develop); }}
            state={selectedItems[EFileSource.Develop]}
            key={2}
            extraClassName={"btn-dropdown"}
        />,
        <Button
            content="Use the API (WIP)"
            onClick={() => { changeFileSource(EFileSource.Api); }}
            state={selectedItems[EFileSource.Api]}
            key={3}
            extraClassName={"btn-dropdown"}
        />
    ];
}
