export enum FileSource {
    Main,       //Main SPICE_visualization repository
    Local,      //Using local data folder
    Develop,    //Develop SPICE_visualization repository
    Api,        //Conecting to the API (WIP)
}

export const tbOptions = {
    initialFileSource: FileSource.Main,

}