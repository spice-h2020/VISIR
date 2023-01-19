/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * The button can also be disabled to negate any interaction with it, or change its colors with the state : ButtonState
 * property.
 * If auto toggle parameter is true, the button will automaticaly change its state between active and 
 * unactive when clicked.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState, EFileSource } from "../constants/viewOptions";
//Packages
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../basicComponents/Button";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
import RequestManager from "../managers/requestManager";
import { ESimilarity, IConfigurationSeed } from "../constants/ConfigToolUtils";
import { ILoadingState } from "../basicComponents/LoadingFrontPanel";

import * as config from "../constants/ConfigToolUtils";

const darkBackgroundStyle: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.3)",

    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",

    zIndex: 100,
}

const innerPanelStyle: React.CSSProperties = {
    width: "90vw",
    height: "90vh",

    //Center the panel in the view screen
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-45vh",
    marginLeft: "-45vw",

    background: "var(--bodyBackground)",
    borderRadius: "15px",

    overflowY: "auto",
    border: "2px solid var(--primaryButtonColor)",
    borderLeft: "10px solid var(--primaryButtonColor)"
};

const topButtonsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: "10px",
    height: "5vh"
}

const devModeBackgroundStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bolder",
    opacity: "20%",
    color: "gray"
}

const fieldsetStyle: React.CSSProperties = {
    flexDirection: "column",
    overflow: "auto"

}

interface ConfToolProps {
    requestManager: RequestManager
    isActive: boolean
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>
    setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>;
    updateFileSource: (fileSource: EFileSource, changeItemState?: Function, apiURL?: string) => void;
}

const emptyAlgorithm: config.IAlgorithm = { name: "undefined Algorithm", params: [], default: true }
const emptyOption: config.ISimilarityFunction = {
    name: "undefined option", params: [], on_attribute: { att_name: "none", att_type: "string", }, interaction_object: { att_name: "none", att_type: "string", }
}
/**
 * UI component that executes a function when clicked.
 */
