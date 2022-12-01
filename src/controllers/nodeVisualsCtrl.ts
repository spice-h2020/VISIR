/**
 * @fileoverview This class creates the dimensions strategy object if its undefined, using the explicit data obtained by
 * the nodeExplicitComms class and changes the visuals of nodes to meet the dimension strategy values.
 * 
 * This class also changes the nodes' visuals dependin on their focused, selected or unselected state, increasing or
 * reducing their visibility respectively.
 * 
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { IUserData } from "../constants/perspectivesTypes";
import { Dimensions, DimAttribute, nodeConst } from "../constants/nodes"
import { ViewOptions } from "../constants/viewOptions";
import { ILegendDataAction, IStateFunctions } from "../constants/auxTypes";
//Packages
import { DataSetNodes, Node } from "vis-network";
//Local files
import NodeDimensionStrategy from "../managers/nodeDimensionStrat";
import { ExplicitData } from "./nodeExplicitComms";

export default class NodeVisualsCtrl {
    dimStrat: NodeDimensionStrategy;
    legendConfig: Map<string, Map<string, boolean>>;

    /**
     * Nodes that are currently selected
     */
    selectedNodes: Array<string>;
    /**
     * Nodes that the user specificaly selected and its focused on.
     */
    focusedNodes: Array<string>;

    /**
     * Constructor of the class
     * @param dimStrat Dimension strategy that changes how nodes' are seieng
     * @param sf Functions that change the state
     * @param explicitData All the explicit data of this network
     * @param viewOptions Options that change how the network is seeing
     */
    constructor(dimStrat: NodeDimensionStrategy | undefined, sf: IStateFunctions, explicitData: ExplicitData[],
        viewOptions: ViewOptions, unique: boolean) {

        if (dimStrat === undefined || unique) {
            this.dimStrat = this.createDimensionStrategy(explicitData, viewOptions.border, sf.setLegendData);
            sf.setDimensionStrategy(this.dimStrat);
        } else {
            this.dimStrat = dimStrat;
        }
        this.legendConfig = viewOptions.legendConfig;

        this.selectedNodes = new Array<string>();
        this.focusedNodes = new Array<string>();
    }

    /**
     * Creates a new dimension strategy based on the explicit data of the network
     * @param explicitData All the explicit data of this network
     * @param showBorder Option that toggles the border of a network in the legend
     * @param setLegendData Set the legend data to update the legend contents
     * @returns Returns the new created dimension strategy
     */
    createDimensionStrategy(explicitData: ExplicitData[], showBorder: boolean, setLegendData: React.Dispatch<ILegendDataAction>) {
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

    setNodeInitialVisuals(node: IUserData, hideLabel: boolean) {
        if (this.isHidedByLegend(node as IUserData)) {
            this.hideNodeVisuals(node as IUserData);
        } else {
            this.coloredNodeVisuals(node as IUserData);
        }

        this.updateNodeLabel(node, hideLabel);
    }

    toggleNodeLabels(allNodes: DataSetNodes, hideLabel: boolean) {
        const newNodes: Node[] = new Array<Node>();

        allNodes.forEach((node) => {

            this.updateNodeLabel(node as IUserData, hideLabel);
            newNodes.push(node);

        })

        allNodes.update(newNodes);
    }

    updateNodeLabel(node: IUserData, hideLabel: boolean) {
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

    /**
     * Change the visuals of all node based on the parameters and update the selected and focused nodes arrays
     * @param allNodes all nodes of the network
     * @param selectedNodes node array that will have its visuals to the base colored state
     * @param focusedId node array that will change node visuals to a colored and focused state
     * @param legendConfig Optional parameters that if included, will update the legend configuration of this network
     * @return Returns an array with the id of the focusedNodes that exist in this network. Its used to filter what 
     * nodes are from this network and what are from other networks
     */
    selectNodes(allNodes: DataSetNodes, selectedNodes: string[], focusedId: string[],
        legendConfig: Map<string, Map<string, boolean>> | undefined = undefined) {

        const newNodes: Node[] = new Array<Node>();
        this.selectedNodes = selectedNodes;
        this.focusedNodes = focusedId;

        this.legendConfig = legendConfig === undefined ? this.legendConfig : legendConfig;

        const existingNodes: string[] = [];

        allNodes.forEach((node) => {
            const id = node.id;
            if (this.isHidedByLegend(node as IUserData)) {
                this.hideNodeVisuals(node as IUserData);

            } else if (selectedNodes.includes(id as string)) {
                this.coloredNodeVisuals(node as IUserData);

            } else if (focusedId.includes(id as string)) {
                existingNodes.push(id as string);
                this.focusedNodeVisuals(node as IUserData);

            } else {
                this.hideNodeVisuals(node as IUserData);
            }

            newNodes.push(node);
        })

        allNodes.update(newNodes);

        return existingNodes;
    }

    /**
     * Shortcut to reset all nodes to their colored state based on the legend configuration
     * @param allNodes all nodes of the network
     * @param legendConfig Optional parameters that if included, will update the legend configuration of this network
     */
    colorAllNodes(allNodes: DataSetNodes, legendConfig: Map<string, Map<string, boolean>> | undefined = undefined) {
        const newNodes: Node[] = new Array<Node>();
        this.selectedNodes = [];
        this.focusedNodes = [];

        this.legendConfig = legendConfig === undefined ? this.legendConfig : legendConfig;

        allNodes.forEach((node) => {
            if (this.isHidedByLegend(node as IUserData)) {
                this.hideNodeVisuals(node as IUserData);
            } else {
                this.coloredNodeVisuals(node as IUserData);
            }

            newNodes.push(node);
        })

        allNodes.update(newNodes);
    }

    coloredNodeVisuals(node: IUserData) {
        this.dimStrat.nodeToDefault(node);
    }

    focusedNodeVisuals(node: IUserData) {
        this.dimStrat.nodeToDefault(node, true);
    }

    hideNodeVisuals(node: IUserData) {
        this.dimStrat.nodeToColorless(node);
    }

    isHidedByLegend(node: IUserData) {
        let hideNode = false;
        const keys = Object.keys(node.explicit_community);


        for (let i = 0; i < keys.length; i++) {
            const value = node.explicit_community[keys[i]]
            const valuesMap = this.legendConfig.get(keys[i]);

            if (valuesMap?.get(value)) {
                hideNode = true;
                break;
            }
        }

        if (node.isAnonymous && this.legendConfig!.get(`${nodeConst.anonymousGroupKey}User`)?.get(`${nodeConst.anonymousGroupKey}User`)) {
            hideNode = true;
        }

        return hideNode;
    }

}


