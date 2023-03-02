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
import { Slider } from "../basicComponents/Slider";
import { ITranslation } from "../managers/CTranslation";

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

interface ConfToolProps {
    requestManager: RequestManager
    isActive: boolean
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>
    updateFileSource: (fileSource: EFileSource, changeItemState?: Function, apiURL?: string) => void;

    translation: ITranslation | undefined;
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
    updateFileSource,
    translation
}: ConfToolProps) => {
    const [isDevMode, setIsDevMode] = useState<boolean>(false);

    //Seed for all the configuration
    const [seed, setSeed] = useState<IConfigurationSeed>();

    //Written perspective name
    const [perspectiveName, setPerspectiveName] = useState<string>("");
    //Selected algorythm
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<config.IAlgorithm>(emptyAlgorithm);
    const [algorythmWeigth, setAlgorythmWeight] = useState<number>(config.defaultWeightValue);
    const [artworksWeight, setArtworksWeight] = useState<number>(config.defaultArtworkWeightValue);
    //Selected artwork
    const [selectedArtwork, setSelectedArtwork] = useState<config.INameAndIdPair>();

    //Similarity Dropdown states
    const [similarity1, setSimilarity1] = useState<ESimilarity>(ESimilarity.same);
    const [similarity2, setSimilarity2] = useState<ESimilarity>(ESimilarity.same);

    //Sentence structure
    const [midSentence, setMidSentence] = useState<string>("");
    const [lastSentence, setLastSentence] = useState<string>("");

    const [similarity1AvailableValues, setSimilarity1AvailableValues] = useState<Array<ESimilarity>>([ESimilarity.similar, ESimilarity.same, ESimilarity.dissimilar]);
    const [similarity2AvailableValues, setSimilarity2AvailableValues] = useState<Array<ESimilarity>>([ESimilarity.similar, ESimilarity.same, ESimilarity.dissimilar]);

    const [rightSideSentence, setRightSideSentence] = useState<string>("");

    //Middle select option state
    const [selectedOption, setSelectedOption] = useState<config.ISimilarityFunction>(emptyOption);
    //Checkboxes state
    const [citizenAttr, setCitizenAttr] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const [artworksAttr, setArtworksAttr] = useState<Map<string, boolean>>(new Map<string, boolean>());
    //ArtworkAttrbDropdowns state
    const [artworksAttrDrop, setArtworksAttrDrop] = useState<Map<string, boolean[]>>(new Map<string, boolean[]>());

    const [isTextAreaActive, setIsTextAreaActive] = useState<boolean>(false);

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

                    try {
                        setSelectedArtwork(newSeed.artworks[0]);
                    } catch (error: any) {
                        throw Error("Failed while setting default Artwork " + error);
                    }

                    try {
                        setMidSentence(config.initMidSentence(newSeed.configToolType, translation));
                    } catch (error: any) {
                        throw Error("Failed while setting mid sentence word " + error);
                    }

                    try {
                        setLastSentence(config.initLastSentence(newSeed.configToolType, translation));
                    } catch (error: any) {
                        throw Error("Failed while setting mid sentence word " + error);
                    }

                    try {
                        setRightSideSentence(config.initRightSideSentence(newSeed.configToolType, translation));
                    } catch (error: any) {
                        throw Error("Failed while setting right side word " + error);
                    }

                    try {
                        setSimilarity1AvailableValues(config.initSimilarity1(newSeed.configToolType, setSimilarity1));
                    } catch (error: any) {
                        throw Error("Failed while setting available similarity1 dropdown " + error);
                    }

                    try {
                        setSimilarity2AvailableValues(config.initSimilarity2(newSeed.configToolType, setSimilarity2));
                    } catch (error: any) {
                        throw Error("Failed while setting available similarity2 dropdown " + error);
                    }



                }
            });
        }
    }, [isActive, requestManager]);

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
                <div key={0} style={topButtonsStyle}>
                    <span key={0} style={{ marginLeft: "10px" }}>
                        <Button
                            key={0}
                            content={translation?.perspectiveBuider.devModeBtn}
                            extraClassName="dark"
                            state={isDevMode ? EButtonState.active : EButtonState.unactive}
                            onClick={() => { setIsDevMode(!isDevMode); }}
                        />
                    </span>
                    <div key={1} style={backgroundStyle}>
                        {translation?.perspectiveBuider.devModeBtn}
                    </div>
                    <span key={2} style={{ marginRight: "10px" }}>
                        <Button
                            key={1}
                            content=""
                            extraClassName="dark btn-close"
                            onClick={() => { setIsActive(false); }}
                            postIcon={<div className="icon-close"></div>}
                        />
                    </span>
                </div>
                {/*algorithm selector*/}
                <div key={1} style={{
                    display: "flex", height: "5vh",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        display: "flex", justifyContent: "center",
                        alignItems: "center", height: "100%", paddingBottom: "1rem",
                        width: "100%"
                    }}>
                        <div key={3} title={translation?.perspectiveBuider.algorithmSliderExplanation}
                            style={{ display: `${isDevMode ? "inline-flex" : "none"}`, alignItems: "center" }}>
                            <div style={{ width: "50%" }}>
                                {getAlgorythmSelectorDropdown(seed, selectedAlgorithm, setSelectedAlgorithm)}
                            </div>
                            <div style={{ width: "100%" }}>
                                <Slider
                                    initialValue={algorythmWeigth}
                                    onInput={(value: number) => { setAlgorythmWeight(value) }}
                                    minimum={0.0}
                                    maximum={1.0}
                                    step={0.1}
                                    content={translation?.perspectiveBuider.algorithmSlider}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                {/*Row with the sentence and the dropdowns to select*/}
                <div key={2} style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    height: "7vh",
                    margin: "0.4rem 1%",

                    borderTop: "2px solid red"
                }}>
                    <div>
                        <DropMenu
                            key={0}
                            items={getSimilarityDropdown(similarity1, setSimilarity1,
                                similarity1AvailableValues, translation)}
                            content={ESimilarity[similarity1]}
                            menuDirection={EDropMenuDirection.down}
                            extraClassButton={"transparent"}
                            postIcon={<div className="down-arrow" />}
                        />
                    </div>
                    <div>
                        <React.Fragment key={1}>
                            {getOptionSelector(selectedOption, seed, setSelectedOption)}
                        </React.Fragment>
                    </div>
                    <div>
                        <span key={2} style={{ alignSelf: "center", margin: "0% 15px" }}> {midSentence} </span>
                    </div>
                    <div>
                        <DropMenu
                            key={3}
                            items={getSimilarityDropdown(similarity2, setSimilarity2,
                                similarity2AvailableValues, translation)}
                            content={ESimilarity[similarity2]}
                            menuDirection={EDropMenuDirection.down}
                            extraClassButton={"transparent"}
                            postIcon={<div className="down-arrow" />}
                        />
                    </div>
                    <div style={{ display: "inline-flex" }}>
                        <span key={5} style={{ alignSelf: "center", margin: "0% 15px" }}> {lastSentence} </span>

                        <div style={{ direction: "rtl" }}>
                            {getNArtworksDropdown(similarity2, selectedArtwork, setSelectedArtwork, seed)}
                        </div>
                        <div key={4} style={getArtworsSliderDropdownStyle(isDevMode, similarity2)}
                            title={translation?.perspectiveBuider.similaritySliderExplanation}>
                            {getSimilaritySlider(artworksWeight, setArtworksWeight, similarity2, translation)}
                        </div>
                    </div>
                </div>
                {/*Row with the fieldsets, and the button to open/close the json export object */}
                <div key={3} style={{
                    height: "60vh",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap"
                }}>
                    {/*Fieldsets with the attributes*/}
                    <div key={0} style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        overflowX: "hidden",

                        width: "100%"
                    }}>
                        <fieldset key={0} style={{ height: "-webkit-fill-available", overflowY: "auto", minInlineSize: "auto", width: "35%" }}>
                            <h3 style={{ padding: "0.25rem 0px", margin: "0px 0px", borderBottom: "1px solid black" }}>

                                {`${translation?.perspectiveBuider.leftBoxTittle}`} </h3>

                            {getCitizenAttributeSelector(seed, citizenAttr, setCitizenAttr)}
                        </fieldset>
                        <fieldset key={1} style={getArtworkCheckboxStyle(ESimilarity.same === similarity2)}>
                            <h3 style={{ padding: "0.25rem 0px", margin: "0px 0px", borderBottom: "1px solid black" }}>{rightSideSentence}</h3>
                            {getArtworkAttributeSelector(similarity2, seed, artworksAttr, setArtworksAttr, artworksAttrDrop,
                                setArtworksAttrDrop, isDevMode)}
                        </fieldset>
                    </div>
                    {/*Button to collapse the text area*/}
                    <div key={1} style={{ height: "100%", display: `${isDevMode ? "block" : "none"}` }}>
                        <Button
                            content={`${isTextAreaActive ? ">>" : "<<"}`}
                            onClick={() => {
                                setIsTextAreaActive(!isTextAreaActive);
                            }}
                            extraClassName={"big-height dark"}
                        />
                    </div>
                    {/*Text area*/}
                    <div key={2} style={{ height: "100%", width: `${isTextAreaActive ? "30%" : "0%"}` }}>
                        <div style={{ height: `100%`, textAlign: "center" }}>
                            <textarea ref={textAreaRef} readOnly value={textAreaContent} style={getTextAreaStyle(textAreaHeight, isTextAreaActive)} />
                        </div>
                    </div>
                </div>
                {/*Last row with the send button*/}
                <div key={4} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "1rem 0px",
                    height: "5vh"
                }}>
                    <label key={0} htmlFor="f-perspective_name" style={{ marginRight: "1rem" }}> {translation?.perspectiveBuider.perspectiveNameLabel}:</label>
                    <input key={1} style={{ marginRight: "1rem" }} type="text" id="f-perspective_name" name="f-perspective_name"
                        onChange={
                            (element) => {
                                setPerspectiveName(element.target.value)
                            }
                        }
                    />
                    <Button
                        content={translation?.perspectiveBuider.sendBtn}
                        extraClassName="primary"

                        onClick={
                            () => {
                                if (seed) {
                                    const newConfiguration = config.createConfigurationFile(seed, citizenAttr,
                                        artworksAttr, artworksAttrDrop, selectedOption, similarity1, similarity2,
                                        perspectiveName, selectedAlgorithm, algorythmWeigth, selectedArtwork, artworksWeight);

                                    setTextAreaContent(JSON.stringify(newConfiguration, null, 4));

                                    requestManager.sendNewConfigSeed(newConfiguration, updateFileSource, () => { });
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
function getSimilarityDropdown(sim: ESimilarity, setSimilarity: Function,
    similarityAvailableValues: Array<ESimilarity>, translation: ITranslation | undefined): React.ReactNode[] {
    const buttons: React.ReactNode[] = [];


    for (let i = 0; i < similarityAvailableValues.length; i++) {

        const btnContent = translation?.perspectiveBuider.similarityValues[
            ESimilarity[similarityAvailableValues[i]] as "same" | "similar" | "dissimilar"
        ];

        buttons.push(
            <Button
                key={i}
                content={btnContent}
                state={sim === similarityAvailableValues[i] ? EButtonState.active : EButtonState.unactive}
                onClick={
                    () => {
                        setSimilarity(similarityAvailableValues[i]);
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
                key={0}
                items={dropdownItems}
                content={selectedAlgorythm.name}
                extraClassButton={"primary"}
                postIcon={<div className="down-arrow" />}
            />
        );
    } else {
        <DropMenu
            key={0}
            items={[]}
            content={"Select algorithm"}
            extraClassButton={"primary"}
            postIcon={<div className="down-arrow" />}
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
        return [<React.Fragment key={0}></React.Fragment>];
    } else {
        const checkboxes = [];

        for (let i = 0; i < seed.user_attributes.length; i++) {
            const userAttribute = seed.user_attributes[i];
            const isChecked: boolean | undefined = citizenAttr.get(userAttribute.att_name);

            checkboxes.push(
                <div key={i} className="row checkbox-row active" style={{ userSelect: "none", cursor: "pointer" }}
                    title={userAttribute.att_name} onClick={() => {
                        citizenAttr.set(userAttribute.att_name, !isChecked);
                        setCitizenAttr(new Map(citizenAttr));
                    }}>
                    {/*The on change is a dummy function needed to not get error because otherwise the checked 
                        property changes without onChange being implemented*/}
                    <input key={1} type="checkbox" style={{ userSelect: "none", cursor: "pointer" }}
                        id={`cit-${userAttribute.att_name}`} value={userAttribute.att_name} checked={isChecked ? isChecked : false}
                        onChange={() => { }} />
                    {userAttribute.att_name}

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
        return [<div key={0}></div>];
    } else {
        const checkboxes = [];

        for (let i = 0; i < seed.artwork_attributes.length; i++) {
            const onAttribute = seed.artwork_attributes[i].on_attribute;
            const isChecked: boolean | undefined = artworksAttr.get(onAttribute.att_name) && sim2 !== ESimilarity.same;

            checkboxes.push(
                <div key={i} className={`checkbox-row ${ESimilarity.same === sim2 ? "" : "active"}`}
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
                    {<div key={0} style={{ overflowX: "hidden", whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => {
                        artworksAttr.set(onAttribute.att_name, !isChecked);
                        setArtworksAttr(new Map(artworksAttr));
                    }}>
                        {/*The on change is a dummy function needed because otherwise "checked" 
                        property changes wont be correctly updated*/}
                        <input key={0} type="checkbox" style={{ cursor: "pointer" }} id={`art-${onAttribute.att_name}`}
                            value={onAttribute.att_name} checked={isChecked ? isChecked : false} onChange={() => { }} />

                        {onAttribute.att_name}
                    </div>}
                    {<div key={1} style={{
                        display: "flex",
                        direction: "rtl"
                    }}>
                        {getSingleArtworkAttributeDropdown(seed.artwork_attributes[i].on_attribute.att_name,
                            seed.artwork_attributes[i].sim_function, artworksAttrDrop, setArtworksAttrDrop, isDevMode)}
                    </div>}
                </div >
            )
        }

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
                extraClassButton={"transparent dropdown-minimumSize"}
                postIcon={<div className="down-arrow" />}
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
        return (
            <DropMenu
                items={[]}
                content={`No options available`}
                menuDirection={EDropMenuDirection.down}
                extraClassButton={"transparent"}
                postIcon={<div className="down-arrow" />}
            />);
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
                extraClassButton={"transparent"}
                postIcon={<div className="down-arrow" />}
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


function getSimilaritySlider(artworksWeight: number, setArtworksWeight: Function, similarity2: ESimilarity,
    translation: ITranslation | undefined): React.ReactNode {

    if (similarity2 !== ESimilarity.same) {

        return (
            <Slider
                initialValue={artworksWeight}
                onInput={(value: number) => { setArtworksWeight(value) }}
                minimum={0.0}
                maximum={1.0}
                step={0.1}
                content={`${translation?.perspectiveBuider.similaritySlider}`}
            />);

    } else {
        return "";
    }
}

/**
 * Returns a dropDown that allows the user to pick what artwork to use when doing "same" artworks
 * @param similarity2 
 * @param selectedArtwork 
 * @param setSelectedArtwork 
 * @param seed 
 * @returns 
 */
function getNArtworksDropdown(similarity2: ESimilarity, selectedArtwork: config.INameAndIdPair | undefined,
    setSelectedArtwork: Function, seed: IConfigurationSeed | undefined): React.ReactNode {
    const items = [];

    if (seed !== undefined && selectedArtwork !== undefined && similarity2 === ESimilarity.same) {
        for (let i = 0; i < seed.artworks.length; i++) {
            const name = seed.artworks[i].name;

            items.push(
                <Button
                    key={i}
                    content={`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
                    state={seed.artworks[i].id === selectedArtwork.id ? EButtonState.active : EButtonState.unactive}
                    onClick={
                        () => {
                            setSelectedArtwork(seed.artworks[i]);
                        }
                    }
                    extraClassName={"btn-dropdown"}
                    hoverText={name}
                />
            );
        }

        return (
            <DropMenu
                items={items}
                content={`${selectedArtwork.name.charAt(0).toUpperCase()}${selectedArtwork.name.slice(1)}`}
                menuDirection={EDropMenuDirection.down}
                extraClassButton={"primary"}
                extraClassContainer={"dropdown-content-flip maxHeight-60vh"}
                postIcon={<div className="down-arrow" />}
                hoverText={selectedArtwork.name}
            />
        );
    } else {
        return "";
    }
}

function getArtworsSliderDropdownStyle(isDevMode: boolean, similarity: ESimilarity) {

    let shouldDisplay = isDevMode || similarity === ESimilarity.same
    const style: React.CSSProperties =
    {
        display: `${shouldDisplay ? "block" : "none"}`,
    }

    return style;
}