export const ConfigurationTool = ({
    requestManager,
    isActive,
    setIsActive,
    setLoadingState,
    updateFileSource,
}: ConfToolProps) => {
    const [isDevMode, setIsDevMode] = useState<boolean>(false);

    //Written perspective name
    const [perspectiveName, setPerspectiveName] = useState<string>("");
    //Selected algorythm
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<config.IAlgorithm>(emptyAlgorithm);
    //Similarity Dropdown states
    const [similarity1, setSimilarity1] = useState<ESimilarity>(ESimilarity.Same);
    const [similarity2, setSimilarity2] = useState<ESimilarity>(ESimilarity.Same);
    //Middle select option state
    const [selectedOption, setSelectedOption] = useState<config.ISimilarityFunction>(emptyOption);
    //Checkboxes state
    const [citizenAttr, setCitizenAttr] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const [artworksAttr, setArtworksAttr] = useState<Map<string, boolean>>(new Map<string, boolean>());
    //ArtworkAttrbDropdowns state
    const [artworksAttrDrop, setArtworksAttrDrop] = useState<Map<string, boolean[]>>(new Map<string, boolean[]>());

    const [isTextAreaActive, setIsTextAreaActive] = useState<boolean>(false);

    //Seed for all the configuration
    const [seed, setSeed] = useState<IConfigurationSeed>();
    //TextArea at the end content
    const [textAreaContent, setTextAreaContent] = useState<string>("");

    const [textAreaHeight, setTextAreaHeight] = useState<number>(0);
    const textAreaRef = useRef(null);

    //When the configuration tool is active, check for the latest configuration seed
    useEffect(() => {
        if (isActive) {
            requestManager.requestConfigurationToolSeed((newSeed: IConfigurationSeed) => {

                if (newSeed !== undefined) {
                    if (newSeed.interaction_similarity_functions.length === 0) {
                        alert("Configuration Tool initial configuration doesnt contain an interaction similarity function")
                    } else {
                        setSeed(newSeed)
                        setLoadingState({ isActive: false });
                        setSelectedOption(newSeed.interaction_similarity_functions[0]);
                    }

                    try {
                        setArtworksAttrDrop(config.initArtworksAttrDrop(newSeed.artwork_attributes));
                    } catch (error: any) {
                        throw Error("Failed while setting artworks attributes " + error);
                    }

                    try {
                        setSelectedAlgorithm(config.initAlgorythmDrop(newSeed.algorithm));
                    } catch (error: any) {
                        throw Error("Failed while setting default Algorythm attributes " + error);
                    }

                }
            });
        }
    }, [isActive, requestManager, setLoadingState]);

    //Init the new citizen and artworks attributes
    useEffect(() => {
        if (seed !== undefined) {
            //Init citizen attr
            let newMap = new Map<string, boolean>();
            for (let i = 0; i < seed.user_attributes.length; i++) {
                newMap.set(seed.user_attributes[i].att_name, false);
            }
            setCitizenAttr(newMap);

            //Init artwork attr
            newMap = new Map<string, boolean>();
            for (let i = 0; i < seed.artwork_attributes.length; i++) {
                newMap.set(seed.artwork_attributes[i].on_attribute.att_name, false);
            }
            setArtworksAttr(newMap);
        }
    }, [seed]);

    //Update the size of the TextArea that shows the json sent to configurate the CM
    useEffect(() => {
        const ref = textAreaRef as any;

        if (ref.current !== null) {
            setTextAreaHeight(ref.current.scrollHeight);
        }

    }, [textAreaContent, isTextAreaActive]);

    //Toggle the background dev mode if dev mode is active
    const backgroundStyle: React.CSSProperties = JSON.parse(JSON.stringify(devModeBackgroundStyle));

    backgroundStyle.display = isDevMode ? "block" : "none";

    return (
        <div style={darkBackgroundStyle} className={isActive ? "toVisibleAnim" : "toHiddenAnim"}>
            <div style={innerPanelStyle}>
                {/*Row with the buttons to open DEV MODE or exit the application */}
                <div style={topButtonsStyle}>
                    <span style={{ marginLeft: "10px" }}>
                        <Button
                            content="Dev mode "
                            extraClassName="dark"
                            state={isDevMode ? EButtonState.active : EButtonState.unactive}
                            onClick={() => { setIsDevMode(!isDevMode); }}
                        />
                    </span>
                    <div style={backgroundStyle}>
                        DEV MODE
                    </div>
                    <span style={{ marginRight: "10px" }}>
                        <Button
                            content=""
                            extraClassName="btn-close transparent"
                            onClick={() => { setIsActive(false); }}
                        />
                    </span>
                </div>
                {/*Row with the perspective name and algorithm selector*/}
                <div style={{
                    display: "flex", height: "5vh",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <label htmlFor="f-perspective_name" style={{ marginRight: "1rem" }}>Perspective Name:</label>
                    <input type="text" id="f-perspective_name" name="f-perspective_name"
                        onChange={
                            (element) => {
                                setPerspectiveName(element.target.value)
                            }
                        }
                    />
                    <span style={{ width: "2rem" }} />
                    {getAlgorythmSelectorDropdown(seed, selectedAlgorithm, setSelectedAlgorithm)}

                </div>
                {/*Row with the sentence and the dropdowns to select*/}
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    height: "7vh"
                }}>
                    <DropMenu
                        key={0}
                        items={getSimilarityDropdown(similarity1, setSimilarity1)}
                        content={ESimilarity[similarity1]}
                        menuDirection={EDropMenuDirection.down}
                        extraClassButton={"transparent down-arrow"}
                    />
                    {getOptionSelector(selectedOption, seed, setSelectedOption)}

                    <span key={2} style={{ alignSelf: "center", margin: "0% 15px" }}> in </span>
                    <DropMenu
                        key={3}
                        items={getSimilarityDropdown(similarity2, setSimilarity2)}
                        content={ESimilarity[similarity2]}
                        menuDirection={EDropMenuDirection.down}
                        extraClassButton={"transparent down-arrow"}
                    />
                    <span key={4} style={{ alignSelf: "center", margin: "0% 15px" }}> artworks. </span>
                </div>
                {/*Row with the fieldsets, and the button to open/close the json export object */}
                <div style={{
                    height: "60vh",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap"
                }}>
                    {/*Fieldsets with the attributes*/}
                    <div style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        overflowX: "hidden",

                        width: "100%"
                    }}>
                        <fieldset key={0} style={{ height: "-webkit-fill-available", overflowY: "auto", minInlineSize: "auto", width: "35%" }}>
                            {getCitizenAttributeSelector(seed, citizenAttr, setCitizenAttr)}
                        </fieldset>
                        <fieldset key={1} style={getArtworkCheckboxStyle(ESimilarity.Same === similarity2)}>
                            {getArtworkAttributeSelector(similarity2, seed, artworksAttr, setArtworksAttr, artworksAttrDrop,
                                setArtworksAttrDrop, isDevMode)}
                        </fieldset>
                    </div>
                    {/*Button to collapse the text area*/}
                    <div style={{ height: "100%", display: `${isDevMode ? "block" : "none"}` }}>
                        <Button
                            content={`${isTextAreaActive ? ">>" : "<<"}`}
                            onClick={() => {
                                setIsTextAreaActive(!isTextAreaActive);
                            }}
                            extraClassName={"big-height dark"}
                        />

                    </div>
                    {/*Text area*/}
                    <div style={{ height: "100%", width: `${isTextAreaActive ? "30%" : "0%"}` }}>
                        <div style={{ height: `100%`, textAlign: "center" }}>
                            <textarea ref={textAreaRef} readOnly value={textAreaContent} style={getTextAreaStyle(textAreaHeight, isTextAreaActive)} />
                        </div>
                    </div>
                </div>
                {/*Last row with the send button*/}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "1rem 0px",
                    height: "5vh"
                }}>
                    <Button
                        content="Send Perspective"
                        extraClassName="primary"

                        onClick={
                            () => {
                                if (seed) {
                                    const newConfiguration = config.createConfigurationFile(seed, citizenAttr,
                                        artworksAttr, artworksAttrDrop, selectedOption, similarity1, similarity2,
                                        perspectiveName, selectedAlgorithm);

                                    setTextAreaContent(JSON.stringify(newConfiguration, null, 4));

                                    requestManager.sendNewConfigSeed(newConfiguration, updateFileSource, () => setLoadingState({ isActive: false }));
                                }
                            }
                        }
                    />
                </div>


            </div>
        </div >
    );
};

