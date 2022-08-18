/**
 * @fileoverview This file contains diferent perspectives interfaces and classes related with the perspectives.
 * @author Marco Expósito Pérez
 */

/**
 * Interface that allows to add any (key:string -> value:any) property to an object of this type 
 */
 export interface anyProperty extends Record<string, any> { }

/**
 * Class that contains all the information of a perspective, including its details from the All perspectives file and its data from the own perspective file.
 */
export class PerspectiveInfo {
    info: PerspectiveDetails;
    data: PerspectiveData;

    constructor(info: PerspectiveDetails, data: PerspectiveData) { this.info = info; this.data = data }
}

//#region All perspectives file

/**
 * Interface with all the details from all perspective files.
 */
export interface AllPerspectives {
    files: PerspectiveDetails[];
}

/**
 * Interface with all the details of a single perspective.
 */
export interface PerspectiveDetails {
    id: number;
    name: string;
    algorithm: PerspectiveAlgorithm;
    similarity_functions: SimFunction[];
}

/**
 * Interface of an algorithm used in a perspective. Params doesnt have any specified format.
 */
export interface PerspectiveAlgorithm {
    name: string;
    params: anyProperty;
}

/**
 * Interface of an SimilarityFunction used in a perspective. Params doesnt have any specified format.
 */
export interface SimFunction {
    name: string;
    params: anyProperty;
    onAttribute: OnAttribute[];
    weight: number;
}

/**
 * Interface of an attribute used in a perspective.
 */
export interface OnAttribute {
    name: string;
    type: string;
}
//#endregion

//#region Perspective Data file

/**
 * Interface with all the data of a single perspective.
 */
export interface PerspectiveData {
    communities: CommunityData[];
    users: UserData[];
    similarity: EdgeData[];
}

/**
 * Interface of the data of a community.
 */
export interface CommunityData extends anyProperty {
    id: number;
    community_type: string;
    name: string;
    explanation: string;
    users: number[];
}

/**
 * Interface of the data of a user/node.
 */
export interface UserData extends anyProperty {
    id: number;
    label: string;
    implicit_community: number;
    explicit_community: anyProperty;
}

/**
 * Interface of the data of an edge/similarity.
 */
export interface EdgeData extends anyProperty {
    from: string;
    to: string;
    value: number;
    id?: number;
}
//#endregion

//Class that contains All the info about 2 diferent perspectives in order to draw the view layout in pairs of networks for easy comparison
/**
 * Class with the Perspective info of 2 (or just 1) perspectives, and several utility functions to ease its use. Its used to know what perspectives are in a pair
 * in order to show them on the app view layout as such.
 */
export class PerspectivePair {
    perspectives: (PerspectiveInfo | undefined)[];
    pairID: number;
    spacesAvailables: boolean[];

    /**
     * Constructor of the class
     * @param newPerspective Perspective Info of the first perpsective in this pair
     * @param pairId id of the pair
     */
    constructor(newPerspective: PerspectiveInfo, pairId: number) {
        //Data of the perspectives
        this.perspectives = [newPerspective, undefined];
        //Id of this pair of perspectives
        this.pairID = pairId;
        //Works as a dirty attribute for this.perspectives, to know if the value inside its an active perspective or useless data
        this.spacesAvailables = [false, true];
    }

    /**
     * Add a new perspective if there is space available in this pair
     * @param newPerspective perspective to add
     */
    addNewPerspective(newPerspective: PerspectiveInfo) {
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (this.spacesAvailables[i]) {
                this.perspectives[i] = newPerspective;
                this.spacesAvailables[i] = false;
                break;
            }
        }
    }

    /**
     * Removes a perspective based on its id if its in this pair
     * @param perspectiveId id of the perspective to delete
     * @returns returns true if the pair ends up empty and needs to be deleted
     */
    removePerspective(perspectiveId: number): boolean {
        for (let i = 0; i < this.perspectives.length; i++) {
            if (this.perspectives[i]?.info.id === perspectiveId) {
                this.perspectives[i] = undefined;
                this.spacesAvailables[i] = true;

                if (this.spacesAvailables[0] && this.spacesAvailables[1]) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    /**
     * Check if the pair has any empty space
     * @returns 
     */
    hasEmptySpace() {
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (this.spacesAvailables[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the first available perspective of the pair. Used when u just want the perspective of a pair that only has one perspective
     * @returns the first perspective in the pair
     */
    getSingle() {
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (!this.spacesAvailables[i]) {
                return this.perspectives[i];
            }
        }
    }
}