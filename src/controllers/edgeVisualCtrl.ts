/**
 * @fileoverview Calculate and draw the bounding boxes of users with the same implicit community.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { EdgeData } from "../constants/perspectivesTypes";
//Packages
import { DataSetEdges, Edge, Network, Options } from "vis-network";
import { ViewOptions } from "../constants/viewOptions";
import { edgeConst } from "../constants/edges";

export default class EdgeVisualsCtrl {
    edges: DataSetEdges;
    baseEdges: EdgeData[];
    focusedEdges: string[];

    hideUnselected: boolean;
    edgeThreshold: number;

    constructor(edges: DataSetEdges, baseEdges: EdgeData[], viewOptions: ViewOptions) {
        this.edges = edges;
        this.baseEdges = baseEdges;
        this.focusedEdges = new Array<string>();

        this.hideUnselected = viewOptions.hideEdges;
        this.edgeThreshold = viewOptions.edgeThreshold;

        this.initEdges(viewOptions);
    }

    initEdges(viewOptions: ViewOptions) {

        const edgesToDelete: string[] = new Array<string>();

        this.baseEdges.forEach((edge) => {
            if (Math.random() < viewOptions.deleteEdges / 100) {
                edgesToDelete.push(edge.id);
            } else if (edge.value < viewOptions.edgeThreshold) {
                edgesToDelete.push(edge.id);
            } else {
                const edgeToEdit = this.edges.get(edge.id);

                if (viewOptions.edgeWidth) {
                    edgeToEdit!.scaling = {
                        min: edgeConst.minWidth,
                        max: edgeConst.maxWidth
                    }
                }

                if (viewOptions.hideEdges) {
                    edgeToEdit!.hidden = true;
                }
            }
        });

        this.edges.remove(edgesToDelete);
    }

    selectEdges(id: string): string[] {
        this.focusedEdges = new Array<string>();
        const selectedNodes: string[] = new Array<string>();
        const newEdges: Edge[] = new Array<Edge>();

        this.edges.forEach((edge) => {
            if (edge.from === id) {
                selectedNodes.push(edge.to as string);

                this.selectedVisuals(edge);
                edge.hidden = false;

                this.focusedEdges.push(edge.id as string);

            } else if (edge.to === id) {
                selectedNodes.push(edge.from as string);

                this.selectedVisuals(edge);
                edge.hidden = false;

                this.focusedEdges.push(edge.id as string);

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

    unselectEdges() {
        this.focusedEdges = new Array<string>();
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


    toggleEdgeWidth(edgeWidth: boolean, net: Network, options: Options) {
        if (options.edges?.scaling?.max !== undefined) {
            if (edgeWidth)
                options.edges.scaling.max = edgeConst.maxWidth;
            else
                options.edges.scaling.max = edgeConst.minWidth;
        }

        net.setOptions(options);
        this.edges.update(this.edges);
    }

    toggleHideEdges(hideEdges: boolean) {
        this.hideUnselected = hideEdges;
        const newEdges: Edge[] = new Array<Edge>();

        this.edges.forEach((edge) => {
            if (this.hideUnselected) {
                if (this.focusedEdges.includes(edge.id as string)) {
                    edge.hidden = false;
                } else {
                    edge.hidden = true;
                }
            } else {
                edge.hidden = false;
                if (!this.focusedEdges.includes(edge.id as string)) {
                    this.unselectedVisuals(edge);
                }
            }

            newEdges.push(edge)
        });
        this.edges.update(newEdges);
    }

    updateEdgesThreshold(newEdgeThreshold: number) {
        if (newEdgeThreshold > this.edgeThreshold) {
            const edgesToDelete: string[] = new Array<string>();

            this.edges.forEach((edge: Edge) => {
                if (edge.value !== undefined && edge.value < newEdgeThreshold) {
                    edgesToDelete.push(edge.id as string);
                }
            });

            this.edges.remove(edgesToDelete);

        } else {
            const containedEdges: string[] = this.edges.getIds() as string[];
            const edgeToAdd: EdgeData[] = new Array<EdgeData>();

            for (const edge of this.baseEdges) {

                if (edge.value < newEdgeThreshold) {
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

    updateDeletedEdges(viewOptions: ViewOptions) {
        this.edges.clear();

        const edgesToAdd: Edge[] = new Array<Edge>();

        this.baseEdges.forEach((edge) => {
            if (Math.random() >= viewOptions.deleteEdges / 100 &&
                edge.value >= viewOptions.edgeThreshold) {

                if (viewOptions.edgeWidth) {
                    edge!.scaling = {
                        min: edgeConst.minWidth,
                        max: edgeConst.maxWidth
                    }
                }

                if (viewOptions.hideEdges) {
                    edge!.hidden = true;
                }

                edgesToAdd.push(edge);
            }
        });

        this.edges.add(edgesToAdd);
    }
}