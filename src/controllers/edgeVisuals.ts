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


    constructor(viewOptions: ViewOptions, Edges: DataSetEdges, options: Options) {
        this.hideUnselectedEdges(viewOptions.HideEdges, Edges);
    }

    changeEdgeWidth(edgeWidth: boolean, edges: DataSetEdges | undefined, options: Options, network: Network | undefined | null) {
        if (edges !== undefined && network !== undefined && network !== null) {
            if (options.edges?.scaling?.max !== undefined) {
                if (edgeWidth)
                    options.edges.scaling.max = edgeConst.maxWidth;
                else
                    options.edges.scaling.max = edgeConst.minWidth;
            }


            network.setOptions(options);
            edges.update(edges);
        }
    }

    //TODO, dont hide current selected edges
    hideUnselectedEdges(HideEdges: boolean, edges: DataSetEdges | undefined) {
        if (edges !== undefined) {
            const newEdges = new Array();

            edges.forEach((edge: Edge) => {
                if (HideEdges) {
                    edge["hidden"] = true;
                } else {
                    edge["hidden"] = false;
                }


                newEdges.push(edge);
            })

            edges.update(newEdges);
        }
    }




}


