import { anyProperty } from "../constants/perspectivesTypes";
import config from '../appConfig.json';

/**
 * Interface of a translation json
 */
export interface ITranslation extends anyProperty {
    toolbar: {
        fileSourceDrop: {
            name: string,
            localFiles: string,
            Api_URL: string,
        },
        optionsDrop: {
            name: string,
            hideLabels: string,
            hideEdges: string,
            minSimilarity: string,
            removeEdges: string,
        },
        selectPerspective: {
            defaultName: string,
            noPerspectiveName: string,
        },
        legend: {
            name: string,
            noLegend: string,
        }
    },
    loadingText: {
        requestFiles: string,
        requestPerspective: string,
        requestingAllPerspectives: string,
        requestingConfToolSeed: string,
        CMisBusy: string,
        simpleRequest: string,
        simpleLoading: string,
    },
    dataColumn: {
        citizenTittle: string,
        citizenAmount: string,
        anonymous: string,
        medoidTittle: string,
        mainInteractionsTittle: string,
        otherInteractionsTittle: string,
        labelText: string,
        unknownUserAttrb: string,
        communityPanelTittle: string,
        communityNameLabel: string,
    },
    legend: {
        anonymousRow: string,
        anonymousExplanation: string,
    }
}

export class CTranslation {
    t!: ITranslation;
    defaultT!: ITranslation;

    constructor() {

    }


    initializeTranslation(setTranslation: Function) {
        fetch(`lang/default/locals.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then((language: any) => {
                this.defaultT = language;
                if (this.t !== undefined) {
                    setTranslation(this.validateTranslation(this.t));
                }
            });

        fetch(`lang/${config.LANG}/locals.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then((language) => {
                this.t = language;
                if (this.defaultT !== undefined) {
                    setTranslation(this.validateTranslation(this.t));
                }
            });

    }

    validateTranslation(newT: ITranslation | undefined) {
        let defaultTranslation = this.defaultT;

        if (newT === undefined) {
            return defaultTranslation;
        }

        const keys = Object.keys(defaultTranslation!);
        for (const key of keys) {

            if (newT[key] !== undefined) {

                if (typeof defaultTranslation![key] === "object") {
                    const subKeys = Object.keys(defaultTranslation![key]);

                    for (const subkey of subKeys) {

                        if (newT[key][subkey] !== undefined) {

                            if (typeof defaultTranslation![key][subkey] === "object") {
                                const subsubKeys = Object.keys(defaultTranslation![key][subkey]);

                                for (const subsubkey of subsubKeys) {

                                    if (newT[key][subkey][subsubkey] === undefined) {
                                        newT[key][subkey][subsubkey] = defaultTranslation![key][subkey][subsubkey];
                                    }
                                }
                            }

                        } else {
                            newT[key][subkey] = defaultTranslation![key][subkey];
                        }
                    }
                }

            } else {
                newT[key] = defaultTranslation![key];
            }
        }
        return newT;
    }

}