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
import { EButtonState } from "../constants/viewOptions";
//Packages
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../basicComponents/Button";
import { DropMenu, EDropMenuDirection } from "../basicComponents/DropMenu";
import RequestManager from "../managers/requestManager";
import { IConfigurationSeed, ISimilarityFunction } from "../constants/configurationToolTypes";
import { ILoadingState } from "../basicComponents/LoadingFrontPanel";

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
    display: "flex",
    width: "80vw",
    height: "80vh",

    //Center the panel in the view screen
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-40vh",
    marginLeft: "-40vw",

    background: "var(--bodyBackground)",
    borderRadius: "15px",

    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    flexWrap: "nowrap",

    overflowY: "auto"
};

const firstRowStyle: React.CSSProperties = {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignContent: "stretch",
    alignItems: "center",
    width: "100%"
}

const devModeBackgroundStyle: React.CSSProperties = {
    position: "fixed",
    fontSize: "150px",
    fontWeight: "bolder",
    opacity: "20%",
    color: "gray"
}
interface ConfToolProps {
    requestManager: RequestManager
    isActive: boolean
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>
    setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>;
}

enum ESimilarity {
    Same,
    Similar,
    Different
}

const noneSelectedName = "Select option";

/**
 * UI component that executes a function when clicked.
 */
