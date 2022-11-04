/**
 * @fileoverview This file contains diferent perspectives interfaces and classes related with the perspectives.
 * @author Marco Expósito Pérez
 */

import { Dimensions } from "./nodes";

/**
 * Interface that allows to add any (key:string -> value:any) property to an object of this type 
 */
export interface anyProperty extends Record<string, any> { }


//#region All perspectives file

/**
 * Interface with all the details of a single perspective.
 */
export interface PerspectiveId {
    id: string;
    name: string;
    isActive: PerspectiveActiveState;
}

export enum PerspectiveActiveState {
    unactive,
    left,
    right,
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
    name: string,
}

/**
 * Interface of the data of a community.
 */
export interface CommunityData extends anyProperty {
    id: string;
    name: string;
    explanations: CommExplanation[];
    users: string[];

    explicitCommunityMap: Map<string, ExplicitCommData>;
    explicitCommunityArray?: [string, ExplicitCommData][];
}

export interface ExplicitCommData {
    map: Map<string, number>;
    array?: [string, number][];
    dimension?: Dimensions;
}

export enum ExplanationTypes {
    explicit_attributes,
    medoid
}

/**
 * Community explanation for visualization purpouses
 */
export interface CommExplanation extends anyProperty {
    explanation_type: ExplanationTypes;
    explanation_data: anyProperty;
    visible: boolean;
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
    extracted_emotions: anyProperty;
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