/**
 * @fileoverview .
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ViewOptions } from "../namespaces/ViewOptions";
import { CommunityData, EdgeData, UserData } from "../namespaces/perspectivesTypes";
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

    constructor(network: Network, nodes: DataSetNodes, edges: DataSetEdges, options: ViewOptions, boundingBoxes: BoundingBoxes, nodeVisuals: NodeVisuals, setSelNode: Function, setSelCom: Function) {
        this.bbs = boundingBoxes;
        this.visuals = nodeVisuals;

        this.net = network;
        this.nodes = nodes;
        this.edges = edges;
        this.options = options;

        this.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));
        this.net.on("click", (event) => this.click(event, setSelNode, setSelCom));
    }

    beforeDrawing(ctx: CanvasRenderingContext2D) {
        this.bbs.drawBoundingBoxes(ctx);
    }

    click(event: any, setSelNode: Function, setSelCom: Function) {
        if (event.nodes.length > 0) {
            this.nodeClicked(event, setSelNode);
        } else {
            this.noNodeClicked(event, setSelNode, setSelCom);
        }
    }

    zoom() {

    }

    dragging() {

    }

    animationFinished() {

    }


    nodeClicked(event: any, setSelectedNode: Function) {
        const node = this.nodes.get(event.nodes[0]) as unknown as UserData;
        setSelectedNode(node);

        //Search for the nodes that are connected to the selected Node
        const selectedNodes = new Array<string>();
        selectedNodes.push(node.id.toString())

        const connected_edges_id = this.net.getConnectedEdges(selectedNodes[0]);
        const connectedEdges: Edge[] = this.edges.get(connected_edges_id);

        const newEdges: Edge[] = new Array<Edge>();
        connectedEdges.forEach((edge: Edge) => {
            if (edge.value !== undefined && edge.value >= 0.5) {   //TODO link this with the threshold option

                if (edge.from != selectedNodes[0] && edge.to == selectedNodes[0])
                    selectedNodes.push(edge.from as string);

                else if (edge.to != selectedNodes[0] && edge.from == selectedNodes[0])
                    selectedNodes.push(edge.to as string);

                edge.hidden = false;
                newEdges.push(edge);
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
                    newEdges.push(edge);
                }
            });
        }
        this.edges.update(newEdges);

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


    noNodeClicked(event: any, setSelNode: Function, setSelCom: Function) {
        setSelNode(undefined);

        const fitOptions: FitOptions = {
            animation: {
                duration: nodeConst.ZoomDuration,
            } as TimelineAnimationType,
        }

        const boundingBoxClicked = this.bbs.isBoundingBoxClicked(event);

        if (boundingBoxClicked !== null) {
            const community: CommunityData = this.bbs.comData[boundingBoxClicked]

            //Update community datatable  
            setSelCom(community);

            //Zoom in to the community
            fitOptions.nodes = community.users;
            this.net.fit(fitOptions);

            this.removeSelectedItems();
        } else {

            //Zoom out from all nodes
            fitOptions.nodes = [];
            this.net.fit(fitOptions);

            //Clear community datatable
            setSelCom(undefined);
        }

        this.removeSelectedItems();
    }


    removeSelectedItems() {
        //Hide edges
        if (this.options.HideEdges) {
            const newEdges: Edge[] = new Array<Edge>();
            this.edges.forEach((edge: Edge) => {
                edge.hidden = true;
                newEdges.push(edge);
            });
            this.edges.update(newEdges);
        }

        //Deselect everything
        this.net.unselectAll();

        //Recolor all nodes
        const newNodes = new Array();
        this.nodes.forEach((node: Node) => {
            this.visuals.dimensionsStrat.nodeToDefault(node as UserData);

            newNodes.push(node);
        });
        this.nodes.update(newNodes);
    }
}