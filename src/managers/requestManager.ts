/**
 * @fileoverview This class manages all GET petitions to obtain the perspective files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @author Marco Expósito Pérez
 */
//Constants
import { FileSource } from '../constants/viewOptions';
//Packages
import { Axios } from 'axios'

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