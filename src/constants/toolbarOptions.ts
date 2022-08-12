import { Layouts } from "./perspectivesTypes"

export enum FileSource {
    Main,       //Main SPICE_visualization repository
    Local,      //Using local data folder
    Develop,    //Develop SPICE_visualization repository
    Api,        //Conecting to the API (WIP)
}

export enum ButtonState {
    inactive,   //The perspective is not active and user cant see it
    loading,    //The perspective is loading and we dont know yet if it had any problem while creating the perspective view
    active,     //The perspective is active and user can see it and interact with it
}

export const tbOptions = {
    initialFileSource: FileSource.Local,
    initialLayout: Layouts.Horizontal,
    initialHideLabels: ButtonState.active,
    initialHideEdges: ButtonState.inactive,
    initialEdgeWidth: ButtonState.inactive,
    initialBorder: ButtonState.inactive,
}

export class ViewOptions {
    HideLabels: boolean;
    HideEdges: boolean;
    EdgeWidth: boolean;
    Border: boolean;

    constructor() {
        this.HideLabels = tbOptions.initialHideLabels === ButtonState.active;
        this.HideEdges = tbOptions.initialHideEdges === ButtonState.active;
        this.EdgeWidth = tbOptions.initialEdgeWidth === ButtonState.active;
        this.Border = tbOptions.initialBorder === ButtonState.active;
    }
}