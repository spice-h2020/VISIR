/**
 * @fileoverview This class reads the translation files of the project, and creates an object to translate all the text
 * of the application
 * @author Marco Expósito Pérez
 */
//Constant
import { anyProperty } from "../constants/perspectivesTypes";
import config from '../appConfig.json';

/**
 * Interface of a translation json
 */
export interface ITranslation extends anyProperty {
    toolbar: {
        Options: {
            hoverText: string //"Options",
            useLocalFiles: string //"Use local files",
            useURL: string //"CM URL:",
            user: string //"User",
            pass: string //"Pass",
            connectBtnHover: string //"Connect to CM",
            showLabel: string //"Show labels",
            hideEdges: string //"hide unselected Edges",
            minSimilarity: string //"Minimum similarity",
            relevantArtworks: string //"Number of relevant artworks"
        }
        savePerspective: {
            hoverText: string //"Save Perspectives"
        }
        perspectiveBuilder: {
            hoverText: string //"Perspective Builder"
        }
        selectPerspective: {
            hoverText: string //"Select a perspective",
            unselectedName: string //"Select perspective",
            noAvailableName: string //"No available perspectives"
        }
        updateBtn: {
            hoverText: string //"Re-load Perspectives"
        }
        collapseBtns: {
            leftHoverText: string //"Collapse perspectives to the left",
            rightHoverText: string //"Collapse perspectives to the right"
        }
        legend: {
            hoverText: string //"Open legend",
            unselectedName: string //"Legend",
            noAvailableName: string //"Unactive Legend",
            anonymousRow: string //"Anonymous Users",
            anonymousExplanation: string //"Users without any explicit data"
        }
    },
    savePerspectives: {
        tittle: string //"Save Perspectives",
        toggleLabel: string //"Toggle All",
        downloadBtn: string //"Download perspectives",
        deleteBtn: string //"Delete perspectives",
        areUSure: string //"Are you sure you want to remove the selected perspectives?"
    }
    perspectiveBuider: {
        devModeBtn: string //"Dev mode",
        similarityValues: {
            similar: string //"Similar",
            same: string //"Same",
            dissimilar: string //"Diferent"
        }
        middleSentence: {
            base: string //"in",
            hetch: string //"for users with"
        }
        lastSentence: {
            base: string //"Artworks",
            hetch: string //"Beliefs"
        }
        leftBoxTittle: string //"Legend Attributes",
        rightBoxTittle: {
            base: string //"Artworks Attributes",
            hetch: string //"Beliefs"
        },
        perspectiveNameLabel: string //"Perspective Name",
        sendBtn: string //"Send Perspective",
        algorithmSlider: string //"Explainability weight",
        algorithmSliderExplanation: string //"The percentage of weight minimum of users that must be represented by the same value of contributions attributes (emotions, values, sentiments) to make such attribute explanable.A big value increase the number of communities and maybe, increase the number of users without community.",
        similaritySlider: string //"Similar Threshold",
        similaritySliderExplanation: string //"Minimum similarity between artworks from two interactions to calculate the similarity between them.(otherwise its assume as similar)"
    }
    dataColumn: {
        citizenTittle: string //"Citizen Description",
        userLabelLabel: string //"label",
        relatedContributions: string //"Contributions related to its community",
        otherContributions: string //"Other contributions",
        communityTittle: string //"Community Description",
        communityNameLabel: string //"Name",
        totalCitizensLabel: string //"Total Citizens",
        anonymousLabel: string //"Anonymous",
        interactionsName: string //"Interactions",
        noUserAttrb: string //"All users' attributes are unknown",
        relevantArtworks: string //"Relevant artworks to this community",
        medoidTittle: string //"Representative citizen",
        unavailableExplanation: string //"Unavailable explanation"
    }
    loadingText: {
        requestPerspective: string //"Requesting perspective",
        requestingAllPerspectives: string //"Requesting All perspectives",
        requestingConfToolSeed: string //"Requesting configuration tool seed",
        simpleRequest: string //"Request to",
        CMisBusy: string //"Community Model is busy. Trying again",
        sendingPerspectiveConfig: string //"Sending a perspectiva configuration",
        requestPerspectiveConfig: string //"Requesting a perspectiva configuration file"
    }
}

/**
 * A class that ease the translation of the app
 */
export class CTranslation {
    t!: ITranslation;
    defaultT!: ITranslation;

    constructor() { }

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

    /**
     * Validate a translation file and update all empty translation words with the default translation
     * @param newT new translation
     * @returns 
     */
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