/**
 * Creates a dropdown to pick between diferent ESimilarity Options
 * @param sim current ESimilarity value selected
 * @param setSimilarity callback executed when an option is selected
 * @returns 
 */
function getSimilarityDropdown(sim: ESimilarity, setSimilarity: Function): React.ReactNode[] {
    const buttons: React.ReactNode[] = [];

    for (let i = 0; i < Object.keys(ESimilarity).length / 2; i++) {
        buttons.push(
            <Button
                key={i}
                content={ESimilarity[i]}
                state={sim === i ? EButtonState.active : EButtonState.unactive}
                onClick={
                    () => {
                        setSimilarity(i);
                    }
                }
                extraClassName={"btn-dropdown"}
            />
        )
    }
    return buttons;
}


function getAlgorythmSelectorDropdown(seed: IConfigurationSeed | undefined, selectedAlgorythm: config.IAlgorithm, setSelectedAlgorythm: Function): React.ReactNode {

    if (seed !== undefined) {
        const dropdownItems: React.ReactNode[] = []
        const algorithms = seed.algorithm;

        for (let i = 0; i < algorithms.length; i++) {
            dropdownItems.push(
                <Button
                    key={i}
                    content={algorithms[i].name}
                    state={algorithms[i].name === selectedAlgorythm.name ? EButtonState.active : EButtonState.unactive}
                    onClick={
                        () => {
                            setSelectedAlgorythm(algorithms[i]);
                        }
                    }
                    extraClassName={"btn-dropdown"}
                />
            )
        }

        return (
            <DropMenu
                items={dropdownItems}
                content={selectedAlgorythm.name}
                extraClassButton={"primary down-arrow"}
            />
        );
    } else {
        <DropMenu
            items={[]}
            content={"Select algorithm"}
            extraClassButton={"primary down-arrow"}
        />
    }

}

