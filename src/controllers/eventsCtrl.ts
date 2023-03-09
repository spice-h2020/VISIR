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
import { IBoundingBox, ISelectedObjectAction, ESelectedObjectAction, IStateFunctions, IAttribute } from "../constants/auxTypes";
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

    /*When the network resizes, resize event is fired about 50 times in a single resize, this timer helps to only get
    one call*/
    resizeEventTimer!: ReturnType<typeof setTimeout>;

    constructor(netController: NetworkController, sf: IStateFunctions, focusedNetId: string) {
        this.netCtrl = netController;
        this.focusedNetId = focusedNetId;

        this.netCtrl.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));

        this.netCtrl.net.on("animationFinished", () => { this.updateTooltipPosition(sf.setSelectedObject) });
        this.netCtrl.net.on("zoom", () => this.updateTooltipPosition(sf.setSelectedObject));
        this.netCtrl.net.on("dragging", () => this.updateTooltipPosition(sf.setSelectedObject));

        this.netCtrl.net.on("resize", () => {

            if (this.resizeEventTimer !== undefined) {
                clearTimeout(this.resizeEventTimer);
            }
            this.resizeEventTimer = setTimeout(() => {
                this.zoomToNodes([])
            }, 250);
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
     * @param nodes ID of the nodes to zoom to. If empty, vis.js will zoom to all nodes
     */
    zoomToNodes(nodes: string[]) {

        const fitOptions: FitOptions = {
            animation: {
                duration: nodeConst.zoomDuration
            } as TimelineAnimationType,
            nodes: nodes
        }

        this.netCtrl.net.fit(fitOptions);
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
            selectedNodes.push(nodeId);

            this.zoomToNodes(selectedNodes);

            this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, selectedNodes, [node.id]);
        }

        return node;
    }

    /**
     * Function executed when a community/boundingbox of this network has been clicked/selected.
     * @param community Community selected
     */
    boundingBoxClicked(community: ICommunityData) {
        this.selectedObject = community;

        const selectedNodes = community.users;
        this.zoomToNodes(selectedNodes);

        this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, selectedNodes, []);
        this.netCtrl.edgeCtrl.unselectEdges();
    }

    /**
     * Function executed when a community/boundingbox of an external network has been clicked/selected.
     * @param community Community selected
     */
    externalCommunityClicked(community: ICommunityData) {
        const localNodes = this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, community.users, [], undefined, community.users);

        this.netCtrl.edgeCtrl.unselectEdges();
        this.zoomToNodes(localNodes);
    }

    /**
     * Function executed when a community/boundingbox of an external network has been clicked/selected.
     */
    nothingClicked() {
        this.netCtrl.nodeVisuals.colorAllNodes(this.netCtrl.nodes);
        this.netCtrl.edgeCtrl.unselectEdges();

        this.zoomToNodes([]);
    }

    selectAttribute(selectedAttribute: IAttribute) {
        let allIds: string[] = [];

        for (const comm of this.netCtrl.explicitCtrl.communitiesData) {
            for (const expl of comm.explanations) {
                if (expl.explanation_key === selectedAttribute.key &&
                    expl.maxValue === selectedAttribute.value) {
                    allIds = allIds.concat(comm.users);
                }
            }
        }
        const allCommunityNodes = this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, allIds, [], undefined, allIds);

        this.netCtrl.edgeCtrl.unselectEdges();
        this.zoomToNodes(allCommunityNodes);
    }
}