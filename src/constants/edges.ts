/**
 * @fileoverview This File contains a namespace with edges constants.
 * @author Marco Expósito Pérez
 */

 export const edgeConst = {

    //Number that decides the minimum limit of edges to not be deleted 
    narrowLimit: 0.5,

    //% of edges that will be deleted. Lowest similarity edges will be deleted first
    deleteLimit: 0.85,

    //Edge Width limits
    minWidth: 1,
    maxWidth: 10,

    //Default color of the edge when is not selected
    defaultColor: "#A4A4A4",
    //Color when the edge is being selected
    selectedColor: "#000000",

    //--- Labels ---
    //Default values
    LabelStrokeWidth: 0,
    LabelSize: 30,
    LabelColor: "transparent",
    LabelStrokeColor: "transparent",
    LabelAlign: "top",
    labelVerticalAdjust: -7,

    //Labels when its edge is selected
    LabelColorSelected: "#000000",
    LabelStrokeColorSelected:"#ffffff",
    LabelStrokeWidthSelected: 2,
}