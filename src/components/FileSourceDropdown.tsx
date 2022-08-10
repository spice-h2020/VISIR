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
        if (!selectedItems[key]) {

            const newState = new Array();
            for (let i = 0; i < Object.keys(FileSource).length / 2; i++) {
                if (i === key) {
                    newState.push(true);
                } else {
                    newState.push(false);
                }
            }
            setSelectedOptions(newState);
            onClick(key);
            return true;
        }
        return false;
    }

    const fileSourceButtons = [
        <Button
            content="Github Main"
            onClick={() => { changeFileSource(FileSource.Main) }}
            state={selectedItems[0]}
            toggleState={false}
        />,
        <Button
            content="Local"
            onClick={() => { changeFileSource(FileSource.Local) }}
            state={selectedItems[1]}
            toggleState={false}
        />,
        <Button
            content="Github Develop"
            onClick={() => { changeFileSource(FileSource.Develop) }}
            state={selectedItems[2]}
            toggleState={false}
        />,
        <Button
            content="Use the API (WIP)"
            onClick={() => { changeFileSource(FileSource.Api) }}
            state={selectedItems[3]}
            toggleState={false}
        />]

    return (
        <Dropdown
            items={fileSourceButtons}
            mainLabel="File Source"
            extraClassName="dropdown-light"
        />
    );
};