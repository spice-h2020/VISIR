/**
 * @fileoverview This file contains diferent aux classes and constant parameters related with the nodes/users of each perspective.
 * @author Marco Expósito Pérez
 */

/**
 * Contains the necesary info to change the shape of a node
 */
export interface shapeData {
    name: string,
    vAdjust: number,
    selectedVAdjust: number
}

/**
 * Current available dimensions to change from nodes based on their explicit communities values
 */
export enum Dimensions {
    Color,
    Shape,
    Border, //Color of the border
}

/**
 * Attributes of a node dimensions and the community value data related to it. 
 */
export interface DimAttribute {
    key: string
    values: string[]
    dimension: Dimensions
}

/**
 * Constant values of configuration for the nodes
 */
export const nodeConst = {

    //--- Node circular location Values ---
    groupsBaseDistance: 75,
    betweenNodesDistance: 8,

    //--- Default Configuration Values ---
    ZoomDuration: 300,

    //Sizes
    DefaultSize: 20,
    SelectedSize: 30,

    //Default value for a background color when the explicit community doesnt change it
    defaultColor: "rgb(30, 236, 164, 1)",
    //Color when another node is being focused
    NoFocusColor: { Background: "rgba(155, 155, 155, 0.3)", Border: "rgba(100, 100, 100, 0.3)" },


    //Default shape in case explicit community doesnt change it
    defaultShape: { name: "dot", vAdjust: -35, selectedVAdjust: -40 } as shapeData,

    defaultBorderWidth: 0,
    selectedBorderWidth: 0,

    defaultBorderColorWidth: 4,
    selectedBorderColorWidth: 4,

    labelSize: 13,

    //Node dimensions that change based on its explicit Community
    nodeDimensions: {
        getColor: (n: number) => getColorOfN(n),
        getShape: (n: number) => getShapeOfN(n),
        getBorder: (n: number) => getBorderOfN(n),
    },

    //Characteristics that change based on the explicit communities

    BackgroundColors: [
        "rgb(255, 0, 0, 1)", //Red
        "rgb(0, 255, 72, 1)", //Green
        "rgb(25, 166, 255, 1)", //Blue
        "rgb(255, 252, 25, 1)", //Yellow
        "rgb(232, 134, 12, 1)", //Orange
        "rgb(123, 12, 232, 1)", //Purple
        "rgb(234, 10, 120, 1)", //Pink
        "rgb(30, 236, 164, 1)", //green-blue
    ],

    BoderColors: [
        "rgb(128, 126, 13, 1)", //Yellow
        "rgb(0, 128, 36, 1)", //Green
        "rgb(13, 84, 128, 1)", //Blue
        "rgb(128, 0, 0, 1)", //Red
        "rgb(62, 6, 116, 1)", //Purple
        "rgb(116, 67, 6, 1)", //Orange
        "rgb(117, 5, 60, 1)", //Pink
        "rgb(15, 118, 82, 1)", //green-blue
    ],

    AvailableShapes: [
        { name: "dot", vAdjust: -35, selectedVAdjust: -40 } as shapeData,
        { name: "diamond", vAdjust: -35, selectedVAdjust: -40 } as shapeData,
        { name: "star", vAdjust: -34, selectedVAdjust: -40 } as shapeData,
        { name: "triangle", vAdjust: -29, selectedVAdjust: -35 } as shapeData,
        { name: "square", vAdjust: -35, selectedVAdjust: -40 } as shapeData,
        { name: "triangleDown", vAdjust: -40, selectedVAdjust: -45 } as shapeData,
        { name: "hexagon", vAdjust: -35, selectedVAdjust: -40 } as shapeData,
    ],

}

/**
 * Returns a color for a node background
 * @param {number} n index of the returned color
 * @returns {string} Returns aa string similar to "rgb(255, 0, 0, 1)"
 */
const getColorOfN = function (n: number): string {
    n = n % nodeConst.BackgroundColors.length;

    return nodeConst.BackgroundColors[n];
};

/**
 * Returns a shape and label offset for a node shape
 * @param {number} n index of the returned shape
 * @returns {Object} Returns an object in the format of { Shape: "dot", vOffset: -31, selOffset: -40 }
 */
const getShapeOfN = function (n: number): shapeData {
    n = n % nodeConst.AvailableShapes.length;

    return nodeConst.AvailableShapes[n];
}

/**
 * Returns a color for a node border
 * @param {number} n index of the returned color
 * @returns {String} Returns aa string similar to "rgb(255, 0, 0, 1)"
 */
const getBorderOfN = function (n: number): string {
    n = n % nodeConst.BoderColors.length;

    return nodeConst.BoderColors[n];
};