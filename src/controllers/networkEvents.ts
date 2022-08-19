/**
 * @fileoverview .
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ViewOptions } from "../namespaces/ViewOptions";
import { EdgeData, UserData } from "../namespaces/perspectivesTypes";
import { nodeConst } from "../namespaces/nodes";
//Packages
import { DataSetEdges, DataSetNodes, Edge, Node, FitOptions, Network, TimelineAnimationType } from "vis-network";

//Local files
import BoundingBoxes from "./boundingBoxes";
import NodeVisuals from "./nodeVisuals";




export default class NetworkEvents {

    bbs: BoundingBoxes;
    visuals: NodeVisuals

    net: Network;
    nodes: DataSetNodes;
    edges: DataSetEdges;
    options: ViewOptions;

    constructor(network: Network, nodes: DataSetNodes, edges: DataSetEdges, options: ViewOptions, boundingBoxes: BoundingBoxes, nodeVisuals: NodeVisuals, setSelNode: Function) {
        this.bbs = boundingBoxes;
        this.visuals = nodeVisuals;

        this.net = network;
        this.nodes = nodes;
        this.edges = edges;
        this.options = options;

        this.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));
        this.net.on("click", (event) => this.click(event, setSelNode));
    }

    beforeDrawing(ctx: CanvasRenderingContext2D) {
        this.bbs.drawBoundingBoxes(ctx);
    }

    click(event: any, setSelNode: Function) {
        if (event.nodes.length > 0) {
            this.nodeClicked(event.nodes[0], setSelNode);
        } else {
            this.noNodeClicked();
        }
    }

    zoom() {

    }

    dragging() {

    }

    animationFinished() {

    }


    nodeClicked(nodeId: number, setSelectedNode: Function) {
        const node: UserData = this.nodes.get(nodeId) as UserData;
        setSelectedNode(node);

        //Search for the nodes that are connected to the selected Node
        const selectedNodes = new Array<string>();
        selectedNodes.push(nodeId.toString())

        const connected_edges_id = this.net.getConnectedEdges(selectedNodes[0]);
        const connectedEdges: Edge[] = this.edges.get(connected_edges_id);

        connectedEdges.forEach((edge: Edge) => {
            if (edge.value !== undefined && edge.value >= 0.5) {   //TODO link this with the threshold option

                if (edge.from != selectedNodes[0] && edge.to == selectedNodes[0])
                    selectedNodes.push(edge.from as string);

                else if (edge.to != selectedNodes[0] && edge.from == selectedNodes[0])
                    selectedNodes.push(edge.to as string);

                edge.hidden = false;
            }
        });

        //Move the "camera" to focus on these nodes
        const fitOptions: FitOptions = {
            nodes: selectedNodes,
            animation: {
                duration: nodeConst.ZoomDuration,
            } as TimelineAnimationType,
        }
        this.net.fit(fitOptions);

        //Hide edges unconected 
        if (this.options.HideEdges) {
            this.edges.forEach((edge: Edge) => {
                if (!connectedEdges.includes(edge)) {
                    edge.hidden = true;
                }
            });
        }

        //Update nodes's color acording to their selected status
        const newNodes = new Array();
        this.nodes.forEach((node: Node) => {

            if (node.id !== undefined && selectedNodes.includes(node.id.toString())) {
                this.visuals.dimensionsStrat.nodeToDefault(node as UserData);
            } else {
                this.visuals.dimensionsStrat.nodeToColorless(node as UserData);
            }

            newNodes.push(node);
        });

        this.nodes.update(newNodes);
    }


    noNodeClicked() {

    }
}