export const ConfigurationTool = ({
    requestManager,
    isActive,
    setIsActive,
    setLoadingState
}: ConfToolProps) => {
    const [isDevMode, setIsDevMode] = useState<boolean>(false);

    //Written perspective name
    const [perspectiveName, setPerspectiveName] = useState<string>("");
    //Similarity Dropdown states
    const [similarity1, setSimilarity1] = useState<ESimilarity>(ESimilarity.Same);
    const [similarity2, setSimilarity2] = useState<ESimilarity>(ESimilarity.Same);
    //Middle select option state
    const [selectedOption, setSelectedOption] = useState<[String, number]>([noneSelectedName, -1]);
    //Checkboxes state
    const [citizenAttr, setCitizenAttr] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const [artworksAttr, setArtworksAttr] = useState<Map<string, boolean>>(new Map<string, boolean>());

    //Seed for all the configuration
    const [seed, setSeed] = useState<IConfigurationSeed>();
    //TextArea at the end content
    const [textAreaContent, setTextAreaContent] = useState<string>("");

    const [textAreaHeight, setTextAreaHeight] = useState<number>(0);
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            requestManager.requestConfigurationToolSeed((seed: IConfigurationSeed) => {
                setSeed(seed)
                setLoadingState({ isActive: false });
            });
        }
    }, [isActive]);


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


    function createConfigurationFile() {

        if (seed) {
            let newConfig: any = {
                user_attributes: [],
                interaction_similarity_functions: [],
                similarity_functions: []
            };

            citizenAttr.forEach((value, key) => {
                if (value) {
                    newConfig.user_attributes.push({
                        att_name: key,
                        att_type: "String"
                    });
                }
            });

            if (selectedOption[0] != noneSelectedName) {
                switch (similarity1) {
                    case ESimilarity.Same: {
                        let obj = { sim_function: {} as any };
                        obj.sim_function = JSON.parse(JSON.stringify(
                            seed.interaction_similarity_functions[selectedOption[1]]))

                        obj.sim_function.name = "EqualSimilarityDAO";

                        newConfig.interaction_similarity_functions.push(obj);
                        break;
                    }
                    case ESimilarity.Similar: {
                        let obj = { sim_function: {} as any };
                        obj.sim_function = JSON.parse(JSON.stringify(
                            seed.interaction_similarity_functions[selectedOption[1]]))

                        newConfig.interaction_similarity_functions.push(obj)

                        break;
                    }
                    case ESimilarity.Different: {
                        let obj = { sim_function: {} as any };
                        obj.sim_function = JSON.parse(JSON.stringify(
                            seed.interaction_similarity_functions[selectedOption[1]]))
                        obj.sim_function.dissimilar = true;
                        newConfig.interaction_similarity_functions.push(obj)

                        break;
                    }
                }
            }

            switch (similarity2) {
                case ESimilarity.Same: {
                    let sim = {
                        "sim_function": {
                            "name": "EqualSimilarityDAO",
                            "params": [],
                            "on_attribute": {
                                "att_name": "id",
                                "att_type": "String"
                            }
                        }
                    };
                    newConfig.similarity_functions.push(sim);
                    break;
                }
                case ESimilarity.Similar: {
                    seed.artwork_attributes.forEach((value) => {
                        const name = value.on_attribute.att_name;

                        if (artworksAttr.get(name)) {
                            newConfig.similarity_functions.push({
                                sim_function: {
                                    dissimilar: false,
                                    name: value.name,
                                    on_attribute: value.on_attribute,
                                    params: value.params,
                                }
                            })
                        }
                    });

                    if (newConfig.similarity_functions.length === 0) {
                        let sim = {
                            "sim_function": {
                                "name": "EqualSimilarityDAO",
                                "params": [],
                                "on_attribute": {
                                    "att_name": "id",
                                    "att_type": "String"
                                }
                            }
                        };
                        newConfig.similarity_functions.push(sim);
                    }

                    break;
                }
                case ESimilarity.Different: {
                    seed.artwork_attributes.forEach((value) => {
                        const name = value.on_attribute.att_name;

                        if (artworksAttr.get(name)) {
                            newConfig.similarity_functions.push({
                                sim_function: {
                                    dissimilar: true,
                                    name: value.name,
                                    on_attribute: value.on_attribute,
                                    params: value.params,
                                }
                            })
                        }
                    });

                    break;
                }
            }

            let configName = perspectiveName.replaceAll(" ", "_");

            if (configName === "") {

                switch (similarity1) {
                    case ESimilarity.Same: {
                        configName = "E-";
                        break;
                    }
                    case ESimilarity.Similar: {
                        configName = "S-";
                        break;
                    }
                    case ESimilarity.Different: {
                        configName = "D-";
                        break;
                    }
                }

                if (newConfig.interaction_similarity_functions.length != 0)
                    configName += seed.interaction_similarity_functions[selectedOption[1]].on_attribute.att_name;

                switch (similarity2) {
                    case ESimilarity.Same: {
                        configName += "-E-";
                        break;
                    }
                    case ESimilarity.Similar: {
                        configName += "-S-";
                        break;
                    }
                    case ESimilarity.Different: {
                        configName += "-D-";
                        break;
                    }
                }
                configName += "artworks";

                let artwork_attributesName: String[] = [];
                seed.artwork_attributes.forEach((value) => {
                    const name = value.on_attribute.att_name;

                    if (artworksAttr.get(name)) {
                        artwork_attributesName.push(value.on_attribute.att_name);
                    }
                });

                if (artwork_attributesName.length && similarity2 != ESimilarity.Same)
                    configName = configName + " (" + artwork_attributesName.join(", ") + ")";

            }

            newConfig["name"] = configName;
            newConfig["id"] = configName;

            newConfig["algorithm"] = {
                "name": "agglomerative",
                "params": []
            };

            return newConfig;
        }
    }

    useEffect(() => {
        const ref = textAreaRef as any;

        if (ref.current !== null) {
            setTextAreaHeight(ref.current.scrollHeight);
        }

    }, [textAreaContent]);

    const backgroundStyle: React.CSSProperties = JSON.parse(JSON.stringify(devModeBackgroundStyle));
    backgroundStyle.display = isDevMode ? "block" : "none";

    return (
        <div style={darkBackgroundStyle} className={isActive ? "toVisibleAnim" : "toHiddenAnim"}>
            <div style={innerPanelStyle}>
                <div style={backgroundStyle}>
                    DEV MODE
                </div>

                <div key={0} className="row" style={firstRowStyle}>
                    <Button
                        content="Dev mode "
                        extraClassName="primary"
                        state={isDevMode ? EButtonState.active : EButtonState.unactive}
                        onClick={() => { setIsDevMode(!isDevMode); }}
                    />
                    <Button
                        content=""
                        extraClassName="btn-close transparent"
                        onClick={() => { setIsActive(false); }}
                    />
                </div>
                <div>
                    <label htmlFor="f-perspective_name">Perspective Name:</label>
                    <input type="text" id="f-perspective_name" name="f-perspective_name"
                        onChange={
                            (element) => {
                                setPerspectiveName(element.target.value)
                            }
                        }
                    />

                </div>
                <form key={1} id="form-config" action="" method="get">
                    <div key={0} className="row">
                        <DropMenu
                            key={0}
                            items={getSimilarityDropdown(similarity1, setSimilarity1)}
                            content={ESimilarity[similarity1]}
                            menuDirection={EDropMenuDirection.down}
                            extraClassButton={"transparent down-arrow fixedWidth-10vw"}
                        />
                        {getOptionSelector(selectedOption, seed, setSelectedOption)}

                        <span key={2} style={{ alignSelf: "center" }}> in </span>
                        <DropMenu
                            key={3}
                            items={getSimilarityDropdown(similarity2, setSimilarity2)}
                            content={ESimilarity[similarity2]}
                            menuDirection={EDropMenuDirection.down}
                            extraClassButton={"transparent down-arrow fixedWidth-10vw"}
                        />
                        <span key={4} style={{ alignSelf: "center" }}> artworks. </span>
                    </div>

                    <div key={1} className="row">
                        {getCitizenAttributeSelector(similarity1, seed, citizenAttr, setCitizenAttr)}
                        {getArtworkAttributeSelector(similarity2, seed, artworksAttr, setArtworksAttr)}
                    </div>
                    <div key={2} style={{ marginTop: "5px" }}>
                        <Button
                            content="Send"
                            extraClassName="primary"

                            onClick={
                                () => {
                                    const newConfiguration = createConfigurationFile();
                                    setTextAreaContent(JSON.stringify(newConfiguration, null, 4));


                                    requestManager.sendNewConfigSeed(newConfiguration);
                                }
                            }
                        />
                    </div>
                </form>

                <textarea ref={textAreaRef} readOnly value={textAreaContent} style={{ height: `${textAreaHeight}px`, width: "30vw" }}>

                </textarea>
            </div>
        </div >
    );
};

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

