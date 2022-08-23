/**
 * @fileoverview This class find all explicit communities and its values in the user data of the perspective. 
 * Then create a dimension strategy that changes how the network ndoes look based on the explicitData.
 * Then it changes the node position in the canvas to create a circular distribution without node overlap.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { PerspectiveInfo, PerspectiveData, UserData } from "../namespaces/perspectivesTypes";
import { Dimensions, DimAttribute, nodeConst } from "../namespaces/nodes"
//Local files
import NodeDimensionStrategy from "./dimensionStrategy";
import { ViewOptions } from "../namespaces/ViewOptions";
import { DataSet, DataSetNodes, Node } from "vis-network";

//Aux class to help mantain and collect all the values of an Explicit Community
class ExplicitData {
    key: string;
    values: string[];

    /**
     * Constructor of the class
     * @param key Key of the explicit community
     * @param value Initial value of the explicit community
     */
    constructor(key: string, value: string) {
        this.key = key;
        this.values = new Array<string>();
        this.values.push(value);
    }
}

interface Point {
    x: number;
    y: number;
}

//Aux class to help group nodes in their partition of the canvas's layout
interface NodeGroup {
    nodes: number[],
    partition: {
        center: Point,
        nNodes: number
    }
}

//TODO update the initial node visuals with the view options
export default class NodeVisuals {

    //All explicit Data of the users
    explicitData: ExplicitData[];
    //Current active dimensions strat
    dimensionsStrat!: NodeDimensionStrategy;
    //Atributes with the relations between explicit communities and their dimensions
    attributes!: DimAttribute[];
    //Nodes of the network
    nodes: DataSetNodes;
    /**
     * Constructor of the class
     * @param PerspectiveInfo Perspective info of the perspective that uses this object
     */
    constructor(PerspectiveData: PerspectiveData, nodes: DataSetNodes, setLegendData: Function, viewOptions: ViewOptions) {
        this.explicitData = new Array<ExplicitData>();
        this.nodes = nodes;

        this.obtainExplicitData();
        this.createNodeDimensionStrategy(viewOptions);

        this.updateNodeLocation(PerspectiveData);
        this.hideLabels(viewOptions.HideLabels);

        setLegendData(this.attributes);
    }

    /**
     * Ibtain the explicit data from the explicit communities of the UserData
     * @param UsersData 
     */
    obtainExplicitData() {
        this.nodes.forEach((node) => {
            const user = node as UserData;

            const explicitKeys = Object.keys(user.explicit_community);
            explicitKeys.forEach((key) => {

                if (this.explicitData.length === 0) {
                    this.explicitData.push(new ExplicitData(key, user.explicit_community[key]));
                } else {

                    let keyValues = this.explicitData.find(element => element.key === key);

                    if (keyValues !== undefined) {
                        if (!keyValues.values.includes(user.explicit_community[key])) {
                            keyValues.values.push(user.explicit_community[key]);
                        }
                    } else {
                        this.explicitData.push(new ExplicitData(key, user.explicit_community[key]));
                    }
                }
            });
        });
    }

    /**
     * Create the node dimension strategy and its necesary attributes
     */
    createNodeDimensionStrategy(viewOptions: ViewOptions) {
        this.attributes = new Array<DimAttribute>();

        if (this.explicitData[0] !== undefined) {
            this.attributes.push({
                key: this.explicitData[0].key,
                values: this.explicitData[0].values,
                dimension: Dimensions.Color,
            })
        }

        if (this.explicitData[1] !== undefined) {
            this.attributes.push({
                key: this.explicitData[1].key,
                values: this.explicitData[1].values,
                dimension: Dimensions.Shape,
            })
        }

        //TODO link the allow third dimension option tho this
        if (this.explicitData[2] !== undefined && viewOptions.Border) {
            this.attributes.push({
                key: this.explicitData[2].key,
                values: this.explicitData[2].values,
                dimension: Dimensions.Border,
            })
        }

        this.dimensionsStrat = new NodeDimensionStrategy(this.attributes);
        this.updateLegendConfig(viewOptions.LegendConfig);
    }

    /**
     * Update node dimensions to default state
     * @param UsersData users to update
     */
    updateNodeDimensionsToDefault() {
        if (this.dimensionsStrat !== undefined) {


            this.nodes.forEach((node) => {
                this.dimensionsStrat?.nodeToDefault(node as UserData);
            });

        } else {
            console.log("Trying to update node visuals without dimension strat being defined")
        }
    }

    /**
     * Update the location of the nodes in the canvas to resemble a circle without node overlaps
     * @param networkData Data of the perspective
     */
    updateNodeLocation(networkData: PerspectiveData) {
        const nAreas = networkData.communities.length;

        const areaPartitions: Point[] = this.createNetworkPartitions(networkData.users.length, nAreas);
        const nodesGrouped: Array<NodeGroup> = new Array<NodeGroup>();

        for (let i = 0; i < nAreas; i++) {
            nodesGrouped.push({
                nodes: new Array<number>(),
                partition: {
                    center: areaPartitions[i],
                    nNodes: 0
                }
            })
        }

        //Insert the nodes in each nodeGroup
        this.nodes.forEach((node) => {
            const user = node as UserData;
            const group = user.implicit_community;

            nodesGrouped[group].nodes.push(user.id);
            nodesGrouped[group].partition.nNodes++;
        });

        //Set the location for all nodes
        this.nodes.forEach((node) => {
            const user = node as UserData;
            const group = user.implicit_community;
            const nodePos: Point = this.getNodePos(nodesGrouped[group], user.id);

            user.x = nodePos.x;
            user.y = nodePos.y;
        });
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
    getNodePos(group: NodeGroup, nodeId: number): Point {
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

    //TODO dont color to default nodes that should be hidden by a node selection
    /**
     * Updates the visuals of all nodes to match the legend configuration
     * @param legendConfig Legend configuration
     * @param nodes nodes that will be edited
     */
    updateLegendConfig(legendConfig: Map<string, boolean>) {
        if (legendConfig.size !== 0) {

            const newNodes = new Array<UserData>();
            this.nodes.forEach((node: Node) => {

                const user: UserData = node as UserData;
                const keys = Object.keys(user.explicit_community);

                let toColorless = false;
                for (let i = 0; i < keys.length && !toColorless; i++) {
                    const value = user.explicit_community[keys[i]]
                    if (legendConfig.get(value) === false)
                        toColorless = true;
                }

                if (toColorless) {
                    this.dimensionsStrat.nodeToColorless(user);
                } else {
                    this.dimensionsStrat.nodeToDefault(user);
                }
                newNodes.push(user);
            });

            this.nodes.update(newNodes)
        } else {
            this.updateNodeDimensionsToDefault();
        }
    }

    hideLabels(HideLabels: boolean) {
        const newNodes = new Array<UserData>();

        this.nodes.forEach((node) => {
            const user = node as UserData;

            if (HideLabels)
                user.font.color = "#00000000"
            else
                user.font.color = "#000000FF"

            newNodes.push(user);
        });
        this.nodes.update(newNodes);
    }
}


