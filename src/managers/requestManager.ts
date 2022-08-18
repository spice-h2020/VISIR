/**
 * @fileoverview This class manages all GET petitions to obtain the perspective files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @author Marco Expósito Pérez
 */
//Namespaces
import { FileSource } from '../namespaces/ViewOptions';
//Packages
import { Axios } from 'axios'

export default class RequestManager {
    
    isActive: boolean;
    axios: Axios;
    keyToUrl: Map<FileSource, string>;

    /**
     * Constructor of the class
     */
    constructor() {
        this.isActive = false;
        this.axios = new Axios();

        this.keyToUrl = new Map<FileSource, string>();
        this.keyToUrl.set(FileSource.Main, "https://raw.githubusercontent.com/gjimenezUCM/SPICE-visualization/main/data/");
        this.keyToUrl.set(FileSource.Local, "./data/");
        this.keyToUrl.set(FileSource.Develop, "https://raw.githubusercontent.com/gjimenezUCM/SPICE-visualization/develop/data/");
        this.keyToUrl.set(FileSource.Api, "API (WIP)");
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
     * @param {String} name Name of the file we want to get. It needs to include the extension
     * @returns {Object} Returns the file
     */
    getPerspective(name: string) {

        return this.axios.get(name, {
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
        const perspectiveFilesName = "dataList.json";
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

        if (this.isActive && this.axios) {
            this.axios.defaults.baseURL = newUrl;
        } else {
            this.init(newUrl);
        }

        console.log(`Source url changed to ${newUrl}`)
    }
}