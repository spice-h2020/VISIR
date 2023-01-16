/**
 * @fileoverview This file creates a dropdown that changes the source of the files of the request manager.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, EButtonState } from "../constants/viewOptions";
import { EbuttonStateArrayAction, bStateArrayReducer, CTranslation } from "../constants/auxTypes";
//Packages
import React, { useEffect, useReducer } from "react";
//Local files
import { Button } from "../basicComponents/Button";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
//Config file
import config from '../appConfig.json';
import { ILoadingState } from "../basicComponents/LoadingFrontPanel";

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

    setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>;
    translationClass: CTranslation;

    insideHamburger?: boolean;
    curentFileSource: [EFileSource, String];

}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool.
 */
export const FileSourceDropdown = ({
    setFileSource,
    setLoadingState,
    insideHamburger = false,
    translationClass: tClass,
    curentFileSource,
}: FileSourceDropdownProps) => {

    const [states, setStates] = useReducer(bStateArrayReducer, init(curentFileSource[0]));

    const changeFileSource = (newFileSource: EFileSource, apiURL?: string) => {

        setLoadingState({ isActive: true, msg: `${tClass.t.loadingText.requestFiles} ${EFileSource[newFileSource]}` })

        setStates({
            action: EbuttonStateArrayAction.activeOne,
            index: newFileSource,
            newState: EButtonState.loading
        });

        const callback = () => {
            setLoadingState({ isActive: false })

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
        changeFileSource(curentFileSource[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const fileSourceButtons: React.ReactNode[] = getButtons(changeFileSource, states, inputRef, tClass)

    if (!insideHamburger) {
        return (
            <React.Fragment>
                <DropMenu
                    items={fileSourceButtons}
                    content={tClass.t.toolbar.fileSourceDrop.name}
                    extraClassButton="transparent down-arrow"
                    menuDirection={EDropMenuDirection.down}
                />
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <DropMenu
                    items={fileSourceButtons}
                    content={tClass.t.toolbar.fileSourceDrop.name}
                    extraClassButton="transparent down-arrow btn-dropdown"
                    menuDirection={EDropMenuDirection.right}
                />
            </React.Fragment>
        );
    }
};

/**
 * Calculates the initial state of the dropdown.
 */
const init = (initialOption: EFileSource): EButtonState[] => {
    const initialState = new Array(Object.keys(EFileSource).length / 2);

    initialState.fill(EButtonState.unactive);
    initialState[initialOption] = EButtonState.active;

    return initialState;
}

/**
 * Returns the buttons-reactComponents of the file source dropdown.
 * @param changeFileSource On click function for the buttons. Will receive a FIleSource parameter as an argument.
 * @param selectedItems State of the buttons.
 * @returns returns an array of React components.
 */
function getButtons(changeFileSource: Function, selectedItems: EButtonState[], inputRef: React.RefObject<HTMLInputElement>
    , tClass: CTranslation): React.ReactNode[] {

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
            content={tClass.t.toolbar.fileSourceDrop.localFiles}
            onClick={() => { changeFileSource(EFileSource.Local); }}
            state={selectedItems[EFileSource.Local]}
            extraClassName={"btn-dropdown"}
        />,
        <DropMenu
            key={2}
            items={dropRightContent}
            state={selectedItems[EFileSource.Api]}
            content={tClass.t.toolbar.fileSourceDrop.Api_URL}
            extraClassButton="transparent btn-dropdown down-right"
            extraClassContainer="dropdown-inner"
            hoverChangesState={true}
            menuDirection={EDropMenuDirection.right}
        />
    ];
}
