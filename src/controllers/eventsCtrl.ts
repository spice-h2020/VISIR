/**
 * @fileoverview This class reacts to all vis.js networks and to some other external events.
 * Vis.js events: 
 *  animationFinished, zoom, dragging -> Updates the tooltip position if this network has the focus of the tooltip.
 *  beforeDrawing -> Draws the bounding boxes of the communities.
 *  resize -> Zooms out to fit all nodes in the new resized view.
 *  click -> If a node or a bounding box is clicked, select that node or community for all networks and in the tooltip. 
 *          Otherwise, unselect all objects in all networks.
 * 
 * External events based on what is the selected object:
 *  A node of this network -> Updates the clicked node visual and all connected node and edges visuals. 
 *          Zoom to fit all these nodes in the view.
 *  A bounding box of this network -> Update nodes' visuals inside the bounding box and zoom to them.
 *  A community of other network -> Highlight all nodes that are also inside this network and zoom to them.
 *  Nothing is selected -> Deselect all edges, nodes and zoom out to fit all the network.
 * 
 * @package Requires vis network package.
 * @package Requires react package.
 * @author Marco Expósito Pérez
 */
//Constants
import { ICommunityData, IUserData } from "../constants/perspectivesTypes";
import { IBoundingBox, ISelectedObjectAction, ESelectedObjectAction, IStateFunctions } from "../constants/auxTypes";
//Packages
import { FitOptions, TimelineAnimationType } from "vis-network";
import { Dispatch } from "react";
//Local files
import NetworkController from "./networkController";
import { getHTMLPosition } from "../basicComponents/Tooltip";
import { nodeConst } from "../constants/nodes";

export default class EventsCtrl {
    netCtrl: NetworkController;
    focusedNetId: string;

    //Current data of the selected object
    selectedObject?: IUserData | ICommunityData;

    zoomQueue: string[][];
    isZooming: boolean;

