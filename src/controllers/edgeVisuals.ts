/**
 * @fileoverview This class find all explicit communities and its values in the user data of the perspective. 
 * Then create a dimension strategy that changes how the network ndoes look based on the explicitData.
 * Then it changes the node position in the canvas to create a circular distribution without node overlap.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { PerspectiveInfo, PerspectiveData, UserData } from "../namespaces/perspectivesTypes";
import { Dimensions, DimAttribute, nodeConst } from "../namespaces/nodes"
//Local files
import NodeDimensionStrategy from "./dimensionStrategy";
import { ViewOptions } from "../namespaces/ViewOptions";
import { DataSet, DataSetEdges, Edge, Network, Node, Options } from "vis-network";
import { edgeConst } from "../namespaces/edges";


export default class EdgeVisuals {
    edges: DataSetEdges;
    hideEdges: boolean;
    //Selected edges of the network
    selectedEdges?: string[];

    constructor(viewOptions: ViewOptions, Edges: DataSetEdges, options: Options) {
        this.edges = Edges;
        this.hideEdges = viewOptions.HideEdges

        this.narrowEdges();

        this.hideUnselectedEdges(viewOptions.HideEdges);
        this.changeEdgeWidth(viewOptions.EdgeWidth, options)
    }

    narrowEdges() {
        const edgesToDelete: Edge[] = new Array<Edge>();
        this.edges.forEach((edge: Edge) => {
            if (edge.value !== undefined && edge.value < edgeConst.narrowLimit) {
                edgesToDelete.push(edge);
            }
        })
        this.edges.remove(edgesToDelete);
    }

    changeEdgeWidth(edgeWidth: boolean, options: Options) {
        if (options.edges?.scaling?.max !== undefined) {
            if (edgeWidth)
                options.edges.scaling.max = edgeConst.maxWidth;
            else
                options.edges.scaling.max = edgeConst.minWidth;
        }
    }

    //TODO, dont hide current selected edges
    hideUnselectedEdges(hideEdges: boolean) {
        this.hideEdges = hideEdges;

        const newEdges = new Array();

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

    selectEdges(connectedEdges: string[]) {
        this.selectedEdges = connectedEdges;

        if (this.hideEdges) {
            this.hideUnselectedEdges(this.hideEdges)
        }
    }

    unselectEdges() {
        this.selectedEdges = undefined;

        if (this.hideEdges) {
            this.hideUnselectedEdges(this.hideEdges)
        }
    }
}


