export enum Layouts {
    Horizontal,
    Vertical,
}

export class PerspectiveData {
    key: string;
    data: string;

    constructor(key: string, data: string) { this.key = key; this.data = data }
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

    removePerspective(perspectiveKey: string) {
        for (let i = 0; i < this.perspectives.length; i++) {
            if (this.perspectives[i]?.key === perspectiveKey) {
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