/**
 * Creates several checkboxes to select the citizen attributes to use in the clustering
 * @param seed configuration seed
 * @param citizenAttr current state of the checkboxes
 * @param setCitizenAttr callback executed when a checkbox is clicked
 * @returns 
 */
function getCitizenAttributeSelector(seed: IConfigurationSeed | undefined, citizenAttr: Map<string, boolean>,
    setCitizenAttr: React.Dispatch<React.SetStateAction<Map<string, boolean>>>): React.ReactNode[] {

    if (seed === undefined) {
        return [<React.Fragment></React.Fragment>];
    } else {
        const checkboxes = [];

        for (let i = 0; i < seed.user_attributes.length; i++) {
            const userAttribute = seed.user_attributes[i];
            const isChecked: boolean | undefined = citizenAttr.get(userAttribute.att_name);

            checkboxes.push(
                <div key={i} className="row checkbox-row active">
                    <input key={1} type="checkbox" style={{ cursor: "pointer" }} id={`cit-${userAttribute.att_name}`} value={userAttribute.att_name} checked={isChecked ? isChecked : false}
                        onChange={() => {
                            citizenAttr.set(userAttribute.att_name, !isChecked);
                            setCitizenAttr(new Map(citizenAttr));
                        }
                        } />
                    <label key={2} htmlFor={`cit-${userAttribute.att_name}`} style={{ userSelect: "none", cursor: "pointer" }}>
                        {userAttribute.att_name}
                    </label>
                </div>)
        }

        return checkboxes
    }
}



/**
 * Creates several checkboxes to select the artworks attributes to use in the clustering
 * @param sim2 Similarity value of the second similarity dropdown. If === Same, the checkboxes will be disabled
 * @param seed configuration seed
 * @param artworksAttr current state of the checkboxes
 * @param setArtworksAttr callback executed when a checkbox is clicked 
 * @returns 
 */
function getArtworkAttributeSelector(sim2: ESimilarity, seed: IConfigurationSeed | undefined,
    artworksAttr: Map<string, boolean>, setArtworksAttr: React.Dispatch<React.SetStateAction<Map<string, boolean>>>,
    artworksAttrDrop: Map<string, boolean[]>, setArtworksAttrDrop: Function, isDevMode: boolean)
    : React.ReactNode[] {

    if (seed === undefined) {
        return [<React.Fragment></React.Fragment>];
    } else {
        const checkboxes = [];

        for (let i = 0; i < seed.artwork_attributes.length; i++) {
            const onAttribute = seed.artwork_attributes[i].on_attribute;
            const isChecked: boolean | undefined = artworksAttr.get(onAttribute.att_name) && sim2 !== ESimilarity.Same;

            checkboxes.push(
                <div key={i} className={`checkbox-row ${ESimilarity.Same === sim2 ? "" : "active"}`}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        alignItems: "center",

                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        minInlineSize: "auto"
                    }}>
                    <div style={{ overflowX: "hidden", whiteSpace: "nowrap", cursor: "pointer" }} >
                        <input type="checkbox" style={{ cursor: "pointer" }} id={`art-${onAttribute.att_name}`} value={onAttribute.att_name} checked={isChecked ? isChecked : false}
                            onChange={() => {
                                artworksAttr.set(onAttribute.att_name, !isChecked);
                                setArtworksAttr(new Map(artworksAttr));
                            }}
                        />
                        <label htmlFor={`art-${onAttribute.att_name}`} title={onAttribute.att_name} style={{ overflowX: "hidden", whiteSpace: "nowrap", cursor: "pointer" }}>
                            {onAttribute.att_name}
                        </label>
                    </div>
                    <div style={{
                        display: "flex",
                        direction: "rtl"
                    }}>
                        {getSingleArtworkAttributeDropdown(seed.artwork_attributes[i].on_attribute.att_name,
                            seed.artwork_attributes[i].sim_function, artworksAttrDrop, setArtworksAttrDrop, isDevMode)}
                    </div>
                </div >
            )
        }

        const localStyle: React.CSSProperties = JSON.parse(JSON.stringify(fieldsetStyle));
        localStyle.width = "100%";

        return checkboxes
    }
}

