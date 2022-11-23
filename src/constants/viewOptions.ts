/**
 * @fileoverview This file contains enums and a class related with the visualization options and 
 * has the initial options of the options dropdown
 * @author Marco Expósito Pérez
 */

/**
 * Available "all perspective file/details" sources
 */
export enum EFileSource {
    /**
     * Using local app data folder
     */
    Local,
    /**
     * Conecting to the API
     */
    Api,
}

/**
 * Possible states of a button.
 */
export enum EButtonState {
    /**
     * The button is disabled. user cant interact with it.
     */
    disabled,
    /**
     * The button is inactive, user can click it to activate it.
     */
    unactive,
    /**
     * The button is loading something and user cant interact with it
     */
    loading,
    /**
     * The button is active, user can click it to disactivate it
     */
    active,
}

/**
 * Possible states of the collapse buttons / visualization of two perspectives
 */
export enum EAppCollapsedState {
    /**
     * Nothing is collapsed, both perspectives are equaly looking
     */
    unCollapsed,
    /**
     * The left perspective is collapsed, making the right one bigger
     */
    toTheLeft,
    /**
     * The right perspective is collapsed, making the left one bigger
     */
    toTheRight,
}

export function collapseReducer(state: EAppCollapsedState, stateAction: EAppCollapsedState) {
    if (state === EAppCollapsedState.unCollapsed) {
        state = stateAction
    } else if ((state === EAppCollapsedState.toTheLeft && stateAction === EAppCollapsedState.toTheRight)
        || (state === EAppCollapsedState.toTheRight && stateAction === EAppCollapsedState.toTheLeft)) {

        state = EAppCollapsedState.unCollapsed;
    }

    return state;
}

/**
 * Initial options of the toolbar.
*/
export const initialOptions = {
    /**
     * What type of URL will be picked to GET requests. Request Manager has the map that relates each fileSource option with its url
     */
    fileSource: EFileSource.Api,
    /**
     * Hide the labels of all nodes in the canvas and in the tooltip and datatable
     */
    hideLabels: EButtonState.active,
    /**
     * Hide all edges except when a node is selected, in such case, only conected edges will be shown
     */
    hideEdges: EButtonState.unactive,
    /**
     * Activate the border option of nodes that adds a third dimension that changes based on an explicit community
     */
    border: EButtonState.unactive,
    /**
     * Threshold that controls the minimum value edges must have to be shown. Selected edges have priority above this
     */
    edgeThreshold: 0.5,
    /**
     * % of edges that will be deleted and never will be shown. Improves performance on heavy edges networks
     */
    deleteEdges: 75
}
/**
 * Class that contains the value of all visualization options that will change how the user see the networks
 */
export class ViewOptions {

    /**
     * Hide the labels of all nodes in the canvas and in the tooltip and datatable
     */
    hideLabels: boolean;
    /**
     * Hide all edges except when a node is selected, in such case, only conected edges will be shown
     */
    hideEdges: boolean;
    /**
     * Activate the border option of nodes that adds a third dimension that changes based on an explicit community
     */
    border: boolean;
    /**
     * Threshold that controls the minimum value edges must have to be shown. Selected edges have priority above this
     */
    edgeThreshold: number;
    /**
     * % of edges that will be deleted and never will be shown. Improves performance on heavy edges networks
     */
    deleteEdges: number;
    /**
     * Configuration of the the legend dropdown that will change some nodes to colorless based on what the user selects
     */
    legendConfig: Map<string, boolean>;

    /**
     * Constructor of the class
     */
    constructor() {
        this.hideLabels = initialOptions.hideLabels === EButtonState.active;
        this.hideEdges = initialOptions.hideEdges === EButtonState.active;
        this.border = initialOptions.border === EButtonState.active;
        this.legendConfig = new Map<string, boolean>();
        this.edgeThreshold = initialOptions.edgeThreshold;
        this.deleteEdges = initialOptions.deleteEdges;
    }
}

/**
 * Interface with the available actions of the viewOptionReducer.
 */
export interface IViewOptionAction {
    updateType: keyof ViewOptions;
    newValue?: number | Map<string, boolean> | undefined;
}

/**
 * Reducer function that simplyfy how to update a ViewOptions state.
 * If new value is undefined, it toggles the boolean parameter whose name is updateType.
 * Otherwise, updates the parameter whose name is updateType to newValue.
 * @param state current state
 * @param action new Action
 * @returns the new state
 */
export function viewOptionsReducer(state: ViewOptions, action: IViewOptionAction) {
    const { updateType, newValue } = action;

    if (newValue === undefined)
        return {
            ...state,
            [updateType]: !state[updateType],
        };

    return {
        ...state,
        [updateType]: newValue,
    };
}