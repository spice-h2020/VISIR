/**
 * @fileoverview This File contains diferent unrelated auxiliary classes/interfaces that doesnt need a unique file for them.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dispatch } from "react";
import { CommunityData, UserData } from "./perspectivesTypes";
import { ButtonState } from "./viewOptions";

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
    setLegendData: Function;
    setDimensionStrategy: Function;
    setNetworkFocusId: Function;
    setSelectedObject: Dispatch<SelectedObjectAction>;
}

/**
 * Interface of an object selected by the user. It can be a community, a user node or nothing
 */
export interface SelectedObject {
    obj: CommunityData | UserData | undefined;
    position?: Point;
    sourceID?: string;
}

//#region Reducer types/function

/**
 * Available actions for SelectedObjectAction. 
 */
export enum SelectedObjectActionEnum {
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
export interface SelectedObjectAction {
    action: SelectedObjectActionEnum;
    newValue: Point | CommunityData | UserData | undefined;
    sourceID: string;
}

/**
 * Function that simplify states updates of a SelectedObject state
 * @param state current state
 * @param stateAction action to execute
 * @returns the new state
 */
export function selectedObjectReducer(state: SelectedObject | undefined, stateAction: SelectedObjectAction) {
    const { action, newValue, sourceID } = stateAction;

    switch (action) {
        case SelectedObjectActionEnum.position:
            return {
                ...state,
                position: newValue,
            } as SelectedObject;
        case SelectedObjectActionEnum.object:
            return {
                position: state?.position,
                obj: newValue,
                sourceID: sourceID,
            } as SelectedObject;
        case SelectedObjectActionEnum.clear:
            state = undefined;
            return state;
    }
}

/**
 * Available actions for a buttonState array action
 */
export enum bStateArrayActionEnum {
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
export interface bStateArrayAction {
    action: bStateArrayActionEnum;
    index: number;
    newState: ButtonState;
}

/**
 * Function that simplify states updates of a ButtonState array state
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