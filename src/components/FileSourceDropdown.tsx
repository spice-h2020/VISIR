import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import { Dropdown } from "./Dropdown";

import { FileSource, tbOptions } from "../constants/toolbarOptions";
import { any } from "prop-types";


interface FileSourceDropdownProps {
    onClick: (key: FileSource) => any;
}

const initialState = new Array(Object.keys(FileSource).length/2);

const init = () => {
    initialState.fill(false);
    initialState[tbOptions.initialFileSource] = true;
}
init();

/**
 * Dropdown component
 */
export const FileSourceDropdown = ({
    onClick,
}: FileSourceDropdownProps) => {

    const [selectedItems, setSelectedOptions] = useState<Array<boolean>>(initialState);

    function changeFileSource(key: FileSource) {
        if (!selectedItems[key]) {

            const newState = new Array(Object.keys(FileSource).length/2);
            newState.fill(false);
            newState[key] = true;

            setSelectedOptions(newState);
            onClick(key);
        }
    }

    console.log("preFileSourceButtons")
    const fileSourceButtons = [
        <Button
            content="Github Main"
            onClick={() => { changeFileSource(FileSource.Main) }}
            state={selectedItems[0]}
        />,
        <Button
            content="Local"
            onClick={() => { changeFileSource(FileSource.Local) }}
            state={selectedItems[1]}
        />,
        <Button
            content="Github Develop"
            onClick={() => { changeFileSource(FileSource.Develop) }}
            state={selectedItems[2]}
        />,
        <Button
            content="Use the API (WIP)"
            onClick={() => { changeFileSource(FileSource.Api) }}
            state={selectedItems[3]}
        />]

    return (
        <Dropdown
            items={fileSourceButtons}
            mainLabel="File Source"
            extraClassName="dropdown-light"
        />
    );
};