function getCitizenAttributeSelector(sim: ESimilarity, seed: IConfigurationSeed | undefined,
    citizenAttr: Map<string, boolean>, setCitizenAttr: React.Dispatch<React.SetStateAction<Map<string, boolean>>>)
    : React.ReactNode {

    if (seed === undefined) {
        return <React.Fragment key={0}></React.Fragment>;
    } else {
        const checkboxes = [];

        for (let i = 0; i < seed.user_attributes.length; i++) {
            const userAttribute = seed.user_attributes[i];
            const isChecked: boolean | undefined = citizenAttr.get(userAttribute.att_name);

            checkboxes.push(
                <div key={i} className="row">
                    <input type="checkbox" id={`cit-${userAttribute.att_name}`} value={userAttribute.att_name} checked={isChecked ? isChecked : false}
                        onChange={() => {
                            citizenAttr.set(userAttribute.att_name, !isChecked);
                            setCitizenAttr(new Map(citizenAttr));
                        }
                        } />
                    <label htmlFor={`cit-${userAttribute.att_name}`} style={{ userSelect: "none" }}>
                        {userAttribute.att_name}
                    </label>
                </div>)
        }

        return (
            <fieldset key={0} className="row" style={{ flexDirection: "column" }}>
                {checkboxes}
            </fieldset>
        )
    }
}


function getArtworkAttributeSelector(sim: ESimilarity, seed: IConfigurationSeed | undefined,
    artworksAttr: Map<string, boolean>, setArtworksAttr: React.Dispatch<React.SetStateAction<Map<string, boolean>>>)
    : React.ReactNode {

    if (seed === undefined) {
        return <React.Fragment key={1}></React.Fragment>;
    } else {
        const checkboxes = [];

        for (let i = 0; i < seed.artwork_attributes.length; i++) {
            const onAttribute = seed.artwork_attributes[i].on_attribute;
            const isChecked: boolean | undefined = artworksAttr.get(onAttribute.att_name) && sim !== ESimilarity.Same;

            checkboxes.push(
                <div key={i} className="row">
                    <input type="checkbox" style={getCheckboxStyle(sim === ESimilarity.Same)} id={`art-${onAttribute.att_name}`} value={onAttribute.att_name} checked={isChecked ? isChecked : false}
                        onChange={() => {
                            artworksAttr.set(onAttribute.att_name, !isChecked);
                            setArtworksAttr(new Map(artworksAttr));
                        }
                        } />
                    <label htmlFor={`art-${onAttribute.att_name}`} style={getCheckboxStyle(sim === ESimilarity.Same)}>
                        {onAttribute.att_name}
                    </label>
                </div>)
        }

        return (
            <fieldset key={1} className="row" style={{ flexDirection: "column" }}>
                {checkboxes}
            </fieldset>
        )
    }
}

function getOptionSelector(selectedOption: [String, number], seed: IConfigurationSeed | undefined,
    setSelectedOption: Function): React.ReactNode {

    if (!seed) {
        return ("");
    } else {

        const items = [];
        items.push(
            <Button
                key={-1}
                content={noneSelectedName}
                state={noneSelectedName === selectedOption[0] ? EButtonState.active : EButtonState.unactive}
                onClick={
                    () => {
                        setSelectedOption([noneSelectedName, -1]);
                    }
                }
                extraClassName={"btn-dropdown"}
            />
        );

        for (let i = 0; i < seed.interaction_similarity_functions.length; i++) {
            const name = seed.interaction_similarity_functions[i].on_attribute.att_name;

            items.push(
                <Button
                    key={i}
                    content={`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
                    state={name === selectedOption[0] ? EButtonState.active : EButtonState.unactive}
                    onClick={
                        () => {
                            setSelectedOption([name, i]);
                        }
                    }
                    extraClassName={"btn-dropdown"}
                />
            );
        }
        return (
            <DropMenu
                items={items}
                content={`${selectedOption[0].charAt(0).toUpperCase()}${selectedOption[0].slice(1)}`}
                menuDirection={EDropMenuDirection.down}
                extraClassButton={"transparent down-arrow fixedWidth-10vw"}
            />);
    }
}


function getCheckboxStyle(hide: boolean): React.CSSProperties {

    const style: React.CSSProperties = {
        pointerEvents: hide ? "none" : "auto",
        opacity: hide ? "30%" : "100%",
        userSelect: "none"
    }

    return style;
}