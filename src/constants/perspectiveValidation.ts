/**
 * @fileoverview This file contains 2 functions to validate Files already parsed to JSON. One function for a file with All perspectives details, 
 * and one for a file with the data of a single perspective
 * @author Marco Expósito Pérez
 */
//Constants
import * as types from "./perspectivesTypes";

const checkSimilarityFunctions = true; //FOR DEBUG WITH TESTING DATAFILES if active, will validate the similarity options 

//#region All perspectives JSON

/**
 * Validate a JSON with all the perspectives info of all available perspectives
 * @param arg JSON with the data
 * @returns {types.PerspectiveDetails} returns the JSON parsed as a proper TS class
 */
export function validateAllPerspectivesDetailsJSON(arg: any): types.PerspectiveDetails[] {
    try {
        if (arg === undefined) {
            throw Error(`All perspectives file is undefined`);
        }

        if (typeof (arg) !== "object") {
            throw Error(`All perspectives file is not an object`);
        }

        if (arg.length === undefined || arg.length <= 0) {
            throw Error(`All perspectives file does not have any perspective`);
        }

        for (let i = 0; i < arg.length; i++) {
            if (arg[i] === undefined) {
                throw Error(`A perspective of Allperspectives file is undefined`);
            }

            if (typeof (arg[i]) !== "object") {
                throw Error(`A perspective of Allperspectives file is not an object`);
            }

            arg[i] = isPerspectiveInfoValid(arg[i]);
        }

        console.log(`All perspectives file validation has been completed -> `);
        console.log(arg as types.PerspectiveDetails[]);

        return arg;
    } catch (e: any) {
        throw Error(`All perspectives file is not valid: ${e.message}`);
    }

    
}

function isPerspectiveInfoValid(arg: any): types.PerspectiveDetails {
    try {
        if (arg.id === undefined) {
            throw Error(`ID of the perspective is undefined`);
        }

        if (typeof (arg.id) !== "number") {
            arg.id = Number(arg.id);

            if (isNaN(arg.id))
                throw Error(`ID of the perspective (${arg.id}) is not a number`);
        }

        if (arg.name === undefined) {
            throw Error(`Name of the perspective (${arg.id}) is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the perspective (${arg.id}) is not a string`);
            }
        }

        if (arg.algorithm === undefined) {
            throw Error(`Algorithms of the perspective (${arg.id}) is undefined`);
        }

        if (typeof (arg.algorithm) !== "object") {
            throw Error(`Algorithms of the perspective (${arg.id}) is not an object`);
        }

        arg.algorithm = isAlgorithmValid(arg.algorithm);

        if (checkSimilarityFunctions) {
            if (arg.similarity_functions === undefined) {
                throw Error(`Similarity functions of the perspective (${arg.id}) is undefined`);
            }

            if (typeof (arg.similarity_functions) !== "object") {
                throw Error(`Similarity functions of the perspective (${arg.id}) is not an object`);
            }

            for (let i = 0; i < arg.similarity_functions.length; i++) {
                if (arg.similarity_functions[i].sim_function === undefined) {
                    throw Error(`A Sim function of the perspective (${arg.id}) is undefined`);
                }

                if (typeof (arg.similarity_functions[i].sim_function) !== "object") {
                    throw Error(`A Sim function of the perspective (${arg.id}) is not an object`);
                }

                arg.similarity_functions[i].sim_function = isSimilarityFunctionValid(arg.similarity_functions[i].sim_function);
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`PerspectiveInfo is not valid: ${e.message}`);
    }
}

function isAlgorithmValid(arg: any): types.PerspectiveAlgorithm {
    try {
        if (arg.name === undefined) {
            throw Error(`Name of the algorithm is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the algorithm (${arg.name}) is not a string`);
            }
        }

        if (arg.params === undefined) {
            throw Error(`Params of the algorithm (${arg.name}) is undefined`);
        }

        if (typeof (arg.params) !== "object") {
            throw Error(`Params of the algorithm (${arg.name}) is not an object`);
        }

        return arg;

    } catch (e: any) {
        throw Error(`Algorithm is not valid: ${e.message}`);
    }
}


function isSimilarityFunctionValid(arg: any): types.SimFunction {
    try {
        if (arg.name === undefined) {
            throw Error(`Name of the Similarity function is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the Similarity function (${arg.name}) is not a string`);
            }
        }

        if (arg.params === undefined) {
            throw Error(`Params of the Similarity function (${arg.name}) is undefined`);
        }

        if (typeof (arg.params) !== "object") {
            throw Error(`Params of the Similarity function (${arg.name}) is not an object`);
        }

        if (arg.on_attribute === undefined) {
            throw Error(`onAttribute of the Similarity function (${arg.name}) is undefined`);
        }

        if (typeof (arg.on_attribute) !== "object") {
            throw Error(`onAttribute of the Similarity function (${arg.name}) is not an object`);
        }

        if (arg.weight === undefined) {
            throw Error(`Weight of the Similarity function (${arg.name}) is undefined`);
        }

        if (typeof (arg.weight) !== "number") {
            arg.weight = Number(arg.weight);

            if (isNaN(arg.weight))
                throw Error(`Weight of the Similarity function (${arg.name}) is not a number`);

        }

        arg.on_attribute = isOnAttributeValid(arg.on_attribute);

        return arg;

    } catch (e: any) {
        throw Error(`Similarity function is not valid: ${e.message}`);
    }
}