    constructor(netController: NetworkController, sf: IStateFunctions, focusedNetId: string) {
        this.zoomQueue = new Array<Array<string>>();
        this.isZooming = false;

        this.netCtrl = netController;
        this.focusedNetId = focusedNetId;

        this.netCtrl.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));

        this.netCtrl.net.on("animationFinished", () => {

            this.isZooming = false;
            this.zoomToNodes();
            this.updateTooltipPosition(sf.setSelectedObject)
        });

        this.netCtrl.net.on("zoom", () => this.updateTooltipPosition(sf.setSelectedObject));
        this.netCtrl.net.on("dragging", () => this.updateTooltipPosition(sf.setSelectedObject));

        this.netCtrl.net.on("resize", () => {

            this.addZoomToQueue([])
        });

        this.netCtrl.net.on("click", (event) => this.click(event, sf));
    }


    /**
     * Callback to the before Drawing vis.js network event
     * @param ctx CanvasRenderingContext2D
     */
    beforeDrawing(ctx: CanvasRenderingContext2D) {
        this.netCtrl.bbCtrl.drawBoundingBoxes(ctx);
    }

    /**
     * Updates the tooltip position if this network is the focused network and if the selected object is a node or a community
     * @param setSelectedObject Function to set the selected object
     */
    updateTooltipPosition(setSelectedObject: Dispatch<ISelectedObjectAction>) {

        if (this.netCtrl.id === this.focusedNetId) {
            if (this.selectedObject !== undefined) {

                const refPosition = getHTMLPosition(this.netCtrl.htmlRef);

                let x: number;
                let y: number;

                //If the tooltip data is a node
                if (this.selectedObject?.explanations === undefined) {
                    const node = this.selectedObject as IUserData;

                    const nodePositionInDOM = this.netCtrl.net.canvasToDOM(this.netCtrl.net.getPosition(node.id));

                    //Depending on the zoom level and node size, we add offset to the coordinates of the tooltip
                    x = nodePositionInDOM.x + refPosition.left + 18 + 1.7 * (node.size * this.netCtrl.net.getScale());
                    y = nodePositionInDOM.y + refPosition.top + node.size / 2 - 10;

                } else {
                    const community = this.selectedObject as ICommunityData;

                    const bb = community.bb as IBoundingBox;

                    const bbLeft = this.netCtrl.net.canvasToDOM({
                        x: bb.left,
                        y: bb.top
                    });
                    const bbRight = this.netCtrl.net.canvasToDOM({
                        x: bb.right,
                        y: bb.bottom
                    });

                    //Position the tooltip at the right of the bounding box
                    x = bbRight.x + refPosition.left + 22;
                    y = bbLeft.y + (bbRight.y - bbLeft.y) / 2 + refPosition.top;

                }

                //Check if the tooltip is inside the canvas
                if (y > refPosition.top && y < refPosition.bottom &&
                    x > refPosition.left && x < refPosition.right) {

                    setSelectedObject({ action: ESelectedObjectAction.position, newValue: { x: x, y: y }, sourceID: this.netCtrl.id });

                } else {
                    setSelectedObject({ action: ESelectedObjectAction.position, newValue: undefined, sourceID: this.netCtrl.id });
                }
            }

        } else {
            this.selectedObject = undefined;
        }
    }

    /**
     * Zoom to fit all nodes in the networs. 
     * @param nodes ID of all nodes to zoom to. If empty, zoom to all nodes
     */
    addZoomToQueue(nodes: string[]) {

        if (this.zoomQueue.length <= 2 || nodes.length !== 0) {
            this.zoomQueue.push(nodes);
        }


        if (this.netCtrl.isReady && !this.isZooming) {
            this.zoomToNodes();
        }
    }

    zoomToNodes() {
        const nodes = this.zoomQueue.shift();

        if (nodes !== undefined) {
            this.isZooming = true;

            const fitOptions: FitOptions = {
                animation: {
                    duration: nodeConst.zoomDuration
                } as TimelineAnimationType,
                nodes: nodes
            }

            this.netCtrl.net.fit(fitOptions);
        }
    }

    /**
     * Callback to the click vis.js network event
     * @param event Click event
     * @param sf Functions that change the state of the visualization
     */
    click(event: any, sf: IStateFunctions) {

        sf.setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: this.netCtrl.id });
        sf.setNetworkFocusId(this.netCtrl.id);

        if (event.nodes.length > 0) {

            const node = this.netCtrl.nodes.get(event.nodes[0]) as unknown as IUserData;
            sf.setSelectedObject({ action: ESelectedObjectAction.object, newValue: node, sourceID: this.netCtrl.id });

        } else {
            const bbClicked = this.netCtrl.bbCtrl.isBoundingBoxClicked(event);

            if (bbClicked !== null) {
                const community: ICommunityData = this.netCtrl.bbCtrl.comData[bbClicked];

                sf.setSelectedObject({ action: ESelectedObjectAction.object, newValue: community, sourceID: this.netCtrl.id });
            }
        }
    }

    /**
     * Function executed when a node of this network has been clicked/selected
     * @param nodeId id of the node selected
     * @returns returns the data of the node
     */
    nodeClicked(nodeId: string) {
        const node = this.netCtrl.nodes.get(nodeId) as IUserData;

        if (node === null || node === undefined) {
            return undefined;

        } else {
            this.selectedObject = node;

            const selectedNodes = this.netCtrl.edgeCtrl.selectEdges(node.id);

            this.addZoomToQueue(selectedNodes);

            this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, selectedNodes, [node.id]);
        }

        return node;
    }

    /**
     * Function executed when a community/boundingbox of this network has been clicked/selected.
     * @param community Community selected
     */
    boundingBoxClicked(community: ICommunityData) {
        console.log("Click");
        console.log(this.netCtrl.nodeVisuals.legendConfig);

        this.selectedObject = community;

        const selectedNodes = community.users;
        this.addZoomToQueue(selectedNodes);

        this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, selectedNodes, []);
        this.netCtrl.edgeCtrl.unselectEdges();

        console.log("end click");
        console.log(this.netCtrl.nodeVisuals.legendConfig);
    }

    /**
     * Function executed when a community/boundingbox of an external network has been clicked/selected.
     * @param community Community selected
     */
    externalCommunityClicked(community: ICommunityData) {
        const localNodes = this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, [], community.users);

        this.netCtrl.edgeCtrl.unselectEdges();
        this.addZoomToQueue(localNodes);
    }

    /**
     * Function executed when a community/boundingbox of an external network has been clicked/selected.
     */
    nothingClicked() {
        console.log("no click");
        console.log(this.netCtrl.nodeVisuals.legendConfig);

        this.netCtrl.nodeVisuals.colorAllNodes(this.netCtrl.nodes);
        this.netCtrl.edgeCtrl.unselectEdges();

        this.addZoomToQueue([]);
    }

}