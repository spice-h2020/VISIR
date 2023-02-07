/**
 * @fileoverview This file contains 2 functions to validate Files already parsed to JSON. One function for a file with All perspectives details, 
 * and one for a file with the data of a single perspective.
 * @author Marco Expósito Pérez
 */
//Constants
import { FORMERR } from "dns";
import { IAlgorithm, IArtworkAttribute, IConfigurationSeed, INameAndIdPair, INameAndTypePair, ISimilarityFunction } from "./ConfigToolUtils";
import { edgeConst } from "./edges";
import * as types from "./perspectivesTypes";
import { ECommunityType } from "./perspectivesTypes";

//#region All perspectives JSON

/**
 * Validate a JSON with all the perspectives info of all available perspectives
 * @param arg JSON with the data
 * @returns {types.PerspectiveDetails} returns the JSON parsed as a proper TS class
 */
export function validatePerspectiveIDfile(arg: any): types.PerspectiveId[] {
    try {
        if (arg === undefined) {
            throw Error(`Perspectives Ids and names file is undefined`);
        }

        if (typeof (arg) !== "object") {
            throw Error(`Perspectives Ids and names file is not an object nor array`);
        }

        if (arg.length === undefined || arg.length <= 0) {
            arg.length = 0;
        }

        for (let i = 0; i < arg.length; i++) {
            if (arg[i] === undefined) {
                throw Error(`A perspective of the perspective IDs file is undefined`);
            }

            if (typeof (arg[i]) !== "object") {
                throw Error(`A perspective of the perspective IDs file is not an object`);
            }

            if (arg[i].id === undefined) {
                throw Error(`A perspective Id of the perspective IDs file is undefined`);
            }

            if (typeof (arg[i].id) !== "string") {
                try {
                    arg[i].id = String(arg[i].id);
                } catch (e: any) {
                    throw Error(`A perspective Id of the perspective IDs file is not a string`);
                }
            }

            if (arg[i].name === undefined || typeof (arg[i].name) !== "string") {
                arg[i].name = arg[i].id;
            }

            arg[i].isActive = types.PerspectiveActiveState.unactive;
        }

        console.log(`Perspective IDs file validation has been completed -> `);
        console.log(arg as types.PerspectiveId[]);

        return arg;
    } catch (e: any) {
        throw Error(`Perspective IDs file is not valid: ${e.message}`);
    }
}

//#endregion

//#region Perspective Data JSON

/**
 * Validate a JSON with all the data to create the perspective network
 * @param arg JSON with the data
 * @returns {types.IPerspectiveData} returns the file parsed as a proper TS class
 */
export function validatePerspectiveDataJSON(arg: any): types.IPerspectiveData {
    try {
        if (arg === undefined) {
            throw Error(`Perspective network data is undefined`);
        }

        if (arg.communities === undefined) {
            throw Error(`Communities is undefined`);
        }

        if (typeof (arg.communities) !== "object") {
            throw Error(`Communities is not an object`);
        }

        if (arg.users === undefined) {
            throw Error(`Users is undefined`);
        }

        if (typeof (arg.users) !== "object") {
            throw Error(`Users is not an object`);
        }

        if (arg.similarity === undefined) {
            throw Error(`Similarity is undefined`);
        }

        if (typeof (arg.similarity) !== "object") {
            throw Error(`Similarity is not an object`);
        }

        if (arg.artworks === undefined) {
            throw Error(`Artworks is undefined`);
        }

        if (typeof (arg.artworks) !== "object") {
            throw Error(`Artworks is not an object`);
        }

        for (let i = 0; i < arg.communities.length; i++) {
            arg.communities[i] = isCommunityDataValid(arg.communities[i]);
        }
        for (let i = 0; i < arg.users.length; i++) {
            arg.users[i] = isUserDataValid(arg.users[i]);
        }
        for (let i = arg.similarity.length - 1; i >= 0; --i) {
            const edge = isSimilarityDataValid(arg.similarity[i]);

            if (edge === undefined) {
                delete arg.similarity[i];
            } else {
                arg.similarity[i].id = i;
            }
        }
        for (let i = 0; i < arg.artworks.length; i++) {
            arg.artworks[i] = isArtworkDataValid(arg.artworks[i]);
        }

        console.log(`Perspective file validation has been completed -> `);
        console.log(arg as types.IPerspectiveData);

        return arg;

    } catch (e: any) {
        throw Error(`Perspective network data file is not valid: ${e.message}`);
    }
}

