/**
 * @fileoverview This class manages the active perspectives. Active perspectives are the ones u can see in the app.
 * It works with pair perspectives to later fit each pair in the same space for an easier comparison
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectivePair, PerspectiveInfo, PerspectiveData, PerspectiveDetails } from "../constants/perspectivesTypes";

export default class ViewDataManager {
    //Current active perspective pairs
    activePerspectivePairs: PerspectivePair[];

    /**
     * Constructor of the class
     */
    constructor() {
        this.activePerspectivePairs = new Array<PerspectivePair>();
    }

    /**
     * Add a new Perspective info to an empty pair
     * @param perspectiveDetails Details of the perspective to be added
     * @param perspectiveData Data of the perspective to be added
     */
    addPerspective(perspectiveDetails: PerspectiveDetails, perspectiveData: PerspectiveData) {

        const newPerspectiveInfo = new PerspectiveInfo(perspectiveDetails, perspectiveData);
        let isInserted = false;

        for (let i = 0; i < this.activePerspectivePairs.length; i++) {
            if (this.activePerspectivePairs[i].hasEmptySpace()) {
                this.activePerspectivePairs[i].addNewPerspective(newPerspectiveInfo)
                isInserted = true;
                break;
            }
        }

        if (!isInserted) {
            this.activePerspectivePairs.push(new PerspectivePair(newPerspectiveInfo, this.activePerspectivePairs.length));
        }
    }

    /**
     * Remove a perspective id from a pair
     * @param perspectiveId id of the perspective to be removeda
     */
    removePerspective(perspectiveId: number) {
        for (let i = 0; i < this.activePerspectivePairs.length; i++) {
            //If the returns its true, the perspectivePair its empty and we must clear it
            if(this.activePerspectivePairs[i].removePerspective(perspectiveId)){
                this.activePerspectivePairs.splice(i, 1);
                i = this.activePerspectivePairs.length;
            }
        }
    }

    /**
     * Clear the active perspectives pairs array
     */
    clearPerspectives() {
        this.activePerspectivePairs = new Array<PerspectivePair>(); 
    }
}