/**
 * @fileoverview Calculate and draw the bounding boxes of users with the same implicit community.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { Point } from "../constants/auxTypes";
import { nodeConst } from "../constants/nodes";
import { UserData } from "../constants/perspectivesTypes";


//Local aux interface to help group nodes in their partition of the canvas's layout
interface NodeGroup {
    nodes: string[],
    partition: {
        center: Point,
        nNodes: number
    }
}

export default class NodeLocation {

    nodeGroups: Array<NodeGroup>
    /**

     */
    constructor(nCommunities: number, nNodes: number) {
        const nAreas = nCommunities;

        const areaPartitions: Point[] = this.createNetworkPartitions(nNodes, nAreas);
        this.nodeGroups = new Array<NodeGroup>();

        for (let i = 0; i < nAreas; i++) {
            this.nodeGroups.push({
                nodes: new Array<string>(),
                partition: {
                    center: areaPartitions[i],
                    nNodes: 0
                }
            })
        }
    }


    updateNodeGroup(node: UserData) {
        const group = node.implicit_community;

        this.nodeGroups[group].nodes.push(node.id);
        this.nodeGroups[group].partition.nNodes++;
    }

    setNodeLocation(node: UserData) {
        const group = node.implicit_community;
        const nodePos: Point = this.getNodePos(this.nodeGroups[group], node.id);

        node.x = nodePos.x;
        node.y = nodePos.y;
    }

    /**
     * Create partitions in a circle to slot every implicit community
     * @param nUsers number of users
     * @param nAreas number of areas to make
     * @returns returns an array with the center poin of each partition
     */
    createNetworkPartitions(nUsers: number, nAreas: number): Point[] {
        const partitionsDistance = nodeConst.groupsBaseDistance * nUsers / 45;
        const pi2 = (2 * Math.PI);

        //Separate the network area in as many angle slices as necesary
        const angleSlice = pi2 / nAreas;
        let targetAngle = 0;

        //Increase the target angle for every group, and set the location of each area partition
        const areaPartitions = [];
        for (let i = 0; targetAngle < pi2; i++) {
            areaPartitions[i] = {
                x: Math.cos(targetAngle) * (partitionsDistance * nAreas),
                y: Math.sin(targetAngle) * (partitionsDistance * nAreas)
            };

            targetAngle += angleSlice;
        }


        return areaPartitions as Point[];
    }

    /**
     * Gets the exact node coordinates in the canvas
     * @param group Node group of the node
     * @param nodeId id of the node
     * @returns point coordinates
     */
    getNodePos(group: NodeGroup, nodeId: string): Point {
        const size = group.partition.nNodes;
        const center = group.partition.center;
        const nodeIndex = group.nodes.indexOf(nodeId);;

        const output = { x: 0, y: 0 };

        const angleSlice = (2 * Math.PI) / size;
        let targetAngle = angleSlice * nodeIndex;

        output.x = center.x + Math.cos(targetAngle) * size * nodeConst.betweenNodesDistance;
        output.y = center.y + Math.sin(targetAngle) * size * nodeConst.betweenNodesDistance;

        return output;
    }
}