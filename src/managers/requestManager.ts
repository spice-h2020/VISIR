/**
 * @fileoverview This class manages all GET petitions to obtain the perspective files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @package Requires React package to execute Dispatch functions. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource } from '../constants/viewOptions';
import { validatePerspectiveDataJSON, validatePerspectiveIDfile } from '../constants/ValidateFiles';
import { PerspectiveId } from '../constants/perspectivesTypes';
//Packages
import { Axios } from 'axios'

export default class RequestManager {

    isActive: boolean;
    axios: Axios;
    keyToUrl: Map<EFileSource, string>;
    usingAPI: boolean;

    /**
     * Constructor of the class
     */
    constructor() {
        this.isActive = false;
        this.usingAPI = false;

        this.axios = new Axios();

        this.keyToUrl = new Map<EFileSource, string>();

        this.keyToUrl.set(EFileSource.Local, "./data/");
        this.keyToUrl.set(EFileSource.Develop, "https://raw.githubusercontent.com/MarcoExpPer/SPICE-visualization-ReactPort/develop/public/data/");
        this.keyToUrl.set(EFileSource.Api, "http://localhost:8080/visualizationAPI/");
    }

    /**
     * Initialize axios API
     * @param {String} baseURL base url of all axios petitions
     */
    init(baseURL: string | undefined) {
        if (baseURL !== undefined) {
            this.axios = new Axios({
                baseURL: baseURL,
                timeout: 2000,
            });
            this.isActive = true;
        } else
            throw new Error("the new base url is undefined");

    }

    /**
     * Send a request for the data file of a perspective whose id is perspective ID and whose name is name.
     * When the request is finished, executes a callback function whose parameter will be the perspective Data, undefined
     * if something went wrong.
     */
    requestPerspectiveFIle(perspectiveId: string, name: string, callback: Function) {

        this.getPerspective(perspectiveId)
            .then((response) => {
                if (response.status === 200) {
                    const perspectiveJson = validatePerspectiveDataJSON(JSON.parse(response.data));
                    perspectiveJson.id = perspectiveId;
                    perspectiveJson.name = perspectiveJson.name === undefined ? name : perspectiveJson.name;

                    callback(perspectiveJson);
                } else {
                    throw new Error(`Perspective ${perspectiveId} was ${response.statusText}`);
                }
            })
            .catch((error) => {

                callback(undefined);

                console.log(`Perspective file with id: (${perspectiveId}) was not found: ${error}`);
                console.log(error);
                alert(`Perspective file with id: (${perspectiveId}) was not found: ${error.message}`);
            });
    }

    /**
     * Send a GET petition to obtain a singleFile in a directory
     * @param id Id of the file we want to get.
     * @returns {Object} Returns the file
     */
    getPerspective(id: string) {
        const realID = this.usingAPI ? `file/${id}` : `${id}.json`;

        return this.axios.get(realID, {
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
     * Send a request for the id and names of all available perspectives.
     * When the request is finished, executes a callback function with all the new ids as parameter, undefined if
     * something went wrong.
     */
    requestAllPerspectivesIds(callback: Function) {

        this.getAllPerspectives()
            .then((response) => {
                if (response.status === 200) {
                    const allIds: PerspectiveId[] = validatePerspectiveIDfile(JSON.parse(response.data));

                    callback(allIds);
                } else {
                    throw new Error(`All IDs file was ${response.statusText}`);
                }
            })
            .catch((error) => {

                callback(undefined);

                console.log(`All IDs file was not found:`);
                console.log(error);
                alert(`All IDs file was not found: ${error.message}`);
            });
    }

    /**
     * Get all perspectives information 
     * @returns {Object} returns the information of all perspectives
     */
    getAllPerspectives() {
        const perspectiveFilesName = this.usingAPI ? "/index" : "dataList.json";

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
     * @param {EFileSource} newKey the key of the new fileSource
     */
    changeBaseURL(newKey: EFileSource) {
        const newUrl = this.keyToUrl.get(newKey);

        this.usingAPI = newKey === EFileSource.Api;

        if (this.isActive && this.axios) {
            this.axios.defaults.baseURL = newUrl;
        } else {
            this.init(newUrl);
        }

        console.log(`Source url changed to ${newUrl}`)
    }
}