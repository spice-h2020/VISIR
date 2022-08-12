const checkSimilarityFunctions = false; //FOR DEBUG WITH TESTING DATAFILES

//Data that containts the info of all perspectives together
export interface AllPerspectives {
    files: PerspectiveInfo[];
}

export interface PerspectiveInfo {
    id: number;
    name: string;
    algorithm: Algorithm;
    similarity_functions: simFunction[];
}

export interface Algorithm {
    name: string;
    params: any[];
}

export interface simFunction {
    name: string;
    params: any[];
    onAttribute: onAttribute[];
    weight: number;
}

export interface onAttribute {
    name: string;
    type: string;
}

export function validateAllPerspectivesFile(arg: any): AllPerspectives {
    try {
        if (!arg) {
            throw Error(`All perspectives file is undefined`);
        }

        if (!arg.files) {
            throw Error(`Files of Allperspectives file is undefined`);
        }

        if (typeof (arg.files) !== "object") {
            throw Error(`Files of Allperspectives file is not an object`);
        }

        for (let i = 0; i < arg.files.length; i++) {
            if (!arg.files[i].perspective) {
                throw Error(`A perspective of Allperspectives file is undefined`);
            }

            if (typeof (arg.files[i].perspective) !== "object") {
                throw Error(`A perspective of Allperspectives file is not an object`);
            }

            arg.files[i] = isPerspectiveInfoValid(arg.files[i].perspective);
        }

        return arg;
    } catch (e: any) {
        throw Error(`All perspectives file is not valid: ${e.message}`);
    }
}

export function isPerspectiveInfoValid(arg: any): PerspectiveInfo {
    try {
        if (!arg.id) {
            throw Error(`ID of the perspective is undefined`);
        }

        if (typeof (arg.id) !== "number") {
            arg.id = Number(arg.id);

            if (arg.id === NaN)
                throw Error(`ID of the perspective (${arg.id}) is not a number`);
        }

        if (!arg.name) {
            throw Error(`Name of the perspective (${arg.id}) is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the perspective (${arg.id}) is not a string`);
            }
        }

        if (!arg.algorithm) {
            throw Error(`Algorithms of the perspective (${arg.id}) is undefined`);
        }

        if (typeof (arg.algorithm) !== "object") {
            throw Error(`Algorithms of the perspective (${arg.id}) is not an object`);
        }

        arg.algorithm = isAlgorithmValid(arg.algorithm);

        if (checkSimilarityFunctions) {
            if (!arg.similarity_functions) {
                throw Error(`Similarity functions of the perspective (${arg.id}) is undefined`);
            }

            if (typeof (arg.similarity_functions) !== "object") {
                throw Error(`Similarity functions of the perspective (${arg.id}) is not an object`);
            }

            for (let i = 0; i < arg.similarity_functions.length; i++) {
                if (!arg.similarity_functions[i].sim_function) {
                    throw Error(`A Sim function of the perspective (${arg.id}) is undefined`);
                }

                if (typeof (arg.similarity_functions[i].sim_function) !== "object") {
                    throw Error(`A Sim function of the perspective (${arg.id}) is not an object`);
                }

                isSimilarityFunctionValid(arg.similarity_functions[i].sim_function);
            }
        }

        return arg;
    } catch (e: any) {
        throw Error(`PerspectiveInfo is not valid: ${e.message}`);
    }
}

function isAlgorithmValid(arg: any) : Algorithm{
    try {
        if (!arg.name) {
            throw Error(`Name of the algorithm is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the algorithm (${arg.name}) is not a string`);
            }
        }

        if (!arg.params) {
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


function isSimilarityFunctionValid(arg: any) {
    try {
        if (!arg.name) {
            throw Error(`Name of the Similarity function is undefined`);
        }

        if (typeof (arg.name) !== "string") {
            try {
                arg.name = String(arg.name);
            } catch (e: any) {
                throw Error(`Name of the Similarity function (${arg.name}) is not a string`);
            }
        }

        if (!arg.params) {
            throw Error(`Params of the Similarity function (${arg.name}) is undefined`);
        }

        if (typeof (arg.params) !== "object") {
            throw Error(`Params of the Similarity function (${arg.name}) is not an object`);
        }

        if (!arg.on_attribute) {
            throw Error(`onAttribute of the Similarity function (${arg.name}) is undefined`);
        }

        if (typeof (arg.on_attribute) !== "object") {
            throw Error(`onAttribute of the Similarity function (${arg.name}) is not an object`);
        }

        if (!arg.weight) {
            throw Error(`Weight of the Similarity function (${arg.name}) is undefined`);
        }

        if (typeof (arg.weight) !== "number") {
            arg.weight = Number(arg.weight);

            if (arg.weight === NaN)
                throw Error(`Weight of the Similarity function (${arg.name}) is not a number`);

        }

        isOnAttributeValid(arg.on_attribute);


    } catch (e: any) {
        throw Error(`Similarity function is not valid: ${e.message}`);
    }
}

function isOnAttributeValid(arg: any) {
    try {
        if (!arg.att_name) {
            throw Error(`Att_name of the OnAttribute is undefined`);
        }

        if (typeof (arg.att_name) !== "string") {
            try {
                arg.att_name = String(arg.att_name);
            } catch (e: any) {
                throw Error(`Att_name of the OnAttribute (${arg.att_name}) is not a string`);
            }
        }

        if (!arg.att_type) {
            throw Error(`Att_type of the OnAttribute is undefined`);
        }

        if (typeof (arg.att_type) !== "string") {
            try {
                arg.att_type = String(arg.att_type);
            } catch (e: any) {
                throw Error(`Att_type of the OnAttribute (${arg.att_type}) is not a string`);
            }


        }

    } catch (e: any) {
        throw Error(`OnAttribute is not valid: ${e.message}`);
    }
}