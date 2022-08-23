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
import EdgeVisuals from "./edgeVisuals";




export default class NetworkEvents {

    bbs: BoundingBoxes;
    nodeVisuals: NodeVisuals;
    edgeVisuals: EdgeVisuals;

    net: Network;
    nodes: DataSetNodes;
    edges: DataSetEdges;
    options: ViewOptions;

    constructor(network: Network, nodes: DataSetNodes, edges: DataSetEdges, options: ViewOptions, boundingBoxes: BoundingBoxes, nodeVisuals: NodeVisuals, edgeVisuals: EdgeVisuals, setSelNode: Function, setSelCom: Function) {
        this.bbs = boundingBoxes;
        this.nodeVisuals = nodeVisuals;
        this.edgeVisuals = edgeVisuals;

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

        const selected_edges_id = this.net.getConnectedEdges(selectedNodes[0]);
        const selectedEdges: Edge[] = this.edges.get(selected_edges_id);

        selectedEdges.forEach((edge: Edge) => {
            if (edge.value !== undefined && edge.value >= 0.5) {   //TODO link this with the threshold option

                if (edge.from != selectedNodes[0] && edge.to == selectedNodes[0])
                    selectedNodes.push(edge.from as string);

                else if (edge.to != selectedNodes[0] && edge.from == selectedNodes[0])
                    selectedNodes.push(edge.to as string);

            } else {
                const index = selected_edges_id.indexOf(edge.id as string);
                selected_edges_id.splice(index, 1);
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
        this.edgeVisuals.selectEdges(selected_edges_id as string[]);

        //Update nodes's color acording to their selected status
        this.nodeVisuals.selectNodes(selectedNodes);
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
        //Deselect everything
        this.net.unselectAll();

        //Hide edges
        this.edgeVisuals.unselectEdges();

        //Recolor all necesary nodes
        this.nodeVisuals.unselectNodes()
    }
}