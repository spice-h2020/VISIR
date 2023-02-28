/**
 * @fileoverview This class separates nodes in groups based on their implicit communities and order each group 
 * in a circular pattern.
 * It also separates each node in a group to create another circular pattern inside the group.
 * If a group has a medoid node, it will be placed in the middle of the group.
 * @author Marco Expósito Pérez
 */
//Constants
import { IBoundingBox, IPoint } from "../constants/auxTypes";
import { nodeConst } from "../constants/nodes";
import { ECommunityType, ICommunityData, IUserData } from "../constants/perspectivesTypes";
import config from '../appConfig.json';
/**
 * Aux interface to help group nodes in their partition of the canvas's layout
 */
interface INodeGroup {
    nodes: string[],
    partition: {
        center: IPoint,
        nNodes: number
    },
    bb: IBoundingBox
}

export default class NodeLocation {

    nodeGroups: Array<INodeGroup>
    allCommData: ICommunityData[];
    radiusMultiplier: number;
    /**
     * Constructor of the class
     * @param allCommData all communities Data
     * @param nNodes number of nodes
     */
    constructor(allCommData: ICommunityData[]) {
        this.radiusMultiplier = 1;
        this.allCommData = allCommData;
        this.nodeGroups = new Array<INodeGroup>();

        this.initializeNodeGroups();
    }

    initializeNodeGroups() {
        for (let i = 0; i < this.allCommData.length; i++) {
            const areaPartition: IPoint = this.findCommunityCenter(this.allCommData[i], i, this.allCommData.length);

            const nNodes = this.nodeGroups[i] ? this.nodeGroups[i].partition.nNodes : 0;
            const users = this.nodeGroups[i] ? this.nodeGroups[i].nodes : new Array<string>();

            this.nodeGroups[i] = {
                nodes: users,
                partition: {
                    center: areaPartition,
                    nNodes: nNodes,
                },
                bb: { top: areaPartition.y, bottom: areaPartition.y, left: areaPartition.x, right: areaPartition.x }
            }
        }
    }

    findCommunityCenter(commData: ICommunityData, order: number, nAreas: number) {
        const distanceFromCenter = nAreas * 50;
        const pi2 = (2 * Math.PI);

        //Separate the network area in as many angle slices as necesary
        const angleSlice = (pi2 / nAreas) * order;

        return {
            x: parseFloat((Math.cos(angleSlice) * (distanceFromCenter * this.radiusMultiplier)).toFixed(3)),
            y: parseFloat((Math.sin(angleSlice) * (distanceFromCenter * this.radiusMultiplier)).toFixed(3))
        } as IPoint;
    }

    /**
     * Add the node to the its group
     * @param node source node
     */
    updateNodeGroup(node: IUserData) {
        const group = node.implicit_community;

        if (!node.isMedoid) {
            this.nodeGroups[group].nodes.push(node.id);
            this.nodeGroups[group].partition.nNodes++;
        }
    }

    /**
     * Set the node location to its position in the group
     * @param node node to edit
     */
    setNodeLocation(node: IUserData, communityType: ECommunityType) {
        const group = node.implicit_community;

        if (node.isMedoid && communityType !== ECommunityType.inexistent) {

            node.x = this.nodeGroups[group].partition.center.x;
            node.y = this.nodeGroups[group].partition.center.y;

        } else {
            const nodePos: IPoint = this.getNodePos(this.nodeGroups[group], node.id, communityType);

            node.x = nodePos.x;
            node.y = nodePos.y;

            this.nodeGroups[group].bb.left = this.nodeGroups[group].bb.left > nodePos.x ? nodePos.x : this.nodeGroups[group].bb.left;
            this.nodeGroups[group].bb.right = this.nodeGroups[group].bb.right < nodePos.x ? nodePos.x : this.nodeGroups[group].bb.right;
            this.nodeGroups[group].bb.top = this.nodeGroups[group].bb.top > nodePos.y ? nodePos.y : this.nodeGroups[group].bb.top;
            this.nodeGroups[group].bb.bottom = this.nodeGroups[group].bb.bottom < nodePos.y ? nodePos.y : this.nodeGroups[group].bb.bottom;
        }
    }

    /**
     * Gets the exact node's coordinates in the canvas
     * @param group Node group of the node
     * @param nodeId id of the node
     * @returns point coordinates
     */
    getNodePos(group: INodeGroup, nodeId: string, communityType: ECommunityType): IPoint {
        let size = group.partition.nNodes < 7 ? 8 : group.partition.nNodes;
        const center = group.partition.center;
        const nodeIndex = group.nodes.indexOf(nodeId);

        let output = { x: 0, y: 0 };

        if (communityType === ECommunityType.implicit) {

            const angleSlice = (2 * Math.PI) / group.partition.nNodes;
            let targetAngle = angleSlice * nodeIndex;

            output.x = center.x + Math.cos(targetAngle) * size * nodeConst.betweenNodesDistance;
            output.y = center.y + Math.sin(targetAngle) * size * nodeConst.betweenNodesDistance;

            output.x = parseFloat(output.x.toFixed(10));
            output.y = parseFloat(output.y.toFixed(10));

        } else {

            const rows = Math.ceil(Math.sqrt(size));

            const xIndex = Math.ceil(nodeIndex % rows);
            const yIndex = nodeIndex / rows;

            output.x = center.x + xIndex * 30;
            output.y = center.y + yIndex * 30;
        }

        return output;
    }

    needMoreIterations(): boolean {
        for (let i = 0; i < this.nodeGroups.length; i++) {
            const bbToCheck = this.nodeGroups[i].bb;
            for (let j = i + 1; j < this.nodeGroups.length; j++) {
                const secondaryBB = this.nodeGroups[j].bb;

                if (this.areBoundingBoxesOverlaping(bbToCheck, secondaryBB)) {
                    this.radiusMultiplier *= config.NODE_RELOCATION_INCREMENT;
                    this.initializeNodeGroups();
                    return true;
                }
            }
        }

        return false;
    }

    areBoundingBoxesOverlaping(a: IBoundingBox, b: IBoundingBox) {
        if (a.right + 40 > b.left && b.right + 40 > a.left &&
            a.bottom + 40 > b.top && b.bottom + 40 > a.top) {
            return true;
        }
        return false;
    }
}