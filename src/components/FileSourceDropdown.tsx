import { useState } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

import { FileSource, tbOptions, ButtonState } from "../constants/toolbarOptions";

interface FileSourceDropdownProps {
    //On click handler
    onClick: (key: FileSource) => void;
}

//Calculate the initial state of the FileSourceDropdown on start
const initialState = new Array(Object.keys(FileSource).length / 2);
const init = () => {
    initialState.fill(ButtonState.inactive);
    initialState[tbOptions.initialFileSource] = ButtonState.active;
}
init();

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool
 */
export const FileSourceDropdown = ({
    onClick,
}: FileSourceDropdownProps) => {

    const [selectedItems, setSelectedOptions] = useState<Array<ButtonState>>(initialState);

    function changeFileSource(key: FileSource) {
        if (!selectedItems[key]) {

            const newState = new Array(Object.keys(FileSource).length / 2);
            newState.fill(ButtonState.inactive);
            newState[key] = ButtonState.active;

            setSelectedOptions(newState);
            onClick(key);
        }
    }

    const fileSourceButtons = [
        <Button
            content="Github Main"
            onClick={() => { changeFileSource(FileSource.Main) }}
            state={selectedItems[0]}
            key={0}
        />,
        <Button
            content="Local"
            onClick={() => { changeFileSource(FileSource.Local) }}
            state={selectedItems[1]}
            key={1}
        />,
        <Button
            content="Github Develop"
            onClick={() => { changeFileSource(FileSource.Develop) }}
            state={selectedItems[2]}
            key={2}
        />,
        <Button
            content="Use the API (WIP)"
            onClick={() => { changeFileSource(FileSource.Api) }}
            state={selectedItems[3]}
            key={3}
        />]

    return (
        <Dropdown
            items={fileSourceButtons}
            content="File Source"
            extraClassName="dropdown-light"
        />
    );
};