function getSingleArtworkAttributeDropdown(attrName: string, algorithms: config.IAlgorithm[],
    artworksAttrDrop: Map<string, boolean[]>, setArtworksAttrDrop: Function, isDevMode: boolean) {

    const buttonStates = artworksAttrDrop.get(attrName);

    if (buttonStates === undefined) {
        return <div />
    }

    const dropMenuItems: React.ReactNode[] = [];
    let selectedName;

    for (let i = 0; i < algorithms.length; i++) {

        if (buttonStates[i]) {
            selectedName = algorithms[i].name;
        }

        dropMenuItems.push(
            <Button
                key={i}
                content={algorithms[i].name}
                state={buttonStates[i] ? EButtonState.active : EButtonState.unactive}
                onClick={
                    () => {
                        const newMap = new Map(artworksAttrDrop);
                        const newButtonState = newMap.get(attrName);

                        if (newButtonState !== undefined) {
                            for (let j = 0; j < newButtonState.length; j++) {
                                if (j === i) {
                                    newButtonState[j] = true;
                                } else {
                                    newButtonState[j] = false;
                                }
                            }
                            setArtworksAttrDrop(newMap);
                        }
                    }
                }
                extraClassName={"btn-dropdown"}
            />
        )
    }

    return (
        <div title={selectedName} style={{ display: `${isDevMode ? "block" : "none"}` }}>
            <DropMenu
                items={dropMenuItems}
                content={selectedName}
                extraClassButton={"transparent down-arrow dropdown-minimumSize"}
            />
        </div>
    );
}
/**
 * Creates the middle dropdown
 * @param selectedOption current st
 * @param seed configuration seed
 * @param setSelectedOption callback executed when a selected option is clicked
 * @returns 
 */
function getOptionSelector(selectedOption: config.ISimilarityFunction, seed: IConfigurationSeed | undefined,
    setSelectedOption: Function): React.ReactNode {

    if (!seed) {
        return ("");
    } else {

        const items = [];

        for (let i = 0; i < seed.interaction_similarity_functions.length; i++) {
            const name = seed.interaction_similarity_functions[i].on_attribute.att_name;

            items.push(
                <Button
                    key={i}
                    content={`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
                    state={name === selectedOption.on_attribute.att_name ? EButtonState.active : EButtonState.unactive}
                    onClick={
                        () => {
                            setSelectedOption(seed.interaction_similarity_functions[i]);
                        }
                    }
                    extraClassName={"btn-dropdown"}
                />
            );
        }

        return (
            <DropMenu
                items={items}
                content={`${selectedOption.on_attribute.att_name.charAt(0).toUpperCase()}${selectedOption.on_attribute.att_name.slice(1)}`}
                menuDirection={EDropMenuDirection.down}
                extraClassButton={"transparent down-arrow"}
            />);
    }
}

function getArtworkCheckboxStyle(hide: boolean): React.CSSProperties {

    const style: React.CSSProperties = {
        pointerEvents: hide ? "none" : "auto",
        opacity: hide ? "30%" : "100%",
        userSelect: "none",
        height: "-webkit-fill-available",
        overflowY: "auto",
        minInlineSize: "auto",
        width: "100%",
    }

    return style;
}

function getTextAreaStyle(textAreaHeight: number, isTextAreaActive: boolean): React.CSSProperties {
    const style: React.CSSProperties = {
        overflowY: "auto",
        height: `${textAreaHeight < 10 ? "5rem" : textAreaHeight}px`,
        maxHeight: "100%",
        width: "90%",
        display: `${isTextAreaActive ? "inline-block" : "none"}`
    }

    return style;
}