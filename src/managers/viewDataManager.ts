/**
 * @fileoverview This class manages the active perspectives. Active perspectives are the ones u can see in the app.
 * It works with pair perspectives to later fit each pair in the same space for an easier comparison
 * @author Marco Expósito Pérez
 */
//Namespaces
import { PerspectivePair, PerspectiveInfo, PerspectiveData, PerspectiveDetails } from "../namespaces/perspectivesTypes";

export default class ViewDataManager {

    activePerspectivePairs: PerspectivePair[];

    constructor() {
        this.activePerspectivePairs = new Array<PerspectivePair>();
    }

    addPerspective(perspectiveInfo: PerspectiveDetails, perspectiveData: PerspectiveData) {

        const newPerspectiveData = new PerspectiveInfo(perspectiveInfo, perspectiveData);
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
            if(this.activePerspectivePairs[i].removePerspective(perspectiveId)){
                console.log(this.activePerspectivePairs)
                this.activePerspectivePairs.splice(i, 1);
                console.log(this.activePerspectivePairs)
            }
        }
    }

    clearPerspectives() {
        this.activePerspectivePairs = new Array<PerspectivePair>(); 
    }
}