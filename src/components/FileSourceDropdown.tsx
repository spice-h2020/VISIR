import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import { Dropdown } from "./Dropdown";

import { FileSource, tbOptions } from "../constants/toolbarOptions";
import { any } from "prop-types";


interface FileSourceDropdownProps {
    onClick: (key: FileSource) => any;
}

const initialState = new Array();

const init = () => {
    for (let i = 0; i < Object.keys(FileSource).length / 2; i++) {
        if (i === tbOptions.initialFileSource) {
            initialState.push(true);
        } else {
            initialState.push(false);
        }
    }
}
init();

/**
 * Dropdown component
 */
export const FileSourceDropdown = ({
    onClick = (key: FileSource) => {
        console.log(`File Source Click`);
        return true;
    },
}: FileSourceDropdownProps) => {

    const [selectedItems, setSelectedOptions] = useState<Array<boolean>>(initialState);

    function changeFileSource(key: FileSource) {
        switch (key) {
            case FileSource.Main:
                setSelectedOptions([true, false, false, false]);
                break;
            case FileSource.Local:
                setSelectedOptions([false, true, false, false]);
                break;
            case FileSource.Develop:
                setSelectedOptions([false, false, true, false]);
                break;
            case FileSource.Api:
                setSelectedOptions([false, false, false, true]);
                break;
        }

        onClick(key);
    }
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