function isOnAttributeValid(arg: any): types.OnAttribute {
    try {
        if (arg.att_name === undefined) {
            throw Error(`Att_name of the OnAttribute is undefined`);
        }

        if (typeof (arg.att_name) !== "string") {
            try {
                arg.att_name = String(arg.att_name);
            } catch (e: any) {
                throw Error(`Att_name of the OnAttribute (${arg.att_name}) is not a string`);
            }
        }

        if (arg.att_type === undefined) {
            throw Error(`Att_type of the OnAttribute is undefined`);
        }

        if (typeof (arg.att_type) !== "string") {
            try {
                arg.att_type = String(arg.att_type);
            } catch (e: any) {
                throw Error(`Att_type of the OnAttribute (${arg.att_type}) is not a string`);
            }
        }

        return arg;

    } catch (e: any) {
        throw Error(`OnAttribute is not valid: ${e.message}`);
    }
}
//#endregion

//#region Perspective Data JSON

/**
 * Validate a JSON with all the data to create the perspective network
 * @param arg JSON with the data
 * @returns {types.PerspectiveData} returns the file parsed as a proper TS class
 */
export function validatePerspectiveDataJSON(arg: any): types.PerspectiveData {
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

        for (let i = 0; i < arg.communities.length; i++) {
            arg.communities[i] = isCommunityDataValid(arg.communities[i]);
        }
        for (let i = 0; i < arg.users.length; i++) {
            arg.users[i] = isUserDataValid(arg.users[i]);
        }
        for (let i = 0; i < arg.similarity.length; i++) {
            arg.similarity[i] = isSimilarityDataValid(arg.similarity[i]);
            arg.similarity[i].id = i;
        }

        console.log(`Perspective file validation has been completed -> `);
        console.log(arg as types.PerspectiveData);

        return arg;

    } catch (e: any) {
        throw Error(`Perspective network data file is not valid: ${e.message}`);
    }
}

function isCommunityDataValid(arg: any): types.CommunityData {
    try {

        if (arg.id === undefined) {
            throw Error(`Id is undefined`);
        }

        if (typeof (arg.id) !== "number") {
            arg.id = Number(arg.id);

            if (isNaN(arg.id))
                throw Error(`ID of the community (${arg.id}) is not a number`);
        }

        if (arg["community-type"] === undefined) {
            throw Error(`Community-type of the community (${arg.id}) is undefined`);
        }

        if (typeof (arg["community-type"]) !== "string") {
            try {
                arg["community-type"] = String(arg["community-type"]);
            } catch (e: any) {
                throw Error(`Community-type of the community (${arg.id}) is not a string`);
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

        if (arg.explanation === undefined) {
            throw Error(`Explanation of the community (${arg.id}) is undefined`);
        }

        if (typeof (arg.explanation) !== "string") {
            try {
                arg.explanation = String(arg.explanation);
            } catch (e: any) {
                throw Error(`Explanation of the community (${arg.id}) is not a string`);
            }
        }

        if (arg.users === undefined) {
            throw Error(`Users of the community (${arg.id}) is undefined`);
        }

        if (typeof (arg.users) !== "object") {
            throw Error(`Users of the community (${arg.id}) is not an object`);
        }

        return arg;

    } catch (e: any) {
        throw Error(`Community data is not valid: ${e.message}`);
    }
}

function isUserDataValid(arg: any): types.UserData {
    try {

        if (arg.id === undefined) {
            throw Error(`Id is undefined`);
        }

        
        if (typeof (arg.id) !== "string") {
            try {
                arg.id = String(arg.id);
            } catch (e: any) {
                throw Error(`Label of the user (${arg.id}) is not a string`);
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
            throw Error(`Explicit community of the user (${arg.id}) is undefined`);
        }

        if (typeof (arg.explicit_community) !== "object") {
            throw Error(`Explicit community of the user (${arg.id}) is not an object. There may not be any explicit community values`);
        }

        return arg;

    } catch (e: any) {
        throw Error(`User data is not valid: ${e.message}`);
    }
}

function isSimilarityDataValid(arg: any): types.EdgeData {
    try {

        if (arg.value === undefined) {
            throw Error(`Value is undefined`);
        }

        if (typeof (arg.value) !== "number") {
            arg.value = Number(arg.ivalued);

            if (isNaN(arg.value))
                throw Error(`Value is not a number`);
        }

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

        arg.label = arg.value.toString();

        return arg;

    } catch (e: any) {
        throw Error(`Edge data is not valid: ${e.message}`);
    }
}

//#endregion 


