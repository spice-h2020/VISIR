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
    params: any[];
}

export interface SimFunction {
    name: string;
    params: any[];
    onAttribute: OnAttribute[];
    weight: number;
}

export interface OnAttribute {
    name: string;
    type: string;
}

//Data interfaces that containts the data of a perspective used to draw the network
export interface PerspectiveNetworkData {
    communities: CommunityData[];
    users: UserData[];
    similarity: EdgeData[];
}

export interface CommunityData {
    id: number;
    community_type: string;
    name: string;
    explanation: string;
    users: number[];
}

export interface UserData {
    id: number;
    label: string;
    group: number;
    explicit_community: any;
}

export interface EdgeData {
    u1: string;
    u2: string;
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

    removePerspective(perspectiveId: number) {
        for (let i = 0; i < this.perspectives.length; i++) {
            if (this.perspectives[i]?.info.id === perspectiveId) {
                this.perspectives[i] = undefined;
                this.spacesAvailables[i] = true;
                break;
            }
        }
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

//Possible layouts of the network
export enum Layouts {
    Horizontal,
    Vertical,
}