/**
 * @fileoverview This file adds all necesary callback functions of events a vis.js network
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { CommunityData, UserData } from "../constants/perspectivesTypes";
import { nodeConst } from "../constants/nodes";
import { DataRow, Point, StateFunctions, TooltipInfo } from "../constants/auxTypes";
//Packages
import { BoundingBox, DataSetEdges, DataSetNodes, Edge, FitOptions, IdType, Network, TimelineAnimationType } from "vis-network";
//Local files
import BoxesController from "./boundingBoxes";
import NodeVisuals from "./nodeVisuals";
import EdgeVisuals from "./edgeVisuals";
import { getHTMLPosition } from "../basicComponents/Tooltip";
import NetworkController from "./networkController";

export default class EventsController {
    //Bounding boxes controller
    bbController: BoxesController;
    //Node visuals controller
    nodeVisuals: NodeVisuals;
    //Edge visuals controller
    edgeVisuals: EdgeVisuals;

    //Reference to the network canvas
    refHTML: HTMLDivElement;

    //Vis.js network object
    net: Network;
    //Nodes of the network
    nodes: DataSetNodes;
    //Edges of the network
    edges: DataSetEdges;

    //Current tooltip data before being parsed
    tooltipData?: UserData | CommunityData;
    //ID of the current focused network
    networkFocusID: number;
    //Id of this network
    networkID: number;

    /**
     * Constructor of the class
     * @param networkController parent object of this eventsController
     * @param htmlRef Div element where the network canvas is stored
     * @param sf State functions object
     * @param networkFocusID ID of the current network with the focus of the tooltip
     * @param networkID ID of this network
     */
    constructor(networkController: NetworkController, htmlRef: HTMLDivElement, sf: StateFunctions, networkFocusID: number, networkID: number) {

        this.bbController = networkController.bbController;
        this.nodeVisuals = networkController.nodeVisuals;
        this.edgeVisuals = networkController.edgeVisuals;

        this.refHTML = htmlRef;

        this.net = networkController.net;
        this.nodes = networkController.nodes;
        this.edges = networkController.edges;

        this.networkFocusID = networkFocusID;
        this.networkID = networkID;

        this.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));
        this.net.on("click", (event) => this.click(event, sf));
        this.net.on("animationFinished", () => this.animationFinished(sf.setTooltipPosition, sf.setTooltipState));

        this.net.on("zoom", () => this.zoom(sf.setTooltipPosition, sf.setTooltipState));
        this.net.on("dragging", () => this.dragging(sf.setTooltipPosition, sf.setTooltipState));

        this.net.on("resize", () => this.zoomOut());
    }

    /**
     * Before drawing event callback
     * @param ctx Context of the network's canvas
     */
    beforeDrawing(ctx: CanvasRenderingContext2D) {
        this.bbController.drawBoundingBoxes(ctx);
    }

    /**
     * Click event callback
     * @param event click event
     * @param sf Object with all functions that change the state
     */
    click(event: any, sf: StateFunctions) {
        sf.setTooltipState(false);

        if (event.nodes.length > 0) {
            sf.setNetworkFocusId(this.networkID);

            sf.setSelectedNodeId(event.nodes[0]);
            this.setNodeAsTooltip(sf.setTooltipInfo, event.nodes[0]);

        } else {
            sf.setSelectedNodeId(undefined);
            this.noNodeClicked(event, sf);
        }
    }

    /**
     * Animation finished event callback
     * @param setTooltipPos function that changes tooltip position
     * @param setTooltipState function that changes tooltip active/disabled state
     */
    animationFinished(setTooltipPos: Function, setTooltipState: Function) {
        if (this.networkID === this.networkFocusID)
            this.updateTooltipPosition(setTooltipPos, setTooltipState);
    }

    /**
     * Zoom event callback
     * @param setTooltipPos function that changes tooltip position
     * @param setTooltipState function that changes tooltip active/disabled state
     */
    zoom(setTooltipPos: Function, setTooltipState: Function) {
        if (this.networkID === this.networkFocusID)
            this.updateTooltipPosition(setTooltipPos, setTooltipState);
    }

    /**
     * Canvas dragging event callback
     * @param setTooltipPos function that changes tooltip position
     * @param setTooltipState function that changes tooltip active/disabled state
     */
    dragging(setTooltipPos: Function, setTooltipState: Function) {
        if (this.networkID === this.networkFocusID)
            this.updateTooltipPosition(setTooltipPos, setTooltipState);
    }

    /**
     * Change the visual state of all nodes depending on their conection to the clicked node. Do the same for the edges
     * @param nodeId Id of the node clicked
     */
    nodeClicked(nodeId: number) {
        const node = this.nodes.get(nodeId) as unknown as UserData;

        //Search for the nodes that are connected to the selected Node
        const selectedNodes = new Array<string>();
        selectedNodes.push(node.id.toString())

        const selected_edges_id = this.net.getConnectedEdges(selectedNodes[0]);
        const selectedEdges: Edge[] = this.edges.get(selected_edges_id);

        selectedEdges.forEach((edge: Edge) => {
            if (edge.value !== undefined && edge.value >= 0.5) {   //TODO link this with the threshold option once the slider works

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
                duration: nodeConst.zoomDuration,
            } as TimelineAnimationType,
        }
        this.net.fit(fitOptions);

        //Hide edges unconected
        this.edgeVisuals.selectEdges(selected_edges_id as string[]);
        this.net.selectEdges(selected_edges_id);

        //Update nodes's color acording to their selected status
        this.nodeVisuals.selectNodes(selectedNodes);
        this.net.selectNodes([node.id] as IdType[])

        return node;
    }

    /**
     * Remove all selected nodes and edges and update their visuals. 
     * If a community has been clicked, zoom in and update the dataTables and tooltip with its data
     * @param event click event
     * @param sf Object with all functions that change the state
     */
    noNodeClicked(event: any, sf: StateFunctions) {
        const boundingBoxClicked = this.bbController.isBoundingBoxClicked(event);

        if (boundingBoxClicked !== null) {
            const community: CommunityData = this.bbController.comData[boundingBoxClicked]

            sf.setNetworkFocusId(this.networkID);

            //Update community datatable  
            sf.setSelectedCommunity!(community);

            //Update tooltip
            this.setCommunityAsTooltip(sf.setTooltipInfo, community);

            //Zoom in to the community
            const fitOptions: FitOptions = {
                animation: {
                    duration: nodeConst.zoomDuration
                } as TimelineAnimationType,
                nodes: community.users
            }

            this.net.fit(fitOptions);

            this.removeSelectedItems();
        } else {
            this.zoomOut();

            sf.setTooltipInfo(undefined);
            
            //Clear community datatable
            sf.setSelectedCommunity!(undefined);
        }

        this.removeSelectedItems();
    }

    /**
     * Zoom out to fit all nodes in the image
     */
    zoomOut() {
        const fitOptions: FitOptions = {
            animation: {
                duration: nodeConst.zoomDuration,
            } as TimelineAnimationType,
            nodes: []
        }
        this.net.fit(fitOptions);
    }

    /**
     * Parse a node info to work as a real tooltip info, and update the tooltip info state
     * @param setTooltipInfo Function to update tooltip info
     * @param nodeId node to be parsed
     */
    setNodeAsTooltip(setTooltipInfo: Function, nodeId: number) {
        const node = this.nodes.get(nodeId) as unknown as UserData;

        const mainRows: DataRow[] = new Array<DataRow>();

        if (!this.nodeVisuals.hideLabel) {
            mainRows.push(new DataRow("Id", node !== undefined ? node.id : ""));
            mainRows.push(new DataRow("Label", node !== undefined ? node.label : ""));
        }
        mainRows.push(new DataRow("Community", node !== undefined ? node.implicit_community : ""));

        const subRows: DataRow[] = new Array<DataRow>();

        const keys = Object.keys(node.explicit_community);
        for (let i = 0; i < keys.length; i++) {
            subRows.push(new DataRow(keys[i], node.explicit_community[keys[i]]));
        }

        const tooltipInfo = {
            tittle: "Citizen data",
            mainDataRow: mainRows,
            subDataRow: subRows
        } as TooltipInfo;

        setTooltipInfo(tooltipInfo)

        this.tooltipData = node;
    }

    /**
     * Parse a community info to work as a real tooltip info, and update the tooltip info state
     * @param setTooltipInfo Function to update tooltip info
     * @param community community to be parsed
     */
    setCommunityAsTooltip(setTooltipInfo: Function, community: CommunityData) {
        const mainRows: DataRow[] = new Array<DataRow>();

        mainRows.push(new DataRow("Id", community !== undefined ? community.id : ""));
        mainRows.push(new DataRow("Name", community !== undefined ? community.name : ""));
        mainRows.push(new DataRow("Explanation", community !== undefined ? community.explanation : "", true));

        const subRows: DataRow[] = new Array<DataRow>();
        if (community !== undefined && community.bb !== undefined) {
            subRows.push(new DataRow("Color", community.bb.color.name))
        }

        const tooltipInfo = {
            tittle: "Community data",
            mainDataRow: mainRows,
            subDataRow: subRows
        } as TooltipInfo;

        setTooltipInfo(tooltipInfo)

        this.tooltipData = community;
    }

    /**
     * Remove all selected nodes and edges of the network
     */
    removeSelectedItems() {
        //Deselect everything
        this.net.unselectAll();

        //Hide edges
        this.edgeVisuals.unselectEdges();

        //Recolor all necesary nodes
        this.nodeVisuals.unselectNodes()
    }

    /**
     * Updates the tooltip position based on the saved tooltip data
     * @param setTooltipPos function that changes tooltip position
     * @param setTooltipState function that changes tooltip active/disabled state
     */
    updateTooltipPosition(setTooltipPos: Function, setTooltipState: Function) {
        if (this.tooltipData !== undefined) {

            const refPosition = getHTMLPosition(this.refHTML);

            let x: number;
            let y: number;

            //If the tooltip data is a node
            if (this.tooltipData?.explanation === undefined) {
                const node = this.tooltipData as UserData;

                const nodePositionInDOM = this.net.canvasToDOM(this.net.getPosition(node.id));

                //Depending on the zoom level and node size, we add offset to the coordinates of the tooltip
                x = nodePositionInDOM.x + refPosition.left + 18 + 1.7 * (node.size * this.net.getScale());
                y = nodePositionInDOM.y + refPosition.top + -5 - 0.2 * (node.size * this.net.getScale());

            } else {
                const community = this.tooltipData as CommunityData;

                const bb = community.bb as BoundingBox;

                const bbLeft = this.net.canvasToDOM({
                    x: bb.left,
                    y: bb.top
                });
                const bbRight = this.net.canvasToDOM({
                    x: bb.right,
                    y: bb.bottom
                });

                //Position the tooltip at the right of the bounding box
                x = bbRight.x + refPosition.left + 16;
                y = bbLeft.y + (bbRight.y - bbLeft.y) / 2 + refPosition.top;

            }

            //Check if the tooltip is inside the canvas
            if (y > refPosition.top && y < refPosition.bottom &&
                x > refPosition.left && x < refPosition.right) {

                setTooltipPos({ x: x, y: y } as Point);
                setTooltipState(true);

            } else {
                setTooltipState(false);
            }
        }
    }
}