/**
 * @fileoverview This File contains diferent unrelated auxiliary classes/interfaces that doesnt belong to a specific file
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Package
import { Dispatch } from "react";
import { DimAttribute } from "./nodes";
//Local files
import { anyProperty, ICommunityData, IUserData } from "./perspectivesTypes";
import { EButtonState } from "./viewOptions";

/**
 * Interface with the data of a bounding box.
 */
export interface IBoundingBox {
    top: number
    bottom: number
    left: number
    right: number

    color?: {
        color: string
        border: string
        name: string
    }
}

/**
 * Interface of a translation json
 */
export interface ITranslation extends anyProperty {
    toolbar: {
        fileSourceDrop: {
            name: string,
            localFiles: string,
            Api_URL: string,
        },
        optionsDrop: {
            name: string,
            hideLabels: string,
            hideEdges: string,
            minSimilarity: string,
            removeEdges: string,
        },
        selectPerspective: {
            defaultName: string,
            noPerspectiveName: string,
        },
        legend: {
            name: string,
            noLegend: string,
        }
    },
    loadingText: {
        requestFiles: string,
        requestPerspective: string,
        requestingAllPerspectives: string,
        requestingConfToolSeed: string,
        CMisBusy: string,
        simpleRequest: string,
        simpleLoading: string,
    },
    dataColumn: {
        citizenTittle: string,
        citizenAmount: string,
        anonymous: string,
        medoidTittle: string,
        mainInteractionsTittle: string,
        otherInteractionsTittle: string,
        labelText: string,
        unknownUserAttrb: string,
    },
    legend: {
        anonymousRow: string,
        anonymousExplanation: string,
    }
}

export class CTranslation {
    t!: ITranslation;
    humanizators: [Map<string, string>, Map<string, string>];

    constructor(newT: ITranslation | undefined) {
        this.t = this.initT(newT);
        this.humanizators = [new Map<string, string>(), new Map<string, string>()];
    }

    setHumanizator(index: number, humanizator: Map<string, string>) {
        this.humanizators[index] = humanizator;
    }

    initT(newT: ITranslation | undefined) {
        let initial = this.defaultT();

        if (newT === undefined) {
            return initial;
        }


        const keys = Object.keys(initial);
        for (const key of keys) {

            if (newT[key] !== undefined) {

                if (typeof initial[key] === "object") {
                    const subKeys = Object.keys(initial[key]);

                    for (const subkey of subKeys) {

                        if (newT[key][subkey] !== undefined) {

                            if (typeof initial[key][subkey] === "object") {
                                const subsubKeys = Object.keys(initial[key][subkey]);

                                for (const subsubkey of subsubKeys) {

                                    if (newT[key][subkey][subsubkey] === undefined) {
                                        newT[key][subkey][subsubkey] = initial[key][subkey][subsubkey];
                                    }
                                }
                            }

                        } else {
                            newT[key][subkey] = initial[key][subkey];
                        }
                    }
                }

            } else {
                newT[key] = initial[key];
            }
        }
        return newT;
    }

    defaultT() {
        const t: ITranslation = {
            toolbar: {
                fileSourceDrop: {
                    name: "File Source",
                    localFiles: "Local app files",
                    Api_URL: "Api URL"
                },
                optionsDrop: {
                    name: "Options",
                    hideLabels: "Hide node labels",
                    hideEdges: "Hide unselected Edges",
                    minSimilarity: "Minimum similarity:",
                    removeEdges: "Remove % of edges:"
                },
                selectPerspective: {
                    defaultName: "Select perspective",
                    noPerspectiveName: "No available perspectives",
                },
                legend: {
                    name: "Legend",
                    noLegend: "Unactive Legend",
                }
            },
            loadingText: {
                requestFiles: "Requesting files to",
                requestPerspective: "Requesting perspective",
                requestingAllPerspectives: "Requesting file with All perspectives",
                requestingConfToolSeed: "Requesting configuration tool seed",
                CMisBusy: "Community Model is busy. Trying again",
                simpleRequest: "Requesting",
                simpleLoading: "Loading"
            },
            dataColumn: {
                citizenTittle: "Citizen Attributes",
                citizenAmount: "Total Citizens:",
                anonymous: "Anonymous",
                medoidTittle: "Medoid Attributes",
                mainInteractionsTittle: "Interactions related to this user's community:",
                otherInteractionsTittle: "Other user interactions:",
                labelText: "label",
                unknownUserAttrb: "All users' attributes are unknown"
            },
            legend: {
                anonymousRow: "Anonymous Users",
                anonymousExplanation: "Users without any explicit data"
            }
        }
        return t;
    }
}
/**
 * Legend data source
 */
export interface ILegendData {
    dims: DimAttribute[],
    anonymous: boolean,
    anonGroup: boolean,
}

/**
 * Interface with a point(x,y) coordinate.
 */
export interface IPoint {
    x: number;
    y: number;
}

/**
 * Interface with all functions that change the state of one/all perspectives in the application.
 */
export interface IStateFunctions {
    setLegendData: React.Dispatch<ILegendDataAction>;
    setDimensionStrategy: Function;
    setNetworkFocusId: Function;
    setSelectedObject: Dispatch<ISelectedObjectAction>;
}

/**
 * Interface of an object selected by the user. It can be a community, a user node or nothing.
 */
export interface ISelectedObject {
    obj: ICommunityData | IUserData | undefined;
    position?: IPoint;
    sourceID?: string;
}

export interface ILegendDataAction {
    type: "dims" | "anon" | "anonGroup" | "reset";
    newData: boolean | DimAttribute[];
}

//#region Reducer types/function

export function legendDataReducer(currentState: ILegendData, action: ILegendDataAction) {
    switch (action.type) {
        case "dims":
            currentState.dims = action.newData as DimAttribute[];
            break;
        case "anon":
            currentState.anonymous = action.newData as boolean;
            break;
        case "anonGroup":
            currentState.anonGroup = action.newData as boolean;
            break;
        case "reset":
            return { dims: [], anonymous: false, anonGroup: false } as ILegendData;
    }

    return JSON.parse(JSON.stringify(currentState));
}

//#region Selected Object
/**
 * Available actions for SelectedObjectAction. 
 */
export enum ESelectedObjectAction {
    /**
     * changes the position of the selected object. (Usefull for the tooltip.)
     */
    position,
    /**
     * Changes the selected object
     */
    object,
    /**
     * clears the object and its position
     */
    clear,
}

/**
 * Available actions for the selectedObjectReducer function
 */
export interface ISelectedObjectAction {
    action: ESelectedObjectAction;
    newValue: IPoint | ICommunityData | IUserData | undefined;
    sourceID: string;
}

/**
 * Function that simplify states updates of a SelectedObject state
 * @param state current state
 * @param stateAction action to execute
 * @returns the new state
 */
export function selectedObjectReducer(state: ISelectedObject | undefined, stateAction: ISelectedObjectAction) {
    const { action, newValue, sourceID } = stateAction;

    switch (action) {
        case ESelectedObjectAction.position:
            return {
                ...state,
                position: newValue,
            } as ISelectedObject;
        case ESelectedObjectAction.object:
            return {
                position: state?.position,
                obj: newValue,
                sourceID: sourceID,
            } as ISelectedObject;
        case ESelectedObjectAction.clear:
            state = undefined;
            return state;
    }
}
//#endregion
//#region button state array
/**
 * Available actions for a buttonState array action
 */
export enum EbuttonStateArrayAction {
    /**
     * Change the index of the array with the newState value
     */
    changeOne,
    /**
     * Change the index of the array with the newState value and turn inactive all other values of the array
     */
    activeOne,
    /**
     * Reset the array to a new array of size index and value newState
     */
    reset,
}

/**
 * Interface of a button state Array action to tell the reducer function what to do
 */
export interface IbStateArrayAction {
    action: EbuttonStateArrayAction;
    index: number;
    newState: EButtonState;
}

/**
 * Function that simplify states updates of a ButtonState array state
 * @param state state to edit
 * @param stateAction action to execute
 * @returns the state edited by the action
 */
export function bStateArrayReducer(state: EButtonState[], stateAction: IbStateArrayAction) {
    const { action, index, newState } = stateAction;

    switch (action) {
        case EbuttonStateArrayAction.changeOne:
            state[index] = newState;
            state = JSON.parse(JSON.stringify(state));
            break;

        case EbuttonStateArrayAction.activeOne:
            state.fill(EButtonState.unactive);
            state[index] = newState;
            state = JSON.parse(JSON.stringify(state));
            break;

        case EbuttonStateArrayAction.reset:
            state = new Array<EButtonState>(index);
            state.fill(newState);
            break;
    }

    return state;
}
//#endregion

//#endregion

export class DiferentAttrbError extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DiferentAttrbError.prototype);
    }
}

export function removeSpecialCase(s: string) {

    //Remove case letters in middle of the word
    let array = s.split(/(?=[A-Z])/);

    for (let i = 1; i < array.length; i++) {
        array[i] = array[i].toLowerCase();
    }

    s = array.join(" ").toString();

    //Remove snake case if it exists
    array = s.split("_");
    s = array.toString();

    return s;
}