function isCommunityDataValid(arg: any): types.ICommunityData {
    try {

        if (arg.id === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.id) !== "string") {
            try {
                arg.id = String(arg.id);
            } catch (e: any) {
                throw Error(`Id of the community (${arg.id}) is not a string`);
            }
        }

        if (arg.name === undefined) {
            throw Error(`Name of the community (${arg.id}) is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the community (${arg.id}) is not a string`);
            }
        }

        if (arg.explanations === undefined) {
            throw Error(`Explanations of the community (${arg.id}) are undefined`);
        }
        if (typeof (arg.explanations) !== "object") {
            throw Error(`Explanations of the community (${arg.id}) are not an object or an array`);
        }

        if (arg.users === undefined) {
            throw Error(`Users of the community (${arg.id}) is undefined`);
        }

        if (typeof (arg.users) !== "object") {
            throw Error(`Users of the community (${arg.id}) is not an object`);
        }

        if (arg.users.length === 0) {
            throw Error(`Users.length of the community (${arg.id}) is equal to 0`);
        }

        for (let i = 0; i < arg.explanations.length; i++) {
            arg.explanations[i] = isCommunityExplanationValid(arg.explanations[i]);
        }

        arg.explanations.sort((v1: types.ICommunityExplanation, v2: types.ICommunityExplanation) => v1.order - v2.order)

        if (arg["community-type"] === undefined) {
            arg.type = ECommunityType.inexistent;

        } else {
            if (typeof (arg["community-type"]) !== "string") {
                try {
                    arg["community-type"] = String(arg["community-type"]);
                } catch (e: any) {
                    throw Error(`Community type of the community (${arg.id}) is not a string`);
                }
            }

            arg.type = ECommunityType[arg["community-type"]];
            if (arg.type === undefined) {
                arg.type = ECommunityType.implicit;
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`Community data is not valid: ${e.message}`);
    }
}
function isCommunityExplanationValid(arg: any): types.ICommunityExplanation {
    try {
        if (arg.explanation_type === undefined) {
            throw Error(`Explanation_type is undefined`);
        }
        if (typeof (arg.explanation_type) !== "string") {
            try {
                arg.explanation_type = String(arg.explanation_type);
            } catch (e: any) {
                throw Error(`Explanation_type is not a string`);
            }
        }
        arg.explanation_type = types.EExplanationTypes[arg.explanation_type];

        //Explicit attributes doesnt require a validation
        if (arg.explanation_type !== types.EExplanationTypes.explicit_attributes) {
            if (arg.explanation_data === undefined) {
                throw Error(`Explanation_data is undefined`);
            }
            if (typeof (arg.explanation_data) !== "object") {
                throw Error(`Explanation_data is not an object or an array`);
            }

            if (arg.visible === undefined) {
                arg.visible = false;
            } else {
                if (typeof (arg.visible) !== "boolean") {
                    throw Error(`Visible is not a boolean`);
                }
            }

            switch (arg.explanation_type) {
                case types.EExplanationTypes.medoid: {
                    arg = isMedoidExplanationValid(arg);
                    arg.order = 2;
                    break;
                }
                case types.EExplanationTypes.implicit_attributes: {
                    arg = isImplicitAttributesExplanationValid(arg);
                    arg.order = 1;
                    break;
                }
            }
        } else {
            arg.order = 0;
        }

        return arg;

    } catch (e: any) {
        throw Error(`Community explanation is not valid: ${e.message}`);
    }
}

