/**
 * @fileoverview This class calculates two different things based on the community and its users data.
 * Analyze explicit community data from all nodes to determine the percentage of each community's explicit community values.
 * Parse interactions data from all users to calculate what are the relevant artworks/interactions of the community, and 
 * filter them from most relevant to less relevant
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
     * Reads the explicit data of a node and update its community with the values
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

                this.communitiesData[node.community_number].anonUsers.push(node.id);

            } else {
                node.isAnonymous = false;

                explicitKeys.forEach((key) => {

                    this.updateExplicitData(key, node);

                    node.isMedoid = this.medoidNodes.includes(node.id);

                    this.updateExplicitCommunityCount(key, node);
                });
            }
        } else {
            this.communitiesData[node.community_number].users.splice(this.communitiesData[node.community_number].users.indexOf(node.id), 1);
        }
    }

    /**
     * Checks the community related interactions of a user and adds it to the community artwork data.
     * @param node source data
     */
    parseArtworksRelatedToTheCommunity(node: IUserData) {
        if (this.communitiesData[node.community_number].allArtworks === undefined) {
            this.communitiesData[node.community_number].allArtworks = new Map<string, number>();
        }

        for (let i = 0; i < node.community_interactions.length; i++) {
            const currentN = this.communitiesData[node.community_number].allArtworks.get(node.community_interactions[i].artwork_id);
            this.communitiesData[node.community_number].allArtworks.set(node.community_interactions[i].artwork_id, currentN ? currentN + 1 : 1);
        }
    }

    /**
     * Parse all community artworks data to remove duplicates and filter them by popularity
     * @param nRelevantCommArtworks 
     */
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

    /**
     * Check if all explicit values of a node are unknown
     * @param node source node
     * @param keys explicit keys of the node
     * @returns 
     */
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
     * Update the explicit data of the network with a users data
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

    /**
     * Sort the explicit data of the communities from most popular to least.
     */
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
        const community_number = node.community_number;

        //Check if the main map is defined
        if (this.communitiesData[community_number].explicitDataMap === undefined) {
            //Create the main map
            this.communitiesData[community_number].explicitDataMap = new Map<string, Map<string, number>>();

            //Define the child map of this key
            const newValue = new Map<string, number>();
            newValue.set(node.explicit_community[key], 1);

            //Include the new child map in the parent map
            this.communitiesData[community_number].explicitDataMap.set(key, newValue);

        } else {

            //Check if the child map of this key exist
            const childMap = this.communitiesData[community_number].explicitDataMap.get(key);

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
                this.communitiesData[community_number].explicitDataMap.set(key, newValue);
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