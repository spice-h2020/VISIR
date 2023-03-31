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
            hoverText: "Options",
            useLocalFiles: "Use local files",
            useURL: "CM URL:",
            user: "User",
            pass: "Pass",
            connectBtnHover: "Connect to CM",
            showLabel: "Show labels",
            hideEdges: "hide unselected Edges",
            minSimilarity: "Minimum similarity",
            relevantArtworks: "Number of relevant artworks"
        }
        savePerspective: {
            hoverText: "Save Perspectives"
        }
        perspectiveBuilder: {
            hoverText: "Perspective Builder"
        }
        selectPerspective: {
            hoverText: "Select a perspective",
            unselectedName: "Select perspective",
            noAvailableName: "No available perspectives"
        }
        updateBtn: {
            hoverText: "Re-load Perspectives"
        }
        collapseBtns: {
            leftHoverText: "Collapse perspectives to the left",
            rightHoverText: "Collapse perspectives to the right"
        }
        legend: {
            hoverText: "Open legend",
            unselectedName: "Legend",
            noAvailableName: "Unactive Legend",
            anonymousRow: "Anonymous Users",
            anonymousExplanation: "Users without any explicit data"
        }
    },
    savePerspectives: {
        tittle: "Save Perspectives",
        toggleLabel: "Toggle All",
        downloadBtn: "Download perspectives"
    }
    perspectiveBuider: {
        devModeBtn: "Dev mode",
        similarityValues: {
            similar: "Similar",
            same: "Same",
            dissimilar: "Diferent"
        }
        middleSentence: {
            base: "in",
            hetch: "for users with"
        }
        lastSentence: {
            base: "Artworks",
            hetch: "Beliefs"
        }
        leftBoxTittle: "Legend Attributes",
        rightBoxTittle: {
            base: "Artworks Attributes",
            hetch: "Beliefs"
        },
        perspectiveNameLabel: "Perspective Name",
        sendBtn: "Send Perspective",
        algorithmSlider: "Explainability weight",
        algorithmSliderExplanation: "The percentage of weight minimum of users that must be represented by the same value of contributions attributes (emotions, values, sentiments) to make such attribute explanable.A big value increase the number of communities and maybe, increase the number of users without community.",
        similaritySlider: "Similar Threshold",
        similaritySliderExplanation: "Minimum similarity between artworks from two interactions to calculate the similarity between them.(otherwise its assume as similar)"
    }
    dataColumn: {
        citizenTittle: "Citizen Description",
        userLabelLabel: "label",
        relatedContributions: "Contributions related to its community",
        otherContributions: "Other contributions",
        communityTittle: "Community Description",
        communityNameLabel: "Name",
        totalCitizensLabel: "Total Citizens",
        anonymousLabel: "Anonymous",
        interactionsName: "Interactions",
        noUserAttrb: "All users' attributes are unknown",
        relevantArtworks: "Relevant artworks to this community",
        medoidTittle: "Representative citizen"
    }
    loadingText: {
        requestPerspective: "Requesting perspective",
        requestingAllPerspectives: "Requesting All perspectives",
        requestingConfToolSeed: "Requesting configuration tool seed",
        simpleRequest: "Request to",
        CMisBusy: "Community Model is busy. Trying again",
        sendingPerspectiveConfig: "Sending a perspectiva configuration",
        requestPerspectiveConfig: "Requesting a perspectiva configuration file"
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