function isMedoidExplanationValid(arg: any): types.ICommunityExplanation {
    try {
        if (arg.explanation_data.id === undefined) {
            throw Error(`Medoid ID is undefined`);
        }
        if (typeof (arg.explanation_data.id) !== "string") {
            try {
                arg.explanation_data.id = String(arg.explanation_data.id);
            } catch (e: any) {
                throw Error(`Medoid ID is not a string`);
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`Community Medoid explanation is not valid: ${e.message}`);
    }
}

function isImplicitAttributesExplanationValid(arg: any): types.ICommunityExplanation {
    try {
        if (arg.explanation_data.label === undefined) {
            throw Error(`Label text is undefined`);
        }
        if (typeof (arg.explanation_data.label) !== "string") {
            try {
                arg.explanation_data.label = String(arg.explanation_data.label);
            } catch (e: any) {
                throw Error(`Label text is not a string`);
            }
        }

        if (arg.explanation_data.data === undefined) {
            throw Error(`Data attribute is undefined`);
        }
        if (typeof (arg.explanation_data.data) !== "object") {
            throw Error(`Data attribute is not an object`);
        }

        if (arg.explanation_data.accordionMode === undefined) {
            arg.explanation_data.accordionMode = false;

            const keys = Object.keys(arg.explanation_data.data);
            const newData: types.IStringNumberRelation[] = [];

            for (let i = 0; i < keys.length; i++) {
                const newCount = Number(arg.explanation_data.data[keys[i]].toFixed(2));

                if (keys[i] === "") {
                    keys[i] = "(empty)"
                }

                newData.push({
                    value: keys[i],
                    count: newCount
                });
            }

            arg.explanation_data.data = newData;
        }

        return arg;
    } catch (e: any) {
        throw Error(`Community Implicit Attributes explanation is not valid: ${e.message}`);
    }
}


function isUserDataValid(arg: any): types.IUserData {
    try {

        if (arg.id === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.id) !== "string") {
            try {
                arg.id = String(arg.id);
            } catch (e: any) {
                throw Error(`Id of the user (${arg.id}) is not a string`);
            }
        }

        if (arg.label === undefined) {
            throw Error(`Label of the user (${arg.id}) is undefined`);
        }

        if (typeof (arg.label) !== "string") {
            try {
                arg.label = String(arg.label);
            } catch (e: any) {
                throw Error(`Label of the user (${arg.id}) is not a string`);
            }
        }

        if (arg.group === undefined) {
            throw Error(`Group of the user (${arg.id}) is undefined`);
        }

        if (typeof (arg.group) !== "number") {
            arg.group = Number(arg.group);

            if (isNaN(arg.group))
                throw Error(`Group of the user (${arg.id}) is not a number`);
        }

        arg.implicit_community = arg.group;
        delete arg.group;

        if (arg.explicit_community === undefined) {
            arg.explicit_community = {};
        }

        if (typeof (arg.explicit_community) !== "object") {
            throw Error(`Explicit community of the user (${arg.id}) is not an object. There may not be any explicit community values`);
        }

        const keys = Object.keys(arg.explicit_community);
        for (let i = 0; i < keys.length; ++i) {
            if (arg.explicit_community[keys[i]] === "") {
                arg.explicit_community[keys[i]] = "(empty)";
            }
        }

        if (arg.community_interactions === undefined) {
            arg.community_interactions = [];
        }

        const nCommInteractions = Object.keys(arg.community_interactions).length;
        if (nCommInteractions > 0) {

            try {
                for (let i = 0; i < nCommInteractions; i++) {
                    arg.community_interactions[i] = isInteractionValid(arg.community_interactions[i]);
                }
            } catch (e: any) {
                throw Error(`Community interaction of the user (${arg.id}) has problems: ${e.message}`);
            }

        }

        if (arg.no_community_interactions === undefined) {
            arg.no_community_interactions = [];
        }

        const nNoCommInteractions = Object.keys(arg.no_community_interactions).length;
        if (nNoCommInteractions > 0) {

            try {
                for (let i = 0; i < nNoCommInteractions; i++) {
                    arg.no_community_interactions[i] = isInteractionValid(arg.no_community_interactions[i]);
                }
            } catch (e: any) {
                throw Error(`No-community interaction of the user (${arg.id}) has problems: ${e.message}`);
            }
        }

        return arg;

    } catch (e: any) {
        throw Error(`User data is not valid: ${e.message}`);
    }
}

