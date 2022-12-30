/**
 * @fileoverview This File contains diferent interfaces used to validate a configuration tool seed and to create the
 * configuration json sent to the CM.
 * @author Marco Expósito Pérez
 */

export enum ESimilarity {
    Same,
    Similar,
    Different
}

export const noneSelectedName = "Select option";


//#region Seed interfaces
export interface IConfigurationSeed {
    artwork_attributes: ISimilarityFunction[];
    user_attributes: INameAndTypePair[];
    interaction_similarity_functions: ISimilarityFunction[];
}

export interface ISimilarityFunction {
    name: string;
    params: any[];
    on_attribute: INameAndTypePair;
    interaction_object: INameAndTypePair;
}

export interface INameAndTypePair {
    att_name: string,
    att_type: string,
}

//#endregion

//#region Create config file

export function createConfigurationFile(seed: IConfigurationSeed, citizenAttr: Map<string, boolean>, artworksAttr: Map<string, boolean>,
    selectedOption: [String, number], similarity1: ESimilarity, similarity2: ESimilarity, perspectiveName: string) {

    let newConfig: any = {
        user_attributes: [],
        interaction_similarity_functions: [],
        similarity_functions: []
    };

    fillUserAttributes(citizenAttr, newConfig);
    fillInteractionSimilarityFunctions(selectedOption, similarity1, seed, newConfig);
    fillSimilarityFunctions(similarity2, newConfig, seed, artworksAttr);

    let configName = perspectiveName.replaceAll(" ", "_");

    if (configName === "") {
        configName = getDefaultName(similarity1, configName, newConfig, seed, selectedOption, similarity2, artworksAttr);
    }

    newConfig["name"] = configName;
    newConfig["id"] = configName;

    newConfig["algorithm"] = {
        "name": "agglomerative",
        "params": []
    };

    return newConfig;
}

function getDefaultName(similarity1: ESimilarity, configName: string, newConfig: any, seed: IConfigurationSeed, selectedOption: [String, number], similarity2: ESimilarity, artworksAttr: Map<string, boolean>) {
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

    if (newConfig.interaction_similarity_functions.length !== 0)
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

    if (artwork_attributesName.length && similarity2 !== ESimilarity.Same)
        configName = configName + " (" + artwork_attributesName.join(", ") + ")";

    return configName;
}

function fillSimilarityFunctions(similarity2: ESimilarity, newConfig: any, seed: IConfigurationSeed, artworksAttr: Map<string, boolean>) {
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
                    });
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
                    });
                }
            });

            break;
        }
    }
}

function fillInteractionSimilarityFunctions(selectedOption: [String, number], similarity1: ESimilarity, seed: IConfigurationSeed, newConfig: any) {
    if (selectedOption[0] !== noneSelectedName) {
        switch (similarity1) {
            case ESimilarity.Same: {
                let obj = { sim_function: {} as any };
                obj.sim_function = JSON.parse(JSON.stringify(
                    seed.interaction_similarity_functions[selectedOption[1]]));

                obj.sim_function.name = "EqualSimilarityDAO";

                newConfig.interaction_similarity_functions.push(obj);
                break;
            }
            case ESimilarity.Similar: {
                let obj = { sim_function: {} as any };
                obj.sim_function = JSON.parse(JSON.stringify(
                    seed.interaction_similarity_functions[selectedOption[1]]));

                newConfig.interaction_similarity_functions.push(obj);

                break;
            }
            case ESimilarity.Different: {
                let obj = { sim_function: {} as any };
                obj.sim_function = JSON.parse(JSON.stringify(
                    seed.interaction_similarity_functions[selectedOption[1]]));
                obj.sim_function.dissimilar = true;
                newConfig.interaction_similarity_functions.push(obj);

                break;
            }
        }
    }
}

function fillUserAttributes(citizenAttr: Map<string, boolean>, newConfig: any) {
    citizenAttr.forEach((value, key) => {
        if (value) {
            newConfig.user_attributes.push({
                att_name: key,
                att_type: "String"
            });
        }
    });
}


//#endregion