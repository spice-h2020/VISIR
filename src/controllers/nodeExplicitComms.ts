/**
 * @fileoverview This class parse the node's explicit communities, calculates the % of users that have a determined
 * explicit community value and find the medoid user if the community explanation is configured to.
 * @author Marco Expósito Pérez
 */
//Constants
import { ICommunityExplanation, ICommunityData, EExplanationTypes, IExplicitCommData, IUserData } from "../constants/perspectivesTypes";
//Local files
import NodeDimensionStrategy from "../managers/nodeDimensionStat";

//Aux class to help structure and collect all the values of an Explicit Community
export class ExplicitData {
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

export default class NodeExplicitComms {
    /**
     * Parsed explicit data
    */
    explicitData: ExplicitData[];
    /**
     * Data of all communities
     */
    communitiesData: ICommunityData[];
    /**
     * ID of all medoid nodes
     */
    medoidNodes: string[];

    /**
     * Constructor of the class
     * @param communitiesData 
     */
    constructor(communitiesData: ICommunityData[]) {
        this.explicitData = new Array<ExplicitData>();

        this.communitiesData = communitiesData;
        this.medoidNodes = [];

        this.communitiesData.forEach((comm: ICommunityData) => {
            comm.explanations.forEach((expl: ICommunityExplanation) => {
                if (expl.explanation_type === EExplanationTypes.medoid && expl.explanation_data.id !== undefined) {
                    this.medoidNodes.push((expl.explanation_data.id).toString());
                }
            })

            comm.anonUsers = [];
        });

    }

    /**
     * Parse the explicit community data of the node 
     * @param node source node
     * @param dimStrat dimension strategy controller
     */
    parseExplicitCommunity(node: IUserData, dimStrat: NodeDimensionStrategy | undefined) {

        const explicitKeys = Object.keys(node.explicit_community);

        if (explicitKeys.length === 0) {
            node.isAnonimous = true;
            this.communitiesData[node.implicit_community].anonUsers.push(node.id);
        } else {
            node.isAnonimous = false;

            explicitKeys.forEach((key) => {

                if (dimStrat === undefined) {
                    this.updateExplicitData(key, node);
                }

                node.isMedoid = this.medoidNodes.includes(node.id);

                this.updateCommunitiesData(key, node);
            });
        }
    }

    /**
     * Update the explicit data of the network
     * @param key key of the explicit community
     * @param node source node
     */
    updateExplicitData(key: string, node: IUserData) {
        if (this.explicitData.length === 0) {
            this.explicitData.push(new ExplicitData(key, node.explicit_community[key]));
        } else {

            let keyValues = this.explicitData.find(element => element.key === key);

            if (keyValues !== undefined) {
                if (!keyValues.values.includes(node.explicit_community[key])) {
                    keyValues.values.push(node.explicit_community[key]);
                }
            } else {
                this.explicitData.push(new ExplicitData(key, node.explicit_community[key]));
            }
        }
    }


    sortExplicitData() {
        this.explicitData.forEach((data) => {
            data.values.sort().reverse();
        });

        this.explicitData.sort((a: ExplicitData, b: ExplicitData) => {
            return a.key < b.key ? -1 : 1;
        });
    }

    /**
     * Updates the community data with all explicit communities and the number of user that has each value.
     * @param key key of the explicit community
     * @param node source node
     */
    updateCommunitiesData(key: string, node: IUserData) {

        const group = node.implicit_community;

        //Check if the parent map is defined
        if (this.communitiesData[group].explicitCommunityMap === undefined) {
            //Create the parent map
            this.communitiesData[group].explicitCommunityMap = new Map<string, IExplicitCommData>();

            //Define the child map of this key
            const newValue = new Map<string, number>();
            newValue.set(node.explicit_community[key], 1);

            //Include the new child map in the parent map
            this.communitiesData[group].explicitCommunityMap.set(key, { map: newValue });

        } else {

            //Check if the current key has a value in the parent map
            const currentComm = this.communitiesData[group].explicitCommunityMap.get(key);

            if (currentComm !== undefined) {
                //Check if the child map of the current key includes this value
                let currentValue = currentComm.map.get(node.explicit_community[key]);

                if (currentValue !== undefined) {
                    //Update the count in the child map
                    let currentCount = currentComm.map.get(node.explicit_community[key]);
                    if (currentCount !== undefined)
                        currentComm.map.set(node.explicit_community[key], ++currentCount);

                } else {
                    //Include the new value in the child map
                    currentComm.map.set(node.explicit_community[key], 1);
                }
            } else {

                //Define the child map of this key
                const newValue = new Map<string, number>();
                newValue.set(node.explicit_community[key], 1);

                //Include the new child map in the parent map
                this.communitiesData[group].explicitCommunityMap.set(key, { map: newValue });
            }
        }
    }

    /**
     * transform the number of users with each value of each explicit community, into the percentage
     * @param dimStrat 
     */
    calcExplicitPercentile(dimStrat: NodeDimensionStrategy) {
        for (let community of this.communitiesData) {
            community.explicitCommunityMap.forEach(function (parentValue, key) {

                //Change the count to percentile
                parentValue.map.forEach(function (value, key) {
                    let newValue = Math.round((value / community.users.length) * 100);
                    parentValue.map.set(key, newValue);
                });

                //Sort the map from highest percentile to lowest
                parentValue.array = Array.from(parentValue.map).sort(
                    (a: [string, number], b: [string, number]) => {
                        if (a[1] > b[1])
                            return -1;
                        else
                            return 1;
                    }
                );

                const dimension = dimStrat.strategies.filter((strat) => {
                    if (strat !== undefined && strat.attr !== undefined && strat.attr.key !== undefined)
                        return strat.attr.key === key
                    else return false;
                });

                parentValue.dimension = dimension === undefined ? undefined : dimension[0].attr.dimension;
            })
            community.explicitCommunityArray = Array.from(community.explicitCommunityMap);
        }
    }

}