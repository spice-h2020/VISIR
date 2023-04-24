/**
 * @fileoverview This File contains a namespace with edge's configuration constants.
 * @author Marco Expósito Pérez
 */

export const edgeConst = {
    //Allow edge labels.
    allowLabels: false,

    //Edge Width limits.
    minWidth: 1,
    maxWidth: 10,

    //Default color of the edge when is not selected.
    defaultColor: "rgba(164,164,164, 0.2)",
    //Color when the edge is being selected.
    selectedColor: "#000000",
    selectedExtraWidth: 2,

    //--- Labels ---
    //Default values.
    LabelStrokeWidth: 0,
    LabelSize: 30,
    LabelColor: "transparent",
    LabelStrokeColor: "transparent",
    LabelAlign: "top",
    labelVerticalAdjust: -7,

    //Labels when its edge is selected.
    LabelColorSelected: "#000000",
    LabelStrokeColorSelected: "#ffffff",
    LabelStrokeWidthSelected: 2,
}