function isInteractionValid(arg: any): types.IInteraction {
    try {

        if (arg.artwork_id === undefined) {
            throw Error(`Artwork_id of an interaction is undefined`);
        }

        if (typeof (arg.artwork_id) !== "string") {
            try {
                arg.artwork_id = String(arg.artwork_id);
            } catch (e: any) {
                throw Error(`Artwork_id of (${arg.artwork_id}) is not a string`);
            }
        }

        if (arg.feelings === undefined) {
            arg.feelings = "";
        } else if (typeof (arg.feelings) !== "string") {
            try {
                arg.feelings = String(arg.feelings);
            } catch (e: any) {
                throw Error(`Feelings of the artwork whose id is (${arg.artwork_id}) is not a string`);
            }
        }

        if (arg.extracted_emotions !== undefined) {
            try {
                const array: types.IStringNumberRelation[] = [];
                const keys = Object.keys(arg.extracted_emotions);

                for (let i = 0; i < keys.length; i++) {
                    array.push({
                        value: keys[i],
                        count: arg.extracted_emotions[keys[i]]
                    });
                }

                arg.extracted_emotions = array;
            } catch (e: any) {
                throw Error(`Error while trying to parse extracted emotions data: ${e.message}`);
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`Interaction data is not valid: ${e.message}`);
    }
}

function isSimilarityDataValid(arg: any): types.IEdgeData | undefined {
    try {

        if (arg.value === undefined) {
            throw Error(`Value is undefined`);
        }

        if (typeof (arg.value) !== "number") {
            arg.value = Number(arg.value);

            if (isNaN(arg.value))
                throw Error(`Value is not a number`);
        }

        arg.similarity = arg.value;
        delete arg.value;

        if (arg.u1 === undefined) {
            throw Error(`U1 of the edge with value (${arg.value}) is undefined`);
        }

        if (typeof (arg.u1) !== "string") {
            try {
                arg.u1 = String(arg.u1);
            } catch (e: any) {
                throw Error(`U1 of the edge with value (${arg.value}) is not a string`);
            }
        }

        arg.from = arg.u1;
        delete arg.u1;

        if (arg.u2 === undefined) {
            throw Error(`U2 of the edge with value (${arg.value}) is undefined`);
        }

        if (typeof (arg.u2) !== "string") {
            try {
                arg.u2 = String(arg.u2);
            } catch (e: any) {
                throw Error(`U2 of the edge with value (${arg.value}) is not a string`);
            }
        }

        arg.to = arg.u2;
        delete arg.u2;

        if (edgeConst.allowLabels)
            arg.label = arg.value.toString();

        if (arg.to === arg.from) {
            return undefined;
        } else {
            return arg;
        }

    } catch (e: any) {
        throw Error(`Edge data is not valid: ${e.message}`);
    }
}

function isArtworkDataValid(arg: any): types.IArtworkData {
    try {

        if (arg.id === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.id) !== "string") {
            try {
                arg.id = String(arg.id);
            } catch (e: any) {
                throw Error(`Id of the artwork (${arg.id}) is not a string`);
            }
        }

        if (arg.tittle === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.tittle) !== "string") {
            try {
                arg.tittle = String(arg.tittle);
            } catch (e: any) {
                throw Error(`Tittle of the artwork (${arg.id}) is not a string`);
            }
        }

        if (arg.author === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.author) !== "string") {
            try {
                arg.author = String(arg.author);
            } catch (e: any) {
                throw Error(`Author of the artwork (${arg.id}) is not a string`);
            }
        }

        if (arg.year === undefined) {
            throw Error(`Year is undefined`);
        }

        if (typeof (arg.year) !== "string") {
            try {
                arg.year = String(arg.year);
            } catch (e: any) {
                throw Error(`Year of the artwork (${arg.year}) is not a string`);
            }
        }

        if (arg.image === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.image) !== "string") {
            try {
                arg.image = String(arg.image);
            } catch (e: any) {
                throw Error(`Image of the artwork (${arg.id}) is not a string`);
            }
        }

        arg.image = decodeURIComponent(decodeURIComponent(arg.image))

        return arg;

    } catch (e: any) {
        throw Error(`Artwork data is not valid: ${e.message}`);
    }
}

//#endregion 

//#region Configuration Seed

export function validateConfigurationSeed(arg: any): IConfigurationSeed {
    try {
        if (arg === undefined) {
            throw Error(`Configuration Seed is undefined`);
        }

        if (arg.artwork_attributes === undefined) {
            throw Error(`Artwork attributes are undefined`);
        }

        if (typeof (arg.artwork_attributes) !== "object") {
            throw Error(`Artwork attributes are not an object`);
        }

        if (arg.user_attributes === undefined) {
            throw Error(`User attributes are undefined`);
        }

        if (typeof (arg.user_attributes) !== "object") {
            throw Error(`User attributes are not an object`);
        }

        if (arg.interaction_similarity_functions === undefined) {
            throw Error(`Interactions Similarity Functions are undefined`);
        }

        if (typeof (arg.interaction_similarity_functions) !== "object") {
            throw Error(`Interactions Similarity Functions are not an object`);
        }

        if (arg.algorithm === undefined) {
            throw Error(`Algorithms are undefined`);
        }

        if (typeof (arg.algorithm) !== "object") {
            throw Error(`Algorithms are not an object`);
        }

        if (arg.artworks === undefined) {
            throw Error(`Artworks are undefined`);
        }

        if (typeof (arg.artworks) !== "object") {
            throw Error(`Artworks are not an object`);
        }


        for (let i = 0; i < arg.artwork_attributes.length; i++) {
            arg.artwork_attributes[i] = isArtworkAttributesValid(arg.artwork_attributes[i]);
        }
        for (let i = 0; i < arg.user_attributes.length; i++) {
            arg.user_attributes[i] = isNameAndTypePairValid(arg.user_attributes[i]);
        }
        for (let i = 0; i < arg.interaction_similarity_functions.length; i++) {
            arg.interaction_similarity_functions[i] = isInteractSimFuncsValid(arg.interaction_similarity_functions[i]);
        }
        for (let i = 0; i < arg.algorithm.length; i++) {
            arg.algorithm[i] = isAlgorithmValid(arg.algorithm[i]);
        }
        for (let i = 0; i < arg.artworks.length; i++) {
            arg.artworks[i] = isNameAndIdPairValid(arg.artworks[i]);
        }

        console.log(`Configuration seed file validation has been completed -> `);
        console.log(arg as IConfigurationSeed);

        return arg;
    } catch (e: any) {
        throw Error(`Configuration Seed file is not valid: ${e.message}`);
    }
}

