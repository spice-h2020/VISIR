/**
 * @fileoverview This file contains enums and a class related with the visualization options and has the initial options of the options dropdown
 * @author Marco Expósito Pérez
 */

/**
 * Available file sources
 */
export enum FileSource {
    Local,      //Using local app data folder
    Develop,    //Develop SPICE_visualization repository
    Api,        //Conecting to the API (WIP)
}

/**
 * Posible states of a button
 */
export enum ButtonState {
    inactive,   //The perspective is not active and user cant see it
    loading,    //The perspective is loading and we dont know yet if it had any problem while creating the perspective view
    active,     //The perspective is active and user can see it and interact with it
}

/**
 * Posible layouts of the active perspectives in the App
 */
export enum AppLayout {
    Horizontal,
    Vertical,
}

/**
 * Initial options of the toolbar
 */
export const initialOptions = {
    fileSource: FileSource.Local,       //What type of URL will be picked to GET requests. Request Manager has the map that relates each fileSource option with its url
    layout: AppLayout.Horizontal,       //Decides how the active perspectives stacks when there are more than 2.
    hideLabels: ButtonState.active,     //Hide the labels of all nodes in the canvas and in the tooltip and datatable
    hideEdges: ButtonState.inactive,    //Hide all edges except when a node is selected, in such case, only conected edges will be shown
    edgeWidth: ButtonState.inactive,    //Change the width of all edges based on their similarity/value parameter
    border: ButtonState.inactive,       //Activate the border option of nodes that adds a third dimension that changes based on an explicit community
    edgeThreshold: 0.5,                 //Threshold that controls the minimum value edges must have to be shown. Selected edges have priority above this
    deleteEdges: 0                      //% of edges that will be deleted and never will be shown. Improves performance on heavy edges networks
}

/**
 * Class that contains the value of all visualization options that will change how the user see the networks
 */
export class ViewOptions {
    hideLabels: boolean;    //Hide the labels of all nodes in the canvas and in the tooltip and datatable
    hideEdges: boolean;     //Hide all edges except when a node is selected, in such case, only conected edges will be shown
    edgeWidth: boolean;     //Change the width of all edges based on their similarity/value parameter
    border: boolean;        //Activate the border option of nodes that adds a third dimension that changes based on an explicit community
    edgeThreshold: number;  //Threshold that controls the minimum value edges must have to be shown. Selected edges have priority above this
    deleteEdges: number;    //% of edges that will be deleted and never will be shown. Improves performance on heavy edges networks
    
    legendConfig: Map<string, boolean>  //Configuration based on the legend options that will change some nodes to colorless based on their explicit communities

    /**
     * Constructor of the class
     */
    constructor() {
        this.hideLabels = initialOptions.hideLabels === ButtonState.active;
        this.hideEdges = initialOptions.hideEdges === ButtonState.active;
        this.edgeWidth = initialOptions.edgeWidth === ButtonState.active;
        this.border = initialOptions.border === ButtonState.active;
        this.legendConfig = new Map<string, boolean>();
        this.edgeThreshold = initialOptions.edgeThreshold;
        this.deleteEdges = initialOptions.deleteEdges;
    }
}

