/**
 * @fileoverview This class filters some of the edges with low value and change the edges visuals to match view options and selected status.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { ViewOptions } from "../constants/viewOptions";
import { edgeConst } from "../constants/edges";
import { EdgeData } from "../constants/perspectivesTypes";
//Package
import { DataSetEdges, Edge, Options } from "vis-network";


export default class EdgeVisuals {
    //Data of all edges of the perspective, even if they are not shown or loaded in the dataset
    allEdges: EdgeData[];
    //Data of all edges of the network
    edges: DataSetEdges;
    //Hide edges view option value
    hideEdges: boolean;
    //Selected edges of the network
    selectedEdges?: string[];

    /**
     * Constructor of the class
     * @param edges Data of all edges of the network sorted by increasing value
     * @param viewOptions Initial view Options
     * @param options Initial edge options
     */
    constructor(edges: DataSetEdges, allEdges: EdgeData[], viewOptions: ViewOptions, options: Options) {
        this.edges = edges;
        this.hideEdges = viewOptions.hideEdges
        this.allEdges = allEdges;

        this.hideUnselectedEdges(viewOptions.hideEdges);
        this.updateEdgesThreshold(viewOptions.edgeThreshold);
        this.changeEdgeWidth(viewOptions.edgeWidth, options);
    }

    /**
     * Delete a % of all edges of the network. Lower value edges will be deleted first
     */
    deleteEdges(viewOptions: ViewOptions) {
        this.edges.clear();

        const newEdges: Edge[] = Object.assign([], this.allEdges);
 
        const n = newEdges.length - this.allEdges.length * viewOptions.deleteEdges / 100;

        for (var i = newEdges.length - 1; i >= n; i--) {
            newEdges.splice(Math.floor(Math.random() * newEdges.length), 1);
        }

        this.edges.add(newEdges);

        this.hideUnselectedEdges(viewOptions.hideEdges);
        this.updateEdgesThreshold(viewOptions.edgeThreshold);
    }

    /**
     * Change the network options to adapt the edge width to the edgeWidth option. Change the width of an edge based on their value
     * @param edgeWidth value of the option
     * @param options network options to be edited
     */
    changeEdgeWidth(edgeWidth: boolean, options: Options) {
        if (options.edges?.scaling?.max !== undefined) {
            if (edgeWidth)
                options.edges.scaling.max = edgeConst.maxWidth;
            else
                options.edges.scaling.max = edgeConst.minWidth;
        }
    }

    /**
     * Hide all edges while being unselected
     * @param hideEdges new value of the hide Edges option
     */
    hideUnselectedEdges(hideEdges: boolean) {
        this.hideEdges = hideEdges;

        const newEdges = new Array();

        //If currently there are selected edges, we wont hide them
        if (this.selectedEdges !== undefined && this.selectedEdges.length > 0) {
            this.edges.forEach((edge: Edge) => {
                if (hideEdges && !this.selectedEdges?.includes(edge.id as string)) {
                    edge["hidden"] = true;
                } else {
                    edge["hidden"] = false;
                }

                newEdges.push(edge);
            })

        } else {
            //If there are no selected edges, we toggle all edges
            this.edges.forEach((edge: Edge) => {
                if (hideEdges) {
                    edge["hidden"] = true;
                } else {
                    edge["hidden"] = false;
                }

                newEdges.push(edge);
            })
        }
        this.edges.update(newEdges);
    }

    /**
     * Update the edge Threshold value to hide edges below that value
     * @param {Number} valueThreshold new value
     */
    updateEdgesThreshold(valueThreshold: number) {

        const newEdges = new Array();
        this.edges.forEach((edge: Edge) => {

            if (edge.value !== undefined && edge.value < valueThreshold) {
                edge["hidden"] = true;
            } else if (this.hideEdges) {
                if (this.selectedEdges?.includes(edge.id as string)) {
                    edge["hidden"] = false;
                } else {
                    edge["hidden"] = true;
                }
            } else {
                edge["hidden"] = false;
            }

            newEdges.push(edge);
        })
        this.edges.update(newEdges);
    }

    /**
     * Save the edges as selected and update all edges visuals
     * @param selectedEdges edges to select
     */
    selectEdges(selectedEdges: string[]) {
        this.selectedEdges = selectedEdges;

        if (this.hideEdges) {
            this.hideUnselectedEdges(this.hideEdges)
        }

        this.edgeChosenVisuals();
    }

    /**
     * Unselect all edges and update all edges visuals
     */
    unselectEdges() {
        this.selectedEdges = undefined;

        if (this.hideEdges) {
            this.hideUnselectedEdges(this.hideEdges)
        }

        this.edgeChosenVisuals();
    }

    /**
     * Update the visuals of all selected edges
     */
    edgeChosenVisuals() {
        const newEdges = new Array();

        this.edges.forEach((edge: Edge) => {
            if (this.selectedEdges?.includes(edge.id as string)) {
                edge.font = {
                    color: edgeConst.LabelColorSelected,
                    strokeColor: edgeConst.LabelStrokeColorSelected,
                    strokeWidth: edgeConst.LabelStrokeWidthSelected
                }
            } else {
                edge.font = {
                    color: edgeConst.LabelColor,
                    strokeColor: edgeConst.LabelStrokeColor,
                    strokeWidth: edgeConst.LabelStrokeWidth,
                }
            }

            newEdges.push(edge);
        })

        this.edges.update(newEdges);
    }
}