function isArtworkAttributesValid(arg: any): IArtworkAttribute {
    try {
        if (arg.on_attribute === undefined) {
            throw Error(`Onattribute of the sim function (${arg.arg.name}) is undefined`);
        }

        if (typeof (arg.on_attribute) !== "object") {
            throw Error(`Onattribute of the sim function (${arg.arg.name}) is not an object`);
        }

        arg.on_attribute = isNameAndTypePairValid(arg.on_attribute);

        if (arg.sim_function === undefined) {
            throw Error(`sim function is undefined`);
        }
        if (typeof (arg.sim_function) !== "object") {
            throw Error(`sim function is not an object`);
        }

        for (let i = 0; i < arg.sim_function.length; i++) {
            arg.sim_function[i] = isAlgorithmValid(arg.sim_function[i]);
        }

        return arg;
    } catch (e: any) {
        throw Error(`artwork attribute data data is not valid: ${e.message}`);
    }
}

function isNameAndTypePairValid(arg: any): INameAndTypePair {
    try {

        if (arg === undefined) {
            throw Error(`Name and Type data is undefined`);
        }

        if (arg.att_name === undefined) {
            throw Error(`Att name is undefined`);
        }
        if (typeof (arg.att_name) !== "string") {
            try {
                arg.att_name = String(arg.att_name);
            } catch (e: any) {
                throw Error(`Att name is not a string`);
            }
        }

        if (arg.att_type === undefined) {
            throw Error(`Att type is undefined`);
        }
        if (typeof (arg.att_type) !== "string") {
            try {
                arg.att_type = String(arg.att_type);
            } catch (e: any) {
                throw Error(`Att type is not a string`);
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`Name and Type data is not valid: ${e.message}`);
    }
}

function isNameAndIdPairValid(arg: any): INameAndIdPair {
    try {

        if (arg === undefined) {
            throw Error(`Name and ID data is undefined`);
        }

        if (arg.name === undefined) {
            throw Error(`Name is undefined`);
        }
        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name is not a string`);
            }
        }

        if (arg.id === undefined) {
            throw Error(`Id is undefined`);
        }
        if (typeof (arg.id) !== "string") {
            try {
                arg.id = String(arg.id);
            } catch (e: any) {
                throw Error(`Id is not a string`);
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`Name and id data is not valid: ${e.message}`);
    }
}

function isInteractSimFuncsValid(arg: any): ISimilarityFunction {
    try {

        if (arg.sim_function === undefined) {
            throw Error(`Sim function is undefined`);
        }

        arg = arg.sim_function;

        if (arg.name === undefined) {
            throw Error(`Name is undefined`);
        }
        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name is not a string`);
            }
        }

        if (arg.params === undefined) {
            arg.params = [];
        }

        if (arg.on_attribute === undefined) {
            throw Error(`Onattribute of the sim function (${arg.name}) is undefined`);
        }

        if (typeof (arg.on_attribute) !== "object") {
            throw Error(`Onattribute of the sim function (${arg.name}) is not an object`);
        }

        arg.on_attribute = isNameAndTypePairValid(arg.on_attribute);

        if (arg.interaction_object === undefined) {
            throw Error(`interaction_object of the sim function (${arg.name}) is undefined`);
        }
        if (typeof (arg.interaction_object) !== "object") {
            throw Error(`interaction_object of the sim function (${arg.name}) is not an object`);
        }

        arg.interaction_object = isNameAndTypePairValid(arg.interaction_object);

        return arg;
    } catch (e: any) {
        throw Error(`Interaction similarity function data is not valid: ${e.message}`);
    }
}

function isAlgorithmValid(arg: any): IAlgorithm {
    try {

        if (arg.name === undefined) {
            throw Error(`Name is undefined`);
        }
        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name is not a string`);
            }
        }

        if (arg.params === undefined) {
            arg.params = [];
        }

        if (arg.default === undefined) {
            arg.default = false;
        }

        return arg;
    } catch (e: any) {
        throw Error(`Algorythm data is not valid: ${e.message}`);
    }
}
//#endregion
