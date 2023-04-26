/**
 * @fileoverview This file creates a dropdown that changes all visualization options and the source of all files and configurations from the CM.
 * The available options are:
 * - Use the local aplication files as source.
 * - Connect to a CM with an URL, a user and a password.
 * -----------------
 * - Show the labels of all nodes in the network.
 * - Hide all edges that are not from the currently selected node.
 * - Filter all edges below a certain threshold.
 * - Reduce the number of relevant artworks shown in the community information from the dataTable.
 * @package Requires React package. 
 * @package Requires Font awesome package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, EButtonState, IViewOptionAction, ViewOptions } from "../constants/viewOptions";
import { EbuttonStateArrayAction, bStateArrayReducer } from "../constants/auxTypes";
//Packages
import React, { Dispatch, useEffect, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Local files
import { Button } from "../basicComponents/Button";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
import { Slider } from "../basicComponents/Slider";
import { ITranslation } from "../managers/CTranslation";


interface AllVisirOptionsProps {
    //On click handler
    setFileSource: Function;
    translation: ITranslation | undefined;

    curentFileSource: [EFileSource, string, string, string];

    setViewOptions: Dispatch<IViewOptionAction>;
    viewOptions: ViewOptions;
}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool.
 */
export const AllVisirOptions = ({
    setFileSource,
    translation,
    curentFileSource,
    setViewOptions,
    viewOptions
}: AllVisirOptionsProps) => {

    //--- FILE SOURCE ---//
    const [fileSourceState, setFileSourceStates] = useReducer(bStateArrayReducer, initFileSource(curentFileSource[0]));

    //Function executed to update the file source and what option is selected in the menu.
    const changeFileSource = (newFileSource: EFileSource, apiURL?: string, apiUser?: string, apiPass?: string) => {

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

        setFileSource(newFileSource, callback, apiURL, apiUser, apiPass);
    }

    //When the app starts, select the initial fileSource and load its perspectives
    useEffect(() => {
        changeFileSource(curentFileSource[0], curentFileSource[1], curentFileSource[2], curentFileSource[3]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Diferent html references to obtain the value of the input text fields
    const urlRef = React.useRef<HTMLInputElement>(null);
    const userRef = React.useRef<HTMLInputElement>(null);
    const passRef = React.useRef<HTMLInputElement>(null);

    const allButtons: React.ReactNode[] = getFileSourceButtons(changeFileSource, fileSourceState, urlRef, userRef, passRef, translation,
        curentFileSource)

    //--- VISUALIZATION OPTIONS ---//
    const [optionsStates, setOptionsStates] = useReducer(bStateArrayReducer, initOptions(viewOptions));

    //Function executed when a visualization option is clicked
    const onOptionClicked = (index: number, updateType: keyof ViewOptions) => {
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

    allButtons.push(<hr key={++key} className="dropdown-separator bold" />);

    allButtons.push(
        <Button
            content={translation?.toolbar.Options.showLabel}
            onClick={() => { onOptionClicked(0, "showLabels"); }}
            state={optionsStates[0]}
            key={++key}
            extraClassName={"btn-dropdown"} />);

    allButtons.push(
        <Button
            content={translation?.toolbar.Options.hideEdges}
            onClick={() => { onOptionClicked(1, "hideEdges"); }}
            state={optionsStates[1]}
            key={++key}
            extraClassName={"btn-dropdown"} />);

    allButtons.push(<hr key={++key} className="dropdown-separator" />);

    allButtons.push(
        <Slider
            content={translation?.toolbar.Options.minSimilarity}
            onInput={(value: number) => { setViewOptions({ updateType: "edgeThreshold", newValue: value }); }}
            initialValue={viewOptions.edgeThreshold}
            key={++key}
        />);

    allButtons.push(<hr key={++key} className="dropdown-separator" />);

    allButtons.push(
        <Slider
            content={translation?.toolbar.Options.relevantArtworks}
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
                hoverText={`${translation?.toolbar.Options.hoverText}`}
            />
        </React.Fragment>
    );
};

/**
 * Calculates the initial state of the file source options.
 */
const initFileSource = (initialOption: EFileSource): EButtonState[] => {
    const initialState = new Array(Object.keys(EFileSource).length / 2);

    initialState.fill(EButtonState.unactive);
    initialState[initialOption] = EButtonState.active;

    return initialState;
}

/**
 * Calculates the initial state of the visualization options.
 */
const initOptions = (viewOptions: ViewOptions): EButtonState[] => {
    const initialState: EButtonState[] = [];

    initialState.push(viewOptions.showLabels ? EButtonState.active : EButtonState.unactive);
    initialState.push(viewOptions.hideEdges ? EButtonState.active : EButtonState.unactive);

    return initialState;
}

/**
 * Returns the buttons-reactComponents of the file source options.
 * @param changeFileSource On click function for the buttons. Will receive a FIleSource parameter as an argument.
 * @param selectedItems State of the buttons.
 * @param Refs, references to all input text fields.
 * @param translation object used to translate all texts to a selected language
 * @returns returns an array of React components.
 */
function getFileSourceButtons(changeFileSource: Function, selectedItems: EButtonState[],
    urlRef: React.RefObject<HTMLInputElement>, userRef: React.RefObject<HTMLInputElement>,
    passRef: React.RefObject<HTMLInputElement>,
    translation: ITranslation | undefined, curentFileSource: [EFileSource, string, string, string]): React.ReactNode[] {

    //Function executed when the api option is selected
    const useApiFunction = () => {
        if (urlRef.current && userRef.current && passRef.current) {
            changeFileSource(EFileSource.Api, urlRef.current.value, userRef.current.value, passRef.current.value);
        }
    }

    //Toggles the CM url background color depending on its active state
    const textColor = selectedItems[EFileSource.Api] === EButtonState.active ? "white" : "black";
    const backgroundColor = selectedItems[EFileSource.Api] === EButtonState.active ? "var(--primaryButtonColor)" : "transparent";

    const dropRightContent = [
        <div className="row" style={{
            flexDirection: "column", padding: "0.5rem",
            backgroundColor: backgroundColor,
            color: textColor
        }}
            key={1}>
            {/*First row with the CM url text area */}
            <div className="row" style={{ marginBottom: "0.4rem" }}>
                <label htmlFor="f-urlSource" style={{ marginRight: "5px" }}> {`${translation?.toolbar.Options.useURL}`} </label>
                <input type="text" id="f-urlSource" ref={urlRef} defaultValue={curentFileSource[1]}
                    className="url-input-text" />

            </div>
            {/*Second row with the user and password text areas to the left, and the button to use these values at the right*/}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <div className="row"> <label htmlFor="f-userSource" style={{ marginRight: "5px" }} > {`${translation?.toolbar.Options.user}`} </label>
                        <input type="text" ref={userRef} id="f-userSource" className="user-input-text" defaultValue={curentFileSource[2]} /> </div>

                    <div className="row"> <label htmlFor="f-passSource" style={{ marginRight: "5px" }} > {`${translation?.toolbar.Options.pass}`} </label>
                        <input type="password" ref={passRef} id="f-passSource" className="user-input-text" defaultValue={curentFileSource[3]} /> </div>
                </div>
                <div>
                    <Button
                        extraClassName="primary"
                        hoverText={`${translation?.toolbar.Options.connectBtnHover}`}
                        content={<FontAwesomeIcon color='white' size='xl' icon={["fas", "share"]} />}
                        onClick={() => {
                            useApiFunction();
                        }}
                    />
                </div>
            </div>
        </div>
    ];

    return [
        <Button
            key={1}
            content={`${translation?.toolbar.Options.useLocalFiles}`}
            onClick={() => { changeFileSource(EFileSource.Local); }}
            state={selectedItems[EFileSource.Local]}
            extraClassName={"btn-dropdown"}
        />,
        <div key={2}>
            {dropRightContent}
        </div>
    ];
}
