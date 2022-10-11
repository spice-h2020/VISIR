/**
 * @fileoverview Calculate and draw the bounding boxes of users with the same implicit community.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { CommunityData, UserData } from "../constants/perspectivesTypes";
import { BoundingBox, SelectedObjectAction, SelectedObjectActionEnum, StateFunctions } from "../constants/auxTypes";
//Packages
import { FitOptions, TimelineAnimationType } from "vis-network";
import NetworkController from "./networkController";
import { Dispatch } from "react";
import { getHTMLPosition } from "../basicComponents/Tooltip";
import { nodeConst } from "../constants/nodes";

export default class EventsCtrl {
    netCtrl: NetworkController;
    focusedNetId: string;

    //Current tooltip data before being parsed
    selectedObject?: UserData | CommunityData;

    constructor(netController: NetworkController, sf: StateFunctions, focusedNetId: string) {
        this.netCtrl = netController;
        this.focusedNetId = focusedNetId;

        this.netCtrl.net.on("beforeDrawing", (ctx) => this.beforeDrawing(ctx));

        this.netCtrl.net.on("animationFinished", () => this.updateTooltipPosition(sf.setSelectedObject));
        this.netCtrl.net.on("zoom", () => this.updateTooltipPosition(sf.setSelectedObject));
        this.netCtrl.net.on("dragging", () => this.updateTooltipPosition(sf.setSelectedObject));

        this.netCtrl.net.on("resize", () => this.zoomToNodes([]));

        this.netCtrl.net.on("click", (event) => this.click(event, sf));
    }

    beforeDrawing(ctx: CanvasRenderingContext2D) {
        this.netCtrl.bbCtrl.drawBoundingBoxes(ctx);
    }

    updateTooltipPosition(setSelectedObject: Dispatch<SelectedObjectAction>) {

        if (this.netCtrl.id === this.focusedNetId) {
            if (this.selectedObject !== undefined) {

                const refPosition = getHTMLPosition(this.netCtrl.htmlRef);

                let x: number;
                let y: number;

                //If the tooltip data is a node
                if (this.selectedObject?.explanation === undefined) {
                    const node = this.selectedObject as UserData;

                    const nodePositionInDOM = this.netCtrl.net.canvasToDOM(this.netCtrl.net.getPosition(node.id));

                    //Depending on the zoom level and node size, we add offset to the coordinates of the tooltip
                    x = nodePositionInDOM.x + refPosition.left + 18 + 1.7 * (node.size * this.netCtrl.net.getScale());
                    y = nodePositionInDOM.y + refPosition.top + node.size / 2 - 3;

                } else {
                    const community = this.selectedObject as CommunityData;

                    const bb = community.bb as BoundingBox;

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

                    setSelectedObject({ action: SelectedObjectActionEnum.position, newValue: { x: x, y: y }, sourceID: this.netCtrl.id });

                } else {
                    setSelectedObject({ action: SelectedObjectActionEnum.position, newValue: undefined, sourceID: this.netCtrl.id });
                }
            }

        } else {
            this.selectedObject = undefined;
        }
    }

    /**
     * Zoom out to fit all nodes in the image
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

    click(event: any, sf: StateFunctions) {

        sf.setSelectedObject({ action: SelectedObjectActionEnum.clear, newValue: undefined, sourceID: this.netCtrl.id });
        sf.setNetworkFocusId(this.netCtrl.id);

        if (event.nodes.length > 0) {

            const node = this.netCtrl.nodes.get(event.nodes[0]) as unknown as UserData;
            sf.setSelectedObject({ action: SelectedObjectActionEnum.object, newValue: node, sourceID: this.netCtrl.id });

        } else {
            const bbClicked = this.netCtrl.bbCtrl.isBoundingBoxClicked(event);

            if (bbClicked !== null) {
                const community: CommunityData = this.netCtrl.bbCtrl.comData[bbClicked];

                sf.setSelectedObject({ action: SelectedObjectActionEnum.object, newValue: community, sourceID: this.netCtrl.id });
            }
        }
    }


    nodeClicked(nodeId: string) {
        const node = this.netCtrl.nodes.get(nodeId) as UserData;

        if (node === undefined) {
            return undefined;

        } else {
            this.selectedObject = node;

            const selectedNodes = this.netCtrl.edgeCtrl.selectEdges(node.id);
            this.zoomToNodes(selectedNodes);

            this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, selectedNodes, [node.id]);
        }

        return node;
    }

    boundingBoxClicked(community: CommunityData) {
        this.selectedObject = community;

        const selectedNodes = community.users;
        this.zoomToNodes(selectedNodes);

        this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, selectedNodes, []);
        this.netCtrl.edgeCtrl.unselectEdges();
    }

    externalCommunityClicked(community: CommunityData) {
        this.netCtrl.nodeVisuals.selectNodes(this.netCtrl.nodes, [], community.users);
        this.netCtrl.edgeCtrl.unselectEdges();

        this.zoomToNodes(community.users);
    }

    nothingClicked(zoom: boolean = true) {
        this.netCtrl.nodeVisuals.colorAllNodes(this.netCtrl.nodes);
        this.netCtrl.edgeCtrl.unselectEdges();

        if (zoom)
            this.zoomToNodes([]);
    }
}