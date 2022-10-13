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
    details: PerspectiveDetails;
    data: PerspectiveData;

    constructor(details: PerspectiveDetails, data: PerspectiveData) { this.details = details; this.data = data }
}

//#region All perspectives file

/**
 * Interface with all the details of a single perspective.
 */
export interface PerspectiveDetails {
    id: number;
    name: string;
    algorithm: PerspectiveAlgorithm;
    similarity_functions: SimFunction[];
    localId: number;
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
    artworks: ArtworkData[],

    id: string,
}

/**
 * Interface of the data of a community.
 */
export interface CommunityData extends anyProperty {
    id: string;
    name: string;
    explanation: string;
    users: string[];
    explicitCommunity: anyProperty;
}

/**
 * Interface of the data of a user/node.
 */
export interface UserData extends anyProperty {
    id: string;
    label: string;
    implicit_community: number;
    explicit_community: anyProperty;
    interactions: Interaction[];
}

/**
 * Interface of the data of a user interaction.
 */
 export interface Interaction extends anyProperty {
    artwork_id: string;
    feelings: string;
    sophia_extracted_emotions: anyProperty;
}

/**
 * Interface of the data of an edge/similarity.
 */
export interface EdgeData extends anyProperty {
    from: string;
    to: string;
    similarity: number;
    id: string;
}

/**
 * Interface of the data of an artwork.
 */
 export interface ArtworkData {
    id: string;
    tittle: string;
    author: string;
    year: number;
    image: string
}

//#endregion

/**
 * Possible states of a single perspective
 */
export enum PerspectiveState {
    /**
     * The perspective is unactive, not being shown to anyone.
     */
    unactive,
    /**
     * Only this perspective is active, so its size is the available maximum.
     */
    activeSingle,
    /**
     * Both perspectives are active, so the size of the perspective is average
     */
    activeBoth,
    /**
     * Both perspectives are active, but the other one is collapsed, so this one's size is big
     */
    activeBig,
    /**
     * Both perspectives are active, but this one is collapsed, so this one's size is small
     */
    collapsed,
}