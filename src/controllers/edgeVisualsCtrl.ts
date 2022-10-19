/**
 * @fileoverview This class calculates and draw the bounding boxes of users with the same implicit community.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { EdgeData } from "../constants/perspectivesTypes";
//Packages
import { DataSetEdges, Edge } from "vis-network";
//Local files
import { ViewOptions } from "../constants/viewOptions";
import { edgeConst } from "../constants/edges";

export default class EdgeVisualsCtrl {
    /**
     * All edges that are active in the network.
     */
    edges: DataSetEdges;
    /**
     * All edges of the network regardless of their active status.
     */
    baseEdges: EdgeData[];
    /**
     * Edges that are currently selected/highlighted in the network.
     */
    selected: string[];

    hideUnselected: boolean;
    edgeThreshold: number;

    /**
     * Constructor of the class 
     * @param edges All edges that are active in the network.
     * @param baseEdges All edges of the network regardless of their active status.
     * @param viewOptions options that changes how the user see the network
     */
    constructor(edges: DataSetEdges, baseEdges: EdgeData[], viewOptions: ViewOptions) {
        this.edges = edges;
        this.baseEdges = baseEdges;
        this.selected = new Array<string>();

        this.hideUnselected = viewOptions.hideEdges;
        this.edgeThreshold = viewOptions.edgeThreshold;

        this.initEdges(viewOptions);
    }

    /**
     * Initialize edge options
     * @param viewOptions options that changes how the user see the network
     */
    initEdges(viewOptions: ViewOptions) {
        const edgesToDelete: string[] = new Array<string>();

        this.baseEdges.forEach((edge) => {
            if (Math.random() < viewOptions.deleteEdges / 100) {
                edgesToDelete.push(edge.id);
            } else if (edge.similarity < viewOptions.edgeThreshold) {
                edgesToDelete.push(edge.id);
            } else {
                const edgeToEdit = this.edges.get(edge.id);

                if (viewOptions.hideEdges) {
                    edgeToEdit!.hidden = true;
                }
            }
        });

        this.edges.remove(edgesToDelete);
    }

    /**
     * Receives the ID of an edge and select all edges that start/ends up in that node.
     * Additionaly, it changes the visual of all edges based on their selected status
     * @param id node's id.
     * @returns returns a list with all other nodes that start/ends at the other end of selected edges
     */
    selectEdges(id: string): string[] {
        this.selected = new Array<string>();
        const selectedNodes: string[] = new Array<string>();
        const newEdges: Edge[] = new Array<Edge>();

        this.edges.forEach((edge) => {
            if (edge.from === id) {
                selectedNodes.push(edge.to as string);

                this.selectedVisuals(edge);
                edge.hidden = false;

                this.selected.push(edge.id as string);

            } else if (edge.to === id) {
                selectedNodes.push(edge.from as string);

                this.selectedVisuals(edge);
                edge.hidden = false;

                this.selected.push(edge.id as string);

            } else {
                if (this.hideUnselected) {
                    edge.hidden = true;
                } else {
                    edge.hidden = false;
                    this.unselectedVisuals(edge);
                }
            }

            newEdges.push(edge)
        });

        this.edges.update(newEdges);

        return selectedNodes;
    }

    /**
     * Changes edge visuals to their selected state
     * @param edge edge to edit
     */
    selectedVisuals(edge: Edge) {
        edge.color = { color: edgeConst.selectedColor };

        if (edgeConst.allowLabels) {
            edge.font = {
                color: edgeConst.LabelColorSelected,
                strokeColor: edgeConst.LabelStrokeColorSelected,
                strokeWidth: edgeConst.LabelStrokeWidthSelected,
                vadjust: edgeConst.labelVerticalAdjust
            }
        }
    }

    /**
     * Changes edge visuals to their unselected state
     * @param edge edge to edit
     */
    unselectedVisuals(edge: Edge) {
        edge.color = { color: edgeConst.defaultColor };

        if (edgeConst.allowLabels) {
            edge.font = {
                color: edgeConst.LabelColor,
                strokeColor: edgeConst.LabelStrokeColor,
                strokeWidth: edgeConst.LabelStrokeWidth,
                vadjust: edgeConst.labelVerticalAdjust
            }
        }
    }

    /**
     * Unselect all edges
     */
    unselectEdges() {
        this.selected = new Array<string>();
        const newEdges: Edge[] = new Array<Edge>();

        this.edges.forEach((edge) => {
            if (this.hideUnselected) {
                edge.hidden = true;

            } else {
                edge.hidden = false;
                this.unselectedVisuals(edge);
            }

            newEdges.push(edge)
        });

        this.edges.update(newEdges);
    }

    /**
     * Toggle hide edges. If true, all unselected edges are hidden.
     * @param hideEdges new hide edges value
     */
    toggleHideEdges(hideEdges: boolean) {
        this.hideUnselected = hideEdges;
        const newEdges: Edge[] = new Array<Edge>();

        this.edges.forEach((edge) => {
            if (this.hideUnselected) {
                if (this.selected.includes(edge.id as string)) {
                    edge.hidden = false;
                } else {
                    edge.hidden = true;
                }
            } else {
                edge.hidden = false;
                if (!this.selected.includes(edge.id as string)) {
                    this.unselectedVisuals(edge);
                }
            }

            newEdges.push(edge)
        });
        this.edges.update(newEdges);
    }

    /**
     * Remove from the network all edges that doesnt meet the threshold.
     * If the threshold is higher than before, remove all edges below the threshold
     * Otherwise, add the new edges between old and new threshold
     * @param newEdgeThreshold new treshold value
     */
    updateEdgesThreshold(newEdgeThreshold: number) {
        if (newEdgeThreshold > this.edgeThreshold) {
            const edgesToDelete: string[] = new Array<string>();

            this.edges.forEach((edge: Edge) => {

                if ((edge as EdgeData).similarity !== undefined && (edge as EdgeData).similarity < newEdgeThreshold) {
                    edgesToDelete.push(edge.id as string);
                }
            });

            this.edges.remove(edgesToDelete);

        } else {
            const containedEdges: string[] = this.edges.getIds() as string[];
            const edgeToAdd: EdgeData[] = new Array<EdgeData>();

            for (const edge of this.baseEdges) {

                if (edge.similarity < newEdgeThreshold) {
                    continue;
                } else {
                    if (containedEdges.includes(edge.id)) {
                        break;
                    } else {
                        edgeToAdd.push(edge);
                    }
                }
            }

            this.edges.add(edgeToAdd);
        }

        this.edgeThreshold = newEdgeThreshold;
    }

    /**
     * Remove random edges to increase performance of the app.
     * @param viewOptions options that changes how the user see the network
     */
    updateDeletedEdges(viewOptions: ViewOptions) {
        this.edges.clear();

        const edgesToAdd: Edge[] = new Array<Edge>();

        this.baseEdges.forEach((edge) => {
            if (Math.random() >= viewOptions.deleteEdges / 100 &&
                (edge as EdgeData).similarity >= viewOptions.edgeThreshold) {

                if (viewOptions.hideEdges) {
                    edge!.hidden = true;
                }

                edgesToAdd.push(edge);
            }
        });

        this.edges.add(edgesToAdd);
    }
}