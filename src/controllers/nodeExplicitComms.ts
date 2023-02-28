/**
 * @fileoverview This class parse the node's explicit communities, calculates the % of users that have a determined
 * explicit community value and find the medoid user if the community explanation is configured to.
 * @author Marco Expósito Pérez
 */
//Constants
import { ILegendDataAction } from "../constants/auxTypes";
import { nodeConst } from "../constants/nodes";
import { ICommunityExplanation, ICommunityData, EExplanationTypes, IUserData, IStringNumberRelation } from "../constants/perspectivesTypes";
//Local files
import NodeDimensionStrategy from "../managers/nodeDimensionStrat";

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
    hasAnon: boolean;
    hasAnonGroup: boolean;

    /**
     * Constructor of the class
     * @param communitiesData 
     */
    constructor(communitiesData: ICommunityData[]) {
        this.explicitData = new Array<ExplicitData>();

        this.hasAnon = false;
        this.hasAnonGroup = false;

        this.communitiesData = communitiesData;
        this.medoidNodes = [];

        this.communitiesData.forEach((comm: ICommunityData) => {
            comm.explanations.forEach((expl: ICommunityExplanation) => {
                if (expl.visible) {
                    switch (expl.explanation_type) {
                        case EExplanationTypes.medoid: {
                            this.medoidNodes.push(expl.explanation_data.id);

                            break;
                        }
                    }
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
    parseExplicitCommunity(node: IUserData, setLegendData: React.Dispatch<ILegendDataAction>) {
        if (node.id === nodeConst.anonymousGroupKey) {
            node.isAnonGroup = true;
            this.hasAnonGroup = true;

            setLegendData({
                type: "anonGroup",
                newData: true
            });
        }

        const explicitKeys = Object.keys(node.explicit_community);
        node.isMedoid = this.medoidNodes.includes(node.id);

        if (!node.isMedoid) {
            if (explicitKeys.length === 0 || this.areKeysUnknown(node, explicitKeys)) {

                node.isAnonymous = true;
                this.hasAnon = true;

                setLegendData({
                    type: "anon",
                    newData: true
                });

                this.communitiesData[node.implicit_community].anonUsers.push(node.id);

            } else {
                node.isAnonymous = false;

                explicitKeys.forEach((key) => {

                    this.updateExplicitData(key, node);

                    node.isMedoid = this.medoidNodes.includes(node.id);

                    this.updateExplicitCommunityCount(key, node);
                });
            }
        } else {
            this.communitiesData[node.implicit_community].users.splice(this.communitiesData[node.implicit_community].users.indexOf(node.id), 1);
        }
    }

    parseArtworksRelatedToTheCommunity(node: IUserData) {
        if (this.communitiesData[node.implicit_community].allArtworks === undefined) {
            this.communitiesData[node.implicit_community].allArtworks = new Map<string, number>();
        }

        for (let i = 0; i < node.community_interactions.length; i++) {
            const currentN = this.communitiesData[node.implicit_community].allArtworks.get(node.community_interactions[i].artwork_id);
            this.communitiesData[node.implicit_community].allArtworks.set(node.community_interactions[i].artwork_id, currentN ? currentN + 1 : 1);
        }
    }

    makeArtworksUnique(nRelevantCommArtworks: number) {

        for (let i = 0; i < this.communitiesData.length; i++) {
            const artworksList = Array.from(this.communitiesData[i].allArtworks);
            artworksList.sort((a: [string, number], b: [string, number]) => {
                if (a[1] > b[1])
                    return 1;
                else return -1;
            })

            this.communitiesData[i].representative_artworks = artworksList.slice(
                Math.max(artworksList.length - nRelevantCommArtworks, 0));
        }
    }

    areKeysUnknown(node: IUserData, keys: string[]) {
        let isUnknown: boolean = true;

        keys.forEach((key) => {
            if (node.explicit_community[key] !== nodeConst.unknownCommunityValue) {
                isUnknown = false;
                return false;
            }

        });

        return isUnknown;
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
    }

    /**
     * Updates the community data with all explicit communities and the number of user that has each value.
     * @param key key of the explicit community
     * @param node source node
     */
    updateExplicitCommunityCount(key: string, node: IUserData) {
        const group = node.implicit_community;

        //Check if the main map is defined
        if (this.communitiesData[group].explicitDataMap === undefined) {
            //Create the main map
            this.communitiesData[group].explicitDataMap = new Map<string, Map<string, number>>();

            //Define the child map of this key
            const newValue = new Map<string, number>();
            newValue.set(node.explicit_community[key], 1);

            //Include the new child map in the parent map
            this.communitiesData[group].explicitDataMap.set(key, newValue);

        } else {

            //Check if the child map of this key exist
            const childMap = this.communitiesData[group].explicitDataMap.get(key);

            if (childMap !== undefined) {
                //Check current count of the current value
                let currentCount = childMap.get(node.explicit_community[key]);

                if (currentCount !== undefined) {
                    //Update the count in the child map
                    childMap.set(node.explicit_community[key], ++currentCount);

                } else {
                    //Set the value to a starting value
                    childMap.set(node.explicit_community[key], 1);
                }
            } else {

                //Define the child map of this key
                const newValue = new Map<string, number>();
                newValue.set(node.explicit_community[key], 1);

                //Include the new child map in the parent map
                this.communitiesData[group].explicitDataMap.set(key, newValue);
            }
        }
    }

    /**
     * transform the number of users with each value of each explicit community, into the percentage
     * @param dimStrat 
     */
    calcExplicitPercentile(dimStrat: NodeDimensionStrategy) {
        for (let community of this.communitiesData) {
            community.explicitDataArray = [];

            if (community.explicitDataMap !== undefined) {
                community.explicitDataMap.forEach(function (map, key) {

                    //Change the count to percentile
                    map.forEach(function (value, key) {
                        let newValue = Math.round((value / (community.users.length - community.anonUsers.length)) * 100);
                        map.set(key, newValue);
                    });

                    //Create a sorted array from the map data
                    const sortedArray = Array.from(map).sort(
                        (a: [string, number], b: [string, number]) => {
                            if (a[1] > b[1])
                                return -1;
                            else
                                return 1;
                        }
                    );

                    const dimAttribute = dimStrat.attributesArray.find((value) => { return value.key === key });

                    //Create the array with the relations (value -> percentil)
                    const wordInputArray: IStringNumberRelation[] = [];

                    for (let i = 0; i < sortedArray.length; i++) {
                        let dimIndex = dimAttribute?.values.findIndex((value) => { return value === sortedArray[i][0] }) ?? 0;

                        wordInputArray.push(
                            {
                                value: sortedArray[i][0],
                                count: sortedArray[i][1],
                                props: dimIndex,
                            }
                        );
                    }

                    community.explicitDataArray!.push({
                        key: key,
                        values: wordInputArray,
                        dimension: dimAttribute?.dimension
                    });
                })
            }
        }
    }

}