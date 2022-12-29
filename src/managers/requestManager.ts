/**
 * @fileoverview This class manages all GET petitions to obtain the perspective files with the networks data.
 * @package Requires Axios package to be able to send the GET petitions.  
 * @package Requires React package to execute Dispatch functions. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EFileSource, initialOptions } from '../constants/viewOptions';
import { validateConfigurationSeed, validatePerspectiveDataJSON, validatePerspectiveIDfile as validateAllPerspectiveIDfile } from '../constants/ValidateFiles';
import { IPerspectiveData, PerspectiveId as IPerspectiveId } from '../constants/perspectivesTypes';
//Packages
import { Axios } from 'axios'
//Config
import config from '../appConfig.json';
import { ILoadingState } from '../basicComponents/LoadingFrontPanel';
import { CTranslation } from '../constants/auxTypes';


export default class RequestManager {
    isActive: boolean;
    axios: Axios;
    usingAPI: boolean;

    jobTimeOut: number = 2; //in seconds
    jobMaxWaitTime: number = 60; //in seconds

    currentJobWaitTime: number = 0;

    //URL to ask for files when local url is selected
    baseLocalURL: string = "./data";

    allPerspectivesGET: string = "visualizationAPI/index";
    singlePerspectiveGet: string = "visualizationAPI/file/";

    confSeedGET: string = "v1.1/seed";
    confSeedPOST: string = "v1.1/perspective";

    //Change the state of the loading spinner
    setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>;
    tClass: CTranslation;

    /**
     * Constructor of the class
     */
    constructor(setLoadingState: React.Dispatch<React.SetStateAction<ILoadingState>>, tClass: CTranslation) {
        this.setLoadingState = setLoadingState;
        this.tClass = tClass

        this.isActive = initialOptions.fileSource === EFileSource.Api;
        this.usingAPI = false;

        this.axios = new Axios();
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
        this.setLoadingState({ isActive: true, msg: `${this.tClass.t.loadingText.requestPerspective} ${name}` });

        this.getPerspective(perspectiveId)
            .then((response: any) => {
                if (response.status === 200) {

                    let perspective: IPerspectiveData;
                    if (typeof response.data === "object") {
                        perspective = validatePerspectiveDataJSON(response.data);
                    } else {
                        perspective = validatePerspectiveDataJSON(JSON.parse(response.data));
                    }

                    perspective.id = perspectiveId;
                    perspective.name = perspective.name === undefined ? name : perspective.name;

                    this.setLoadingState({ isActive: false });
                    callback(perspective);
                } else {
                    throw new Error(`Error wuile getting Perspective ${perspectiveId}: ${response.statusText}`);
                }
            })
            .catch((error: any) => {

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
        return this.requestToUrl(this.usingAPI ? `${this.singlePerspectiveGet}${id}` : `${id}.json`);
    }


    /**
     * Send a request for the id and names of all available perspectives.
     * When the request is finished, executes a callback function with all the new ids as parameter, undefined if
     * something went wrong.
     */
    requestAllPerspectivesIds(callback: Function, stateCallback?: Function) {
        this.setLoadingState({ isActive: true, msg: `${this.tClass.t.loadingText.requestingAllPerspectives}` });

        this.getAllPerspectives()
            .then((response: any) => {
                if (response.status === 200) {
                    let allIds: IPerspectiveId[] = [];
                    if (typeof response.data === "object") {
                        allIds = validateAllPerspectiveIDfile(response.data);
                    } else {
                        allIds = validateAllPerspectiveIDfile(JSON.parse(response.data));
                    }

                    callback(allIds);
                    if (stateCallback) stateCallback();
                } else {
                    throw new Error(`Error while getting All perspective files ${response.statusText}`);
                }
            })
            .catch((error: any) => {

                callback(undefined);
                if (stateCallback) stateCallback();

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
        return this.requestToUrl(this.usingAPI ? `${this.allPerspectivesGET}` : "dataList.json");
    }

    requestConfigurationToolSeed(callback: Function, stateCallback?: Function) {
        this.setLoadingState({ isActive: true, msg: `${this.tClass.t.loadingText.requestingConfToolSeed}` });

        this.getConfigurationToolSeed()
            .then((response: any) => {
                if (response.status === 200) {
                    let data = typeof response.data === "object" ? response.data : JSON.parse(response.data);

                    data = validateConfigurationSeed(data);

                    callback(data);
                    if (stateCallback) stateCallback();

                } else {
                    throw new Error(`Error while getting Configuration tool Seed. ${response.statusText}`);
                }
            })
            .catch((error: any) => {

                callback(undefined);
                if (stateCallback) stateCallback();

                console.log(`Configuration tool seed was not found:`);
                console.log(error);
                alert(`Configuration tool seed was not found: ${error.message}`);
            });
    }
    getConfigurationToolSeed() {
        return this.requestToUrl(this.usingAPI ? this.confSeedGET : "configurationTool/seedFile.json");
    }

    requestToUrl(url: string): any {
        console.log(`Request to ${this.axios.defaults.baseURL}${url}`);
        this.currentJobWaitTime = 0;

        return this.axios.get(url, {})
            .then(async (response) => {
                console.log(response)

                const data = JSON.parse(response.data);

                if (response.status === 202) {

                    await delay(this.jobTimeOut);
                    return this.askJobInProgress(data.path);

                } else if (response.status === 200) {
                    return { status: response.status, data: data };;
                } else {
                    throw new Error(`Error while requestion a file to ${this.axios.defaults.baseURL}${url}: ${response.statusText}`);
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    askJobInProgress(url: any): any {
        this.currentJobWaitTime += this.jobTimeOut;

        if (this.currentJobWaitTime > this.jobMaxWaitTime) {
            throw new Error("Max wait time for the community model reached");
        }
        this.setLoadingState({ isActive: true, msg: `${this.tClass.t.loadingText.CMisBusy} (${this.currentJobWaitTime / 2})` });

        return this.axios.get(url, {})
            .then(async (response) => {
                console.log(`Job in ${this.axios.defaults.baseURL}${url}`);
                console.log(response)

                const data = JSON.parse(response.data);

                if (response.status === 200 || response.status === 202) {

                    if (data.job["job-state"] === "STARTED") {
                        await delay(this.jobTimeOut);
                        return this.askJobInProgress(data.job.path);
                    } else {
                        return { status: response.status, data: data.job.data };
                    }
                } else {
                    throw new Error(`Error while waiting for a job in path ${url}: ${response.statusText}`);
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Update the baseURL of the requestManager
     * @param {EFileSource} newSource the new fileSource
     */
    changeBaseURL(newSource: EFileSource, apiURL?: string) {
        let newUrl = newSource === EFileSource.Local ? this.baseLocalURL : apiURL;

        if (apiURL === undefined && newSource === EFileSource.Api) {
            newUrl = config.API_URI;
        }

        this.usingAPI = newSource === EFileSource.Api;

        this.init(newUrl);

        console.log(`Source url changed to ${newUrl}`)
    }

    sendNewConfigSeed(newConfiguration: any) {
        //For some reason, CM gets blocked when axios send a petition
        //newConfiguration = JSON.stringify(newConfiguration)

        // this.axios.post(this.confSeedPOST,
        //     newConfiguration,
        // )
        //     .then((response) => {
        //         const data = JSON.parse(response.data);
        //         window.alert("inserted perspectiveId: " + data.insertedPerspectiveId);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         window.alert(err);
        //     });

        fetch(`${this.axios.defaults.baseURL}${this.confSeedPOST}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConfiguration)
        })
            .then(res => res.json())
            .then(function (res) {
                console.log("response: " + res)
                window.alert("inserted perspectiveId: " + res.insertedPerspectiveId);
            })
            .catch(function (err) {
                console.log(err)
                window.alert(err);
            });
    }
}


function delay(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}