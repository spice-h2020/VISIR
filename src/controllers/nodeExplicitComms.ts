/**
 * @fileoverview Calculate and draw the bounding boxes of users with the same implicit community.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { Point } from "../constants/auxTypes";
import { nodeConst } from "../constants/nodes";
import { anyProperty, CommunityData, UserData } from "../constants/perspectivesTypes";
import NodeDimensionStrategy from "../managers/nodeDimensionStat";

//Local aux class to help mantain and collect all the values of an Explicit Community
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


    //All explicit Data of the users
    explicitData: ExplicitData[];

    communitiesData: CommunityData[];

    constructor(communitiesData: CommunityData[]) {
        this.explicitData = new Array<ExplicitData>();

        this.communitiesData = communitiesData;
    }

    parseExplicitCommunity(node: UserData, dimStrat: NodeDimensionStrategy | undefined) {

        const explicitKeys = Object.keys(node.explicit_community);
        explicitKeys.forEach((key) => {

            if (dimStrat === undefined) {
                this.updateExplicitData(key, node);
            }

            this.updateCommunitiesData(key, node);
        });
    }

    updateExplicitData(key: string, node: UserData) {
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

    updateCommunitiesData(key: string, node: UserData) {
        const group = node.implicit_community;

        if (this.communitiesData[group].explicitCommunity === undefined) {
            this.communitiesData[group].explicitCommunity = {};
            this.communitiesData[group].explicitCommunity[key] = new Map<string, number>();
            this.communitiesData[group].explicitCommunity[key].set(node.explicit_community[key], 1);


        } else if (this.communitiesData[group].explicitCommunity[key] === undefined) {
            this.communitiesData[group].explicitCommunity[key] = new Map<string, number>();
            this.communitiesData[group].explicitCommunity[key].set(node.explicit_community[key], 1);
        } else {
            const currentNumber = this.communitiesData[group].explicitCommunity[key].get(node.explicit_community[key]);

            if (currentNumber === undefined) {
                this.communitiesData[group].explicitCommunity[key].set(node.explicit_community[key], 1);
            } else {
                this.communitiesData[group].explicitCommunity[key].set(node.explicit_community[key], currentNumber + 1);
            }
        }
    }

    calcExplicitPercentile(dimStrat: NodeDimensionStrategy) {
        for (let community of this.communitiesData) {
            const explicitCommunityKeys = Object.keys(community.explicitCommunity)

            for (let i = 0; i < explicitCommunityKeys.length; i++) {
                const key = explicitCommunityKeys[i];

                const array = new Array();
                for (const pair of community.explicitCommunity[key]) {
                    array.push([pair[0], parseFloat(((pair[1] / community.users.length) * 100).toFixed(1))]);
                }

                array.sort((a: any[], b: any[]) => {
                    if (a[1] < b[1]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                const dimension = dimStrat.strategies.filter((strat) => {
                    if (strat !== undefined && strat.attr !== undefined && strat.attr.key !== undefined)
                        return strat.attr.key === key
                    else return false;
                });

                community.explicitCommunity[key] = [array, dimension === undefined ? undefined : dimension[0].attr.dimension];
            }

        }
    }
}