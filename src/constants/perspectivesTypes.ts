import { PerspectiveInfo } from "./perspectiveValidation";

export enum Layouts {
    Horizontal,
    Vertical,
}

export class PerspectiveData {
    info: PerspectiveInfo;
    data: PerspectiveNetworkData;

    constructor(info: PerspectiveInfo, data: PerspectiveNetworkData) { this.info = info; this.data = data }
}

export interface PerspectiveNetworkData {
    communities: string;
    users: dataNode[];
    similarity: string;
}

export interface dataNode {
    id: string;
    label: string;
    group: string;
    explicit_community: explicitCommunity[];
}

export interface explicitCommunity {
    key: string;
    value: string;
}

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

