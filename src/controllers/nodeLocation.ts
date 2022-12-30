/**
 * @fileoverview This class separates nodes in groups based on their implicit communities and order each group 
 * in a circular pattern.
 * It also separates each node in a group to create another circular pattern inside the group.
 * If a group has a medoid node, it will be placed in the middle of the group.
 * @author Marco Expósito Pérez
 */
//Constants
import { IPoint } from "../constants/auxTypes";
import { nodeConst } from "../constants/nodes";
import { ICommunityData, IUserData } from "../constants/perspectivesTypes";

/**
 * Aux interface to help group nodes in their partition of the canvas's layout
 */
interface INodeGroup {
    nodes: string[],
    partition: {
        center: IPoint,
        nNodes: number
    }
}

export default class NodeLocation {

    nodeGroups!: Array<INodeGroup>

    /**
     * Constructor of the class
     * @param nCommunities number of communities
     * @param nNodes number of nodes
     */
    constructor(nCommunities: number, nNodes: number) {
        this.initializeNodeGroups(nCommunities, nNodes);
    }

    initializeNodeGroups(nCommunities: number, nNodes: number) {
        const nAreas = nCommunities;
        const areaPartitions: IPoint[] = this.createNetworkPartitions(nNodes, nAreas);
        this.nodeGroups = new Array<INodeGroup>();

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

    /**
     * Create partitions in a circle to slot every node group
     * @param nUsers number of users
     * @param nAreas number of areas to make
     * @returns returns an array with the center poin of each partition
     */
    createNetworkPartitions(nUsers: number, nAreas: number): IPoint[] {
        const partitionsDistance = nUsers + nodeConst.groupsBaseDistance + (nAreas * 4);
        const pi2 = (2 * Math.PI);

        //Separate the network area in as many angle slices as necesary
        const angleSlice = pi2 / nAreas;
        let targetAngle = 0;

        //Increase the target angle for every group, and set the location of each area partition
        const areaPartitions = [];
        for (let i = 0; targetAngle < pi2; i++) {
            areaPartitions[i] = {
                x: parseFloat((Math.cos(targetAngle) * (partitionsDistance * nAreas)).toFixed(3)),
                y: parseFloat((Math.sin(targetAngle) * (partitionsDistance * nAreas)).toFixed(3))
            };

            targetAngle += angleSlice;
        }


        return areaPartitions as IPoint[];
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
    setNodeLocation(node: IUserData) {
        const group = node.implicit_community;

        if (node.isMedoid) {

            node.x = this.nodeGroups[group].partition.center.x;
            node.y = this.nodeGroups[group].partition.center.y;

        } else {
            const nodePos: IPoint = this.getNodePos(this.nodeGroups[group], node.id);

            node.x = nodePos.x;
            node.y = nodePos.y;
        }
    }

    /**
     * Gets the exact node's coordinates in the canvas
     * @param group Node group of the node
     * @param nodeId id of the node
     * @returns point coordinates
     */
    getNodePos(group: INodeGroup, nodeId: string): IPoint {
        let size = group.partition.nNodes < 7 ? 8 : group.partition.nNodes;

        const center = group.partition.center;
        const nodeIndex = group.nodes.indexOf(nodeId);;

        const output = { x: 0, y: 0 };

        const angleSlice = (2 * Math.PI) / group.partition.nNodes;
        let targetAngle = angleSlice * nodeIndex;

        output.x = center.x + Math.cos(targetAngle) * size * nodeConst.betweenNodesDistance;
        output.y = center.y + Math.sin(targetAngle) * size * nodeConst.betweenNodesDistance;

        output.x = parseFloat(output.x.toFixed(10));
        output.y = parseFloat(output.y.toFixed(10));

        return output;
    }
}