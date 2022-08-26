/**
 * @fileoverview This file adds all necesary callback functions of events a vis.js network
 * @package It requires vis network package.
 * @package It requires react package.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { CommunityData, UserData } from "../namespaces/perspectivesTypes";
import { nodeConst } from "../namespaces/nodes";
//Packages
import { DataSetEdges, DataSetNodes, Edge, FitOptions, Network, TimelineAnimationType } from "vis-network";
//Local files
import BoundingBoxes, { BoundingBox } from "./boundingBoxes";
import NodeVisuals, { Point } from "./nodeVisuals";
import EdgeVisuals from "./edgeVisuals";
import { getHTMLPosition, TooltipInfo } from "../basicComponents/Tooltip";
import { DataRow } from "../basicComponents/Datatable";
import NetworkController, { StateFunctions } from "./networkController";


export default class EventsController {
    //Bounding boxes controller
    bbController: BoundingBoxes;
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
    //Is the tooltip active in this perspective
    isTooltipActive: boolean;

    /**
     * Constructor of the class
     */
    constructor(networkManager: NetworkController, htmlRef: HTMLDivElement, sf: StateFunctions) {

        this.bbController = networkManager.bbController;
        this.nodeVisuals = networkManager.nodeVisuals;
        this.edgeVisuals = networkManager.edgeVisuals;

        this.refHTML = htmlRef;

        this.net = networkManager.net;
        this.nodes = networkManager.nodes;
        this.edges = networkManager.edges;

        this.isTooltipActive = false;

        this.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));
        this.net.on("click", (event) => this.click(event, sf));
        this.net.on("animationFinished", () => this.animationFinished(sf.setTooltipPosition, sf.setTooltipState));

        this.net.on("zoom", () => this.zoom(sf.setTooltipPosition, sf.setTooltipState));
        this.net.on("dragging", () => this.dragging(sf.setTooltipPosition, sf.setTooltipState));
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
        this.isTooltipActive = true;
        sf.setTooltipState(false);

        if (event.nodes.length > 0) {
            sf.setSelectedNodeId(event.nodes[0]);
            this.setNodeAsTooltip(sf.setTooltipInfo, event.nodes[0]);

        } else {
            sf.setSelectedNodeId(undefined);
            this.noNodeClicked(event, sf);
        }
    }

    /**
     * Animation finished event callback
     * @param setTooltipPos 
     * @param setTooltipState 
     */
    animationFinished(setTooltipPos: Function, setTooltipState: Function) {
        if (this.isTooltipActive)
            this.updateTooltipPosition(setTooltipPos, setTooltipState);

        this.isTooltipActive = false;
    }

    /**
     * Zoom event callback
     * @param setTooltipPos 
     * @param setTooltipState 
     */
    zoom(setTooltipPos: Function, setTooltipState: Function) {
        this.updateTooltipPosition(setTooltipPos, setTooltipState);
    }

    /**
     * Canvas dragging event callback
     * @param setTooltipPos 
     * @param setTooltipState 
     */
    dragging(setTooltipPos: Function, setTooltipState: Function) {
        this.updateTooltipPosition(setTooltipPos, setTooltipState);
    }

    /**
     * Change the visual state of all nodes depending on their conection to the clicked node. Do the same for the edges
     * @param nodeId Id of the node clicked
     */
    nodeClicked(nodeId: any) {
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

        //Update nodes's color acording to their selected status
        this.nodeVisuals.selectNodes(selectedNodes);

        return node;
    }

    /**
     * Remove all selected nodes and edges and update their visuals. 
     * If a community has been clicked, zoom in and update the dataTables and tooltip with its data
     * @param event click event
     * @param sf Object with all functions that change the state
     */
    noNodeClicked(event: any, sf: StateFunctions) {
        //Basic zoom options
        const fitOptions: FitOptions = {
            animation: {
                duration: nodeConst.zoomDuration,
            } as TimelineAnimationType,
        }

        const boundingBoxClicked = this.bbController.isBoundingBoxClicked(event);

        if (boundingBoxClicked !== null) {
            const community: CommunityData = this.bbController.comData[boundingBoxClicked]

            //Update community datatable  
            sf.setSelectedCommunity!(community);

            //Update tooltip
            this.setCommunityAsTooltip(sf.setTooltipInfo, community);

            //Zoom in to the community
            fitOptions.nodes = community.users;
            this.net.fit(fitOptions);

            this.removeSelectedItems();
        } else {

            //Zoom out from all nodes
            fitOptions.nodes = [];
            this.net.fit(fitOptions);

            //Clear community datatable
            sf.setSelectedCommunity!(undefined);

            //Clear tooltip data
            sf.setTooltipInfo(undefined);
        }

        this.removeSelectedItems();
    }

    /**
     * Parse a node info to work as a real tooltip info, and update the tooltip info state
     * @param setTooltipInfo 
     * @param node node to be parsed
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
     * @param setTooltipInfo 
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
            tittle: "Citizen data",
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
     * @param setTooltipPos 
     * @param setTooltipState 
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
                x = nodePositionInDOM.x + refPosition.left + 18 + 1.6 * (node.size * this.net.getScale());
                y = nodePositionInDOM.y + refPosition.top - 5 - 0.2 * (node.size * this.net.getScale());

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
                x = bbRight.x + refPosition.left + 15;
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