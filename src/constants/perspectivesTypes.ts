/**
 * @fileoverview This file contains diferent interfaces and classes related with the perspectives.
 * @author Marco Expósito Pérez
 */
import { Dimensions } from "./nodes";

/**
 * Interface that allows to add any (key:string -> value:any) property to an object of this type 
 */
export interface anyProperty extends Record<string, any> { }


//#region All perspective ids file

/**
 * Interface with the id of a single perspective.
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
export interface IPerspectiveData {
    communities: ICommunityData[];
    users: IUserData[];
    similarity: IEdgeData[];
    artworks: IArtworkData[],

    id: string,
    name: string,
}

/**
 * Interface of the data of a community.
 * 
 * The map exist to easily calculate the initial user count fo each community. Then that info is translated
 * to an array for easier iteration during the execution of the app.
 */
export interface ICommunityData extends anyProperty {
    id: string;
    name: string;
    explanations: ICommunityExplanation[];
    users: string[];
    anonUsers: string[];
    type: ECommunityType;

    /**
     * The string of the main map is the key of the explicit community, the string of the child map is one of the possible
     * values of an explicit community, the number is the amount of user with such value.
     */
    explicitDataMap: Map<string, Map<string, number>>;

    explicitDataArray?: IExplicitCommData[];
}

/**
 * Available types for a community
 */
export enum ECommunityType {
    implicit,
    inexistent
}

/**
 * Interface with the all the data related to a single key of an explicit community
 */
export interface IExplicitCommData {
    key: string;
    values: IExplicitCommValue[];
    dimension?: Dimensions;
}

/**
 * Interface with the relation "value -> amount of users" of an explicit community and a props property
 * to add extra configuration to the visualization tool. 
 */
export interface IExplicitCommValue {
    //The Word to be represented
    value: string,
    //The value of the word in the cloud
    count: number,
    //Additional configuration
    props?: any,
}

/**
 * Supported community explanation types
 */
export enum EExplanationTypes {
    explicit_attributes,
    medoid,
    implicit_attributes
}

/**
 * Community explanation for visualization purpouses
 */
export interface ICommunityExplanation extends anyProperty {
    explanation_type: EExplanationTypes;
    explanation_data: anyProperty;
    visible: boolean;
}

/**
 * Interface of the data of a user/node.
 */
export interface IUserData extends anyProperty {
    id: string;
    label: string;
    implicit_community: number;
    explicit_community: anyProperty;
    interactions: IInteraction[];

    isMedoid: boolean;
    isAnonimous: boolean;
    isAnonGroup: boolean;
}

/**
 * Interface of the data of a user interaction.
 */
export interface IInteraction extends anyProperty {
    artwork_id: string;
    feelings: string;
    extracted_emotions: anyProperty;
}

/**
 * Interface of the data of an edge/similarity.
 */
export interface IEdgeData extends anyProperty {
    from: string;
    to: string;
    similarity: number;
    id: string;
}

/**
 * Interface of the data of an artwork.
 */
export interface IArtworkData {
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
export enum EPerspectiveVisState {
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