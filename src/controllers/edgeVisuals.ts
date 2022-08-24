/**
 * @fileoverview This class filters some of the edges with low value and change the edges visuals to match view options and selected status.
 * @package It requires vis network package.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ViewOptions } from "../namespaces/ViewOptions";
import { edgeConst } from "../namespaces/edges";
//Package
import { DataSetEdges, Edge, Options } from "vis-network";

export default class EdgeVisuals {
    //Data of all edges of the network
    edges: DataSetEdges;
    //Hide edges view option value
    hideEdges: boolean;
    //Selected edges of the network
    selectedEdges?: string[];

    /**
     * Constructor of the class
     * @param viewOptions Initial view Options
     * @param Edges 
     * @param options Initial edge options
     */
    constructor(viewOptions: ViewOptions, Edges: DataSetEdges, options: Options) {
        this.edges = Edges;
        this.hideEdges = viewOptions.HideEdges

        this.narrowEdges();

        this.hideUnselectedEdges(viewOptions.HideEdges);
        this.changeEdgeWidth(viewOptions.EdgeWidth, options)
    }

    /**
     * Delete all edges that doesnt have a minimum of value
     */
    narrowEdges() {
        const edgesToDelete: Edge[] = new Array<Edge>();
        this.edges.forEach((edge: Edge) => {
            if (edge.value !== undefined && edge.value < edgeConst.narrowLimit) {
                edgesToDelete.push(edge);
            }
        })
        this.edges.remove(edgesToDelete);
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
     * Save the edges as selected and update all edges visuals based on the option
     * @param selectedEdges edges to select
     */
    selectEdges(selectedEdges: string[]) {
        this.selectedEdges = selectedEdges;

        if (this.hideEdges) {
            this.hideUnselectedEdges(this.hideEdges)
        }
    }

    /**
     * Unselect all edges and update all edges visuals
     */
    unselectEdges() {
        this.selectedEdges = undefined;

        if (this.hideEdges) {
            this.hideUnselectedEdges(this.hideEdges)
        }
    }
}


