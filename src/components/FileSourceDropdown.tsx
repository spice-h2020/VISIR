/**
 * @fileoverview This file creates a dropdown that changes the source of the files of the request manager.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, initialOptions, EButtonState } from "../constants/viewOptions";
import { EbuttonStateArrayAction, bStateArrayReducer } from "../constants/auxTypes";
//Packages
import React, { useEffect, useReducer, useState } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
//Config file
import config from '../appConfig.json';
import { LoadingFrontPanel } from "../basicComponents/LoadingFrontPanel";

const inputTextStyle: React.CSSProperties = {
    width: "20rem",
    fontSize: "1rem",
    alignSelf: "center",
}

const updateImgStyle: React.CSSProperties = {
    width: "1.4rem",
    verticalAlign: "middle"
}


interface FileSourceDropdownProps {
    //On click handler
    setFileSource: Function;
}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool.
 */
export const FileSourceDropdown = ({
    setFileSource,
}: FileSourceDropdownProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, init());

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");


    const changeFileSource = (newFileSource: EFileSource, apiURL?: string) => {

        setLoadingMsg(`Loading ${EFileSource[newFileSource]}`)
        setIsLoading(true);

        setStates({
            action: EbuttonStateArrayAction.activeOne,
            index: newFileSource,
            newState: EButtonState.loading
        });

        const callback = () => {
            setIsLoading(false);
            setStates({
                action: EbuttonStateArrayAction.activeOne,
                index: newFileSource,
                newState: EButtonState.active
            })
        }

        setFileSource(newFileSource, callback, apiURL);
    }

    //When the app starts, select the initial fileSource and load its perspectives
    useEffect(() => {
        changeFileSource(initialOptions.fileSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const fileSourceButtons: React.ReactNode[] = getButtons(changeFileSource, states, inputRef)

    return (
        <React.Fragment>
            <DropMenu
                items={fileSourceButtons}
                content="File Source"
                extraClassButton="transparent down-arrow"
                menuDirection={EDropMenuDirection.down}
            />
            <LoadingFrontPanel
                isActive={isLoading}
                message={loadingMsg}
            />
        </React.Fragment>
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
function getButtons(changeFileSource: Function, selectedItems: EButtonState[], inputRef: React.RefObject<HTMLInputElement>): React.ReactNode[] {

    const imageSrc = selectedItems[EFileSource.Api] === EButtonState.active ? "./images/update-white.png" : "./images/update-red.png";

    const dropRightContent = [
        <div className="row" key={1}>
            <input type="text" ref={inputRef} defaultValue={config.API_URI}
                style={inputTextStyle}
            />
            <Button
                content={<img src={imageSrc} style={updateImgStyle} alt="update Icon" />}
                onClick={() => {
                    if (inputRef.current) {
                        changeFileSource(EFileSource.Api, inputRef.current.value);
                    }
                }}
                state={selectedItems[EFileSource.Api]}
                extraClassName={selectedItems[EFileSource.Api] === EButtonState.active ? "primary" : ""}
            />
        </div>
    ];
    return [
        <Button
            key={1}
            content="Local app files"
            onClick={() => { changeFileSource(EFileSource.Local); }}
            state={selectedItems[EFileSource.Local]}
            extraClassName={"btn-dropdown"}
        />,
        <DropMenu
            key={2}
            items={dropRightContent}
            state={selectedItems[EFileSource.Api]}
            content="Api URL"
            extraClassButton="transparent btn-dropdown down-right"
            extraClassContainer="dropdown-inner"
            hoverChangesState={true}
            menuDirection={EDropMenuDirection.right}
        />
    ];
}
