/**
 * @fileoverview This class manages the active viewable perspectives. It works with pair perspectives so when any pair of perspectives are actives, u can see both and compare them
 * @author Marco Expósito Pérez
 */

//Packages
import { PerspectivePair, PerspectiveData } from "../constants/perspectivesTypes";

export default class ViewManager {

    activePerspectivePairs: PerspectivePair[];

    constructor() {
        this.activePerspectivePairs = new Array<PerspectivePair>();
    }

    addPerspective(perspectiveKey: string, perspectiveData: string) {
        const newPerspectiveData = new PerspectiveData(perspectiveKey, perspectiveData);
        let isInserted = false;

        for (let i = 0; i < this.activePerspectivePairs.length; i++) {
            if (this.activePerspectivePairs[i].hasEmptySpace()) {
                this.activePerspectivePairs[i].addNewPerspective(newPerspectiveData)
                isInserted = true;
                break;
            }
        }

        if (!isInserted) {
            this.activePerspectivePairs.push(new PerspectivePair(newPerspectiveData, this.activePerspectivePairs.length));
        }
    }

    removePerspective(perspectiveKey: string) {
        for (let i = 0; i < this.activePerspectivePairs.length; i++) {
            this.activePerspectivePairs[i].removePerspective(perspectiveKey);
        }
    }

    clearPerspectives() {
        this.activePerspectivePairs = new Array<PerspectivePair>(); 
    }
}