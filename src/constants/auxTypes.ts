/**
 * @fileoverview This File contains diferent unrelated auxiliary classes/interfaces that doesnt need a unique file for them.
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "./viewOptions";

/**
 * Class to streamline the data of a row that will be shown to the user. Key will be at the left of the row, value at the right
 */
export class DataRow {
    //Key of the row
    key: string;
    //Value of the row
    value: string;
    //If true, getKey will return nothing and getValue will return key and value in the same react component
    combineBoth: boolean;

    /**
     * Constructor of the class. There is no real distinction between the key param and the value param. 
     * Current datatable implementation shows key at the left of the row, and value at the right
     * @param key component of the row
     * @param value another component of the row
     * @param combineBoth If true, getKey will return nothing and getValue will return key and value in the same react component.
     */
    constructor(key: string, value: string, combineBoth: boolean = false) { this.key = key; this.value = value; this.combineBoth = combineBoth; }

    /**
     * Returns the key of the row if combine both is false
     * @returns the key or "" 
     */
    getKey(strongKey: boolean = true): string {
        if (!this.combineBoth) {
            if (strongKey)
                return `<strong> ${this.key}: </strong>`;
            else
                return `${this.key}: `;
        } else {
            return "";
        }
    }

    /**
     * Returns the value in diferent formats. If combineBoth is false, will return the value. If true, will return a div with the key and the value, aditionaly, 
     * if strong key is true, the key value in the div will have <strong> tag
     * @param strongKey if true, the key value in the div will have <strong> tag
     * @returns the value or the key + value div
     */
    getValue(strongKey: boolean = false): string {
        if (!this.combineBoth) {
            return ` ${this.value} `;
        } else if (strongKey) {
            return `<strong>${this.key}: </strong> &nbsp; ${this.value}`;
        } else {
            return `${this.key}: ${this.value}`;
        }
    }
}

/**
 * Interface that contains all the info to show in a tooltip
 */
export interface TooltipInfo {
    tittle: string;
    mainDataRow: DataRow[];
    subDataRow: DataRow[];
}

/**
 * Interface with the data of a bounding box
 */
export interface BoundingBox {
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
 * Interface with a point(x,y) coordinate
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Interface with all functions that change the state of one/all perspectives in the application
 */
export interface StateFunctions {
    setSelectedNodeId: Function;
    setTooltipInfo: Function;
    setTooltipPosition: Function;
    setTooltipState: Function;
    setLegendData: Function;
    setDimensionStrategy: Function;
    setNetworkFocusId: Function;
    setSelectedCommunity?: Function;
}

/**
 * Available actions for a buttonState array action
 */
export enum bStateArrayActionEnum {
    changeOne,  //Change the index of the array with the newState value
    activeOne,  //Change the index of the array with the newState value and turn inactive all other values of the array
    reset,      //Reset the array to a new array of size index and value newState
}

/**
 * Interface of a button state Array action to tell the reducer function what to do
 */
export interface bStateArrayAction {
    action: bStateArrayActionEnum,
    index: number,
    newState: ButtonState
}

/**
 * Function that executes the bStateArrayAction
 * @param state state to edit
 * @param stateAction action to execute
 * @returns the state edited by the action
 */
export function bStateArrayReducer(state: ButtonState[], stateAction: bStateArrayAction) {
    const { action, index, newState } = stateAction;

    switch (action) {
        case bStateArrayActionEnum.changeOne:
            state[index] = newState;
            state = JSON.parse(JSON.stringify(state));
            break;

        case bStateArrayActionEnum.activeOne:
            state.fill(ButtonState.unactive);
            state[index] = newState;
            state = JSON.parse(JSON.stringify(state));
            break;

        case bStateArrayActionEnum.reset:
            state = new Array<ButtonState>(index);
            state.fill(newState);
            break;
    }

    return state;
}