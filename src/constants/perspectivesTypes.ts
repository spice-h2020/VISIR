//Class that contains all posible info of a perspective
export class PerspectiveData {
    info: PerspectiveInfo;
    data: PerspectiveNetworkData;

    constructor(info: PerspectiveInfo, data: PerspectiveNetworkData) { this.info = info; this.data = data }
}

//Data interfaces that containts the info of all perspectives together
export interface AllPerspectives {
    files: PerspectiveInfo[];
}

export interface PerspectiveInfo {
    id: number;
    name: string;
    algorithm: PerspectiveAlgorithm;
    similarity_functions: SimFunction[];
}

export interface PerspectiveAlgorithm {
    name: string;
    params: anyProperty;
}

export interface SimFunction {
    name: string;
    params: anyProperty;
    onAttribute: OnAttribute[];
    weight: number;
}

export interface OnAttribute {
    name: string;
    type: string;
}

export interface anyProperty extends Record<string, any>{}

//Data interfaces that containts the data of a perspective used to draw the network
export interface PerspectiveNetworkData {
    communities: CommunityData[];
    users: UserData[];
    similarity: EdgeData[];
}

export interface CommunityData extends anyProperty{
    id: number;
    community_type: string;
    name: string;
    explanation: string;
    users: number[];
}

export interface UserData extends anyProperty{
    id: number;
    label: string;
    implicit_community: number;
    explicit_community: anyProperty; //TODO no utilizar el any
}

export interface EdgeData extends anyProperty{
    from: string;
    to: string;
    value: number;
}

//Class that contains All the info about 2 diferent perspectives in order to draw the view layout in pairs of networks for easy comparison
export class PerspectivePair {
    perspectives: (PerspectiveData | undefined)[];
    pairID: number;
    spacesAvailables: boolean[];

    constructor(newPerspective: PerspectiveData, pairId: number) {
        this.perspectives = [newPerspective, undefined];
        this.pairID = pairId;
        this.spacesAvailables = [false, true];
    }

    addNewPerspective(newPerspective: PerspectiveData) {
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (this.spacesAvailables[i]) {
                this.perspectives[i] = newPerspective;
                this.spacesAvailables[i] = false;
                break;
            }
        }
    }

    removePerspective(perspectiveId: number) : boolean {
        for (let i = 0; i < this.perspectives.length; i++) {
            if (this.perspectives[i]?.info.id === perspectiveId) {
                this.perspectives[i] = undefined;
                this.spacesAvailables[i] = true;

                if(this.spacesAvailables[0] && this.spacesAvailables[1]){
                    return true;
                }else{
                    return false;
                }
            }
        }
        return false;
    }

    hasEmptySpace() {
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (this.spacesAvailables[i]) {
                return true;
            }
        }
        return false;
    }

    size() {
        let size = 0;
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (!this.spacesAvailables[i]) {
                size++;
            }
        }
        return size;
    }

    getSingle() {
        for (let i = 0; i < this.spacesAvailables.length; i++) {
            if (!this.spacesAvailables[i]) {
                return this.perspectives[i];
            }
        }
    }
}

//TODO move it to a better named file Possible layouts of the network
export enum Layouts {
    Horizontal,
    Vertical,
}