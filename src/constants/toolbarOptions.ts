import {Layouts} from "./perspectivesTypes"

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
}

export interface AllPerspectives {
    names: string[];
}

//Function to make sure the AllPerspective object received is valid
export function isAllPerspectivesValid(arg: any): arg is AllPerspectives {
    return arg && arg.names && typeof (arg.names) == "object" && arg.names[0] && typeof (arg.names[0]) == "string";
}