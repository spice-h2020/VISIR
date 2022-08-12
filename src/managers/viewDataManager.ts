/**
 * @fileoverview This class manages the active viewable perspectives. It works with pair perspectives so when any pair of perspectives are actives, u can see both and compare them
 * @author Marco Expósito Pérez
 */

//Packages
import { PerspectivePair, PerspectiveData, PerspectiveNetworkData, PerspectiveInfo } from "../constants/perspectivesTypes";

export default class ViewDataManager {

    activePerspectivePairs: PerspectivePair[];

    constructor() {
        this.activePerspectivePairs = new Array<PerspectivePair>();
    }

    addPerspective(perspectiveInfo: PerspectiveInfo, perspectiveData: PerspectiveNetworkData) {

        const newPerspectiveData = new PerspectiveData(perspectiveInfo, perspectiveData);
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

    removePerspective(perspectiveId: number) {
        for (let i = 0; i < this.activePerspectivePairs.length; i++) {
            this.activePerspectivePairs[i].removePerspective(perspectiveId);
        }
    }

    clearPerspectives() {
        this.activePerspectivePairs = new Array<PerspectivePair>(); 
    }
}