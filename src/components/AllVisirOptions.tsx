/**
 * @fileoverview This file creates a dropdown that changes the source of the files of the request manager.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, EButtonState, IViewOptionAction, ViewOptions } from "../constants/viewOptions";
import { EbuttonStateArrayAction, bStateArrayReducer, CTranslation } from "../constants/auxTypes";
//Packages
import React, { Dispatch, useEffect, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Local files
import { Button } from "../basicComponents/Button";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
import { Slider } from "../basicComponents/Slider";
import { ILoadingState } from "../basicComponents/LoadingFrontPanel";
//Config file
import config from '../appConfig.json';



const hrStyle: React.CSSProperties = {
    margin: "0.1rem 0",
    borderBottom: "1px",
    borderColor: "black",
}

const inputTextStyle: React.CSSProperties = {
    width: "20rem",
    fontSize: "0.9rem",
    alignSelf: "center",
}

interface AllVisirOptionsProps {
    //On click handler
    setFileSource: Function;
    translationClass: CTranslation;

    curentFileSource: [EFileSource, String];

    setViewOptions: Dispatch<IViewOptionAction>;
    viewOptions: ViewOptions;
}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool.
 */
export const AllVisirOptions = ({
    setFileSource,
    translationClass: tClass,
    curentFileSource,
    setViewOptions,
    viewOptions
}: AllVisirOptionsProps) => {

    //FILE SOURCE OPTIONS
    const [fileSourceState, setFileSourceStates] = useReducer(bStateArrayReducer, initFileSource(curentFileSource[0]));

    const changeFileSource = (newFileSource: EFileSource, apiURL?: string) => {

        setFileSourceStates({
            action: EbuttonStateArrayAction.activeOne,
            index: newFileSource,
            newState: EButtonState.loading
        });

        const callback = () => {
            setFileSourceStates({
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
    const allButtons: React.ReactNode[] = getButtons(changeFileSource, fileSourceState, inputRef)



    //OPTIONS 

    const [optionsStates, setOptionsStates] = useReducer(bStateArrayReducer, initOptions(viewOptions));

    const onClick = (index: number, updateType: keyof ViewOptions) => {
        if (optionsStates[index] !== EButtonState.loading) {

            const savedState = optionsStates[index];
            setOptionsStates({ action: EbuttonStateArrayAction.changeOne, index: index, newState: EButtonState.loading });

            try {
                setViewOptions({ updateType: updateType })
                setOptionsStates({ action: EbuttonStateArrayAction.changeOne, index: index, newState: savedState === EButtonState.active ? EButtonState.unactive : EButtonState.active });

            } catch (e: any) {
                setOptionsStates({ action: EbuttonStateArrayAction.changeOne, index: index, newState: savedState });
            }
        }
    }

    let key = 2;
    allButtons.push(<hr key={++key} style={{
        margin: "0.15rem 0",
        height: "2px",
        backgroundColor: "black",
    }} />);

    allButtons.push(
        <Button
            content={tClass.t.toolbar.optionsDrop.hideLabels}
            onClick={() => { onClick(0, "showLabels"); }}
            state={optionsStates[0]}
            key={++key}
            extraClassName={"btn-dropdown"} />);

    allButtons.push(<Button
        content={tClass.t.toolbar.optionsDrop.hideEdges}
        onClick={() => { onClick(1, "hideEdges"); }}
        state={optionsStates[1]}
        key={++key}
        extraClassName={"btn-dropdown"} />);
    allButtons.push(<hr key={++key} style={hrStyle} />);
    allButtons.push(<Slider
        content={tClass.t.toolbar.optionsDrop.minSimilarity}
        onInput={(value: number) => { setViewOptions({ updateType: "edgeThreshold", newValue: value }); }}
        initialValue={viewOptions.edgeThreshold}
        key={++key}
    />);
    allButtons.push(<hr key={++key} style={hrStyle} />);
    allButtons.push(<Slider
        content={"Number of relevant artworks"}
        minimum={0}
        maximum={10}
        step={1}
        initialValue={viewOptions.nRelevantCommArtworks}
        onInput={(value: number) => { setViewOptions({ updateType: "nRelevantCommArtworks", newValue: value }); }}
        key={++key}
    />);


    return (
        <React.Fragment>
            <DropMenu
                items={allButtons}
                content={<FontAwesomeIcon color='red' size='xl' icon={["fas", "gear"]} />}
                extraClassButton="transparent"
                menuDirection={EDropMenuDirection.down}
                hoverText="Options"
            />
        </React.Fragment>
    );
};

/**
 * Calculates the initial state of the dropdown.
 */
const initFileSource = (initialOption: EFileSource): EButtonState[] => {
    const initialState = new Array(Object.keys(EFileSource).length / 2);

    initialState.fill(EButtonState.unactive);
    initialState[initialOption] = EButtonState.active;

    return initialState;
}

const initOptions = (viewOptions: ViewOptions): EButtonState[] => {
    const initialState: EButtonState[] = [];

    initialState.push(viewOptions.showLabels ? EButtonState.active : EButtonState.unactive);
    initialState.push(viewOptions.hideEdges ? EButtonState.active : EButtonState.unactive);

    return initialState;
}


/**
 * Returns the buttons-reactComponents of the file source dropdown.
 * @param changeFileSource On click function for the buttons. Will receive a FIleSource parameter as an argument.
 * @param selectedItems State of the buttons.
 * @returns returns an array of React components.
 */
function getButtons(changeFileSource: Function, selectedItems: EButtonState[],
    inputRef: React.RefObject<HTMLInputElement>): React.ReactNode[] {

    const useApiFunction = () => {
        if (inputRef.current) {
            changeFileSource(EFileSource.Api, inputRef.current.value);
        }
    }

    const dropRightContent = [
        <div className="row" style={{ alignItems: "center" }} key={1}>
            <label htmlFor="f-urlSource" style={{ marginRight: "5px" }}> Use url: </label>
            <input type="text" id="f-urlSource" ref={inputRef} defaultValue={config.API_URI}
                style={inputTextStyle}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        useApiFunction();
                    }
                }}
            />
        </div>
    ];
    return [
        <Button
            key={1}
            content={"Use local files"}
            onClick={() => { changeFileSource(EFileSource.Local); }}
            state={selectedItems[EFileSource.Local]}
            extraClassName={"btn-dropdown"}
        />,
        <Button
            key={2}
            content={dropRightContent}
            state={selectedItems[EFileSource.Api]}
            extraClassName={"btn-dropdown"}

        />
    ];
}
