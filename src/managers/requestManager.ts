/**
 * @fileoverview This class manages all GET petitions to obtain the perspective files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @package Requires React package to execute Dispatch functions. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState, FileSource } from '../constants/viewOptions';
import { validateAllPerspectivesDetailsJSON, validatePerspectiveDataJSON } from '../constants/ValidateFiles';
import { bStateArrayActionEnum, bStateArrayAction } from '../constants/auxTypes';
import { PerspectiveDetails } from '../constants/perspectivesTypes';
//Packages
import { Axios } from 'axios'
import { Dispatch } from 'react';


export default class RequestManager {

    isActive: boolean;
    axios: Axios;
    keyToUrl: Map<FileSource, string>;
    usingAPI: boolean;

    /**
     * Constructor of the class
     */
    constructor() {
        this.isActive = false;
        this.usingAPI = false;

        this.axios = new Axios();

        this.keyToUrl = new Map<FileSource, string>();

        this.keyToUrl.set(FileSource.Local, "./data/");
        this.keyToUrl.set(FileSource.Develop, "https://raw.githubusercontent.com/MarcoExpPer/SPICE-visualization-ReactPort/develop/public/data/");
        this.keyToUrl.set(FileSource.Api, "http://localhost:8090/");
    }

    /**
     * Initialize axios API
     * @param {String} baseURL base url of all axios petitions
     */
    init(baseURL: string | undefined) {
        if (baseURL !== undefined) {
            this.axios = new Axios({
                baseURL: baseURL,
            });
            this.isActive = true;
        } else
            throw new Error("the new base url is undefined");

    }

    /**
     * Send a request for the data file of a perspective and update the selectPerspective dropdown state.
     * If the requested perspective is already active, its removed.
     * @param currentState current state of the perspective to request
     * @param perspectiveDetails details of the perspective to request
     * @param setStates function to update the selectPerspective dropdown state
     * @param onFinish function executed when the request ends, updating the activePerspectives if necesary
     */
    requestPerspectiveFIle(currentState: ButtonState, perspectiveDetails: PerspectiveDetails, setStates: Dispatch<bStateArrayAction>,
        onFinish: Function) {

        if (currentState === ButtonState.unactive) {

            setStates({ action: bStateArrayActionEnum.activeOne, index: perspectiveDetails.localId, newState: ButtonState.loading });

            this.getPerspective(perspectiveDetails.id)
                .then((response) => {
                    if (response.status === 200) {
                        const perspectiveJson = validatePerspectiveDataJSON(JSON.parse(response.data));

                        onFinish({ data: perspectiveJson, details: perspectiveDetails });
                        setStates({ action: bStateArrayActionEnum.activeOne, index: perspectiveDetails.localId, newState: ButtonState.active });

                    } else {
                        throw new Error(`Perspective ${perspectiveDetails.id} was ${response.statusText}`);
                    }
                })
                .catch((error) => {

                    setStates({ action: bStateArrayActionEnum.activeOne, index: perspectiveDetails.localId, newState: ButtonState.unactive });

                    console.log(error);
                    alert(error.message);
                });

        } else {
            onFinish(undefined);
            setStates({ action: bStateArrayActionEnum.activeOne, index: perspectiveDetails.localId, newState: ButtonState.unactive });
        }
    }

    /**
     * Send a request for a new allPerspectives file, a file with all perspective details. 
     * Aditionaly, updates the fileSource dropdown state
     * @param newFileSource new file source
     * @param setFileSource function to update file source dropdown state
     * @param onFinish function executed when the request ends
     */
    requestAllPerspectivesDetails(newFileSource: FileSource, setFileSource: Dispatch<bStateArrayAction>,
        onFinish: Function) {

        setFileSource({ action: bStateArrayActionEnum.activeOne, index: newFileSource, newState: ButtonState.loading });

        this.changeBaseURL(newFileSource);

        this.getAllPerspectives()
            .then((response) => {
                if (response.status === 200) {
                    const allPerspectivesFile: PerspectiveDetails[] = validateAllPerspectivesDetailsJSON(JSON.parse(response.data));

                    setFileSource({ action: bStateArrayActionEnum.activeOne, index: newFileSource, newState: ButtonState.active });
                    onFinish(allPerspectivesFile);

                } else {
                    throw new Error(`All perspectives info was ${response.statusText}`);
                }
            })
            .catch((error) => {

                setFileSource({ action: bStateArrayActionEnum.activeOne, index: newFileSource, newState: ButtonState.active });
                onFinish(undefined);

                console.log(error);
                alert(error.message);
            });
    }


    /**
     * Send a GET petition to obtain a singleFile in a directory
     * @param {number} id Id of the file we want to get. It needs to include the extension
     * @returns {Object} Returns the file
     */
    getPerspective(id: number) {
        const realID = this.usingAPI ? `file/${id}` : `${id}.json`;

        return this.axios.get(realID, {
            params: {}
        })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
    }

    /**
     * Get all perspectives information 
     * @returns {Object} returns the information of all perspectives
     */
    getAllPerspectives() {
        const perspectiveFilesName = this.usingAPI ? "/perspectives/all" : "dataList.json";

        return this.axios.get(perspectiveFilesName, {
            params: {}
        })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Update the baseURL of the requestManager
     * @param {FileSource} newKey the key of the new fileSource
     */
    changeBaseURL(newKey: FileSource) {
        const newUrl = this.keyToUrl.get(newKey);

        this.usingAPI = newKey === FileSource.Api;

        if (this.isActive && this.axios) {
            this.axios.defaults.baseURL = newUrl;
        } else {
            this.init(newUrl);
        }

        console.log(`Source url changed to ${newUrl}`)
    }
}