/**
 * @fileoverview This class find all explicit communities and its values in the user data of the perspective. 
 * Then create a dimension strategy that changes how the network ndoes look based on the explicitData.
 * Then it changes the node position in the canvas to create a circular distribution without node overlap.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { UserData } from "../constants/perspectivesTypes";
import { Dimensions, DimAttribute } from "../constants/nodes"
import { ViewOptions } from "../constants/viewOptions";
import { StateFunctions } from "../constants/auxTypes";
//Packages
import { DataSetNodes, Node } from "vis-network";
//Local files
import NodeDimensionStrategy from "../managers/nodeDimensionStat";
import { ExplicitData } from "./nodeExplicitComms";

export default class NodeVisualsCtrl {
    dimStrat: NodeDimensionStrategy;
    legendConfig: Map<string, boolean>;

    selectedNodes: Array<string>;
    focusedNodes: Array<string>;

    constructor(dimStrat: NodeDimensionStrategy | undefined, sf: StateFunctions, explicitData: ExplicitData[], viewOptions: ViewOptions, allNodes: string[]) {

        if (dimStrat === undefined) {
            this.dimStrat = this.createDimensionStrategy(explicitData, viewOptions.border, sf.setLegendData);
            sf.setDimensionStrategy(this.dimStrat);
        } else {
            this.dimStrat = dimStrat;
        }
        this.legendConfig = viewOptions.legendConfig;

        this.selectedNodes = new Array<string>();
        this.focusedNodes = new Array<string>();
    }


    createDimensionStrategy(explicitData: ExplicitData[], showBorder: boolean, setLegendData: Function) {
        const attributes = new Array<DimAttribute>();

        if (explicitData[0] !== undefined) {
            attributes.push({
                key: explicitData[0].key,
                values: explicitData[0].values,
                dimension: Dimensions.Color,
                active: true
            })
        }

        if (explicitData[1] !== undefined) {
            attributes.push({
                key: explicitData[1].key,
                values: explicitData[1].values,
                dimension: Dimensions.Shape,
                active: true
            })
        }

        if (explicitData[2] !== undefined) {
            attributes.push({
                key: explicitData[2].key,
                values: explicitData[2].values,
                dimension: Dimensions.Border,
                active: showBorder
            })
        }

        return new NodeDimensionStrategy(attributes, setLegendData);
    }

    setNodeInitialVisuals(node: UserData, hideLabel: boolean) {

        if (this.isHidedByLegend(node as UserData)) {
            this.hideNodeVisuals(node as UserData);
        } else {
            this.coloredNodeVisuals(node as UserData);
        }

        this.updateNodeLabel(node, hideLabel);
    }

    toggleNodeLabels(allNodes: DataSetNodes, hideLabel: boolean) {
        const newNodes: Node[] = new Array<Node>();

        allNodes.forEach((node) => {

            this.updateNodeLabel(node as UserData, hideLabel);
            newNodes.push(node);

        })

        allNodes.update(newNodes);
    }

    updateNodeLabel(node: UserData, hideLabel: boolean) {
        if (hideLabel) {
            if (node.font !== undefined) {
                node.font.color = "#00000000"
            } else {
                node.font = {
                    color: "#00000000"
                }
            }
        }
        else {
            if (node.font !== undefined) {
                node.font.color = "#000000FF"
            } else {
                node.font = {
                    color: "#000000FF"
                }
            }
        }
    }

    selectNodes(allNodes: DataSetNodes, selectedNodes: string[], focusedId: string[], legendConfig: Map<string, boolean> = new Map<string, boolean>()) {
        const newNodes: Node[] = new Array<Node>();
        this.selectedNodes = selectedNodes;
        this.focusedNodes = focusedId;

        this.legendConfig = legendConfig === undefined ? this.legendConfig : legendConfig;

        allNodes.forEach((node) => {
            const id = node.id;
            if (this.isHidedByLegend(node as UserData)) {
                this.hideNodeVisuals(node as UserData);

            } else if (selectedNodes.includes(id as string)) {
                this.coloredNodeVisuals(node as UserData);

            } else if (focusedId.includes(id as string)) {
                this.focusedNodeVisuals(node as UserData);

            } else {
                this.hideNodeVisuals(node as UserData);
            }

            newNodes.push(node);
        })

        allNodes.update(newNodes);
    }

    colorAllNodes(allNodes: DataSetNodes, legendConfig: Map<string, boolean> = new Map<string, boolean>()) {
        const newNodes: Node[] = new Array<Node>();
        this.selectedNodes = [];
        this.focusedNodes = [];

        this.legendConfig = legendConfig.size === 0 ? this.legendConfig : legendConfig;

        allNodes.forEach((node) => {
            if (this.isHidedByLegend(node as UserData)) {
                this.hideNodeVisuals(node as UserData);
            } else {
                this.coloredNodeVisuals(node as UserData);
            }

            newNodes.push(node);
        })

        allNodes.update(newNodes);
    }

    coloredNodeVisuals(node: UserData) {
        this.dimStrat.nodeToDefault(node);
    }

    focusedNodeVisuals(node: UserData) {
        this.dimStrat.nodeToDefault(node, true);
    }

    hideNodeVisuals(node: UserData) {
        this.dimStrat.nodeToColorless(node);
    }

    isHidedByLegend(node: UserData) {
        let hideNode = false;
        const keys = Object.keys(node.explicit_community);

        for (let i = 0; i < keys.length; i++) {
            const value = node.explicit_community[keys[i]]

            if (this.legendConfig!.get(value)) {
                hideNode = true;
                break;
            }
        }

        return hideNode;
    }

}


