/**
 * @fileoverview This class Controls all GET petitions to obtain the json files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @author Marco Expósito Pérez
 */

//Packages
import { PerspectivePair, PerspectiveData } from "../constants/perspectivesTypes";

export default class LayoutManager {

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
        console.log("a")
        this.activePerspectivePairs = new Array<PerspectivePair>(); 
    }
}