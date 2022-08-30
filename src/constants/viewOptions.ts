/**
 * Available file sources
 */
export enum FileSource {
    Main,       //Main SPICE_visualization repository
    Local,      //Using local data folder
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
    fileSource: FileSource.Local,
    layout: AppLayout.Horizontal,
    hideLabels: ButtonState.active,
    hideEdges: ButtonState.inactive,
    edgeWidth: ButtonState.inactive,
    border: ButtonState.inactive,
    edgeThreshold: 0.5,
    deleteEdges: 0
}

/**
 * Aux class to mantain the view options of the perspectives
 */
export class ViewOptions {
    hideLabels: boolean;
    hideEdges: boolean;
    edgeWidth: boolean;
    edgeThreshold: number;
    deleteEdges: number;
    border: boolean;

    legendConfig: Map<string, boolean>

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

