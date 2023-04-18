/**
 * @fileoverview This file creates a table with the data of a community, a user and its interactions.
 * If a user is provided, the communnity will be the users community. Otherwise, no user data will be shown.
 * Community data will include diferent explanations based on the community data.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import {
    IArtworkData, ICommunityExplanation, ICommunityData, EExplanationTypes,
    IUserData, IExplicitCommData, IStringNumberRelation
}
    from "../constants/perspectivesTypes";
//Packages
import React, { useEffect, useMemo, useRef } from "react";
//Local files
import { StackedBarGraph } from "../basicComponents/StackedBarGraph";
import { NodePanel } from "./NodePanel";
import { WordCloudGraph } from "../basicComponents/WordCloudGraph";
import { SingleTreeMap } from "../basicComponents/SingleTreeMap";
import { ArtworkPanel } from "../basicComponents/ArtworkPanel";
import { Accordion } from "../basicComponents/Accordion";
import { ITranslation } from "../managers/CTranslation";
import { Button } from "../basicComponents/Button";

interface DataTableProps {
    tittle?: String;
    node?: IUserData;
    community?: ICommunityData;

    artworks: IArtworkData[];
    allUsers: IUserData[];

    showLabel: boolean;
    state: string;

    translation: ITranslation | undefined;

    setSelectedAttribute: Function;
}

/**
 * UI component that shows diferent types of data in a column
 */
export const DataTable = ({
    tittle = "Perspective",
    node,
    community,
    artworks,
    allUsers,
    showLabel,
    state,
    translation,
    setSelectedAttribute
}: DataTableProps) => {

    const CommunityPanel: React.ReactNode = useMemo(() => getCommunityPanel(community, allUsers, showLabel, artworks,
        translation, setSelectedAttribute),
        [community, allUsers, showLabel, artworks, translation, setSelectedAttribute]);

    const htmlRef = useRef(null);

    useEffect(() => {
        if (htmlRef.current !== null) {
            (htmlRef.current as HTMLDivElement).scrollTo(0, 0);
        }
    }, [node, community]);

    return (
        <div className={`dataColumn-container ${state}`} ref={htmlRef} style={getDataColumnContainerStyle(state)}>
            <h2 key={0} className="tittle dataColumn-tittle">  {tittle} </h2>
            <NodePanel
                key={1}
                tittle={`${translation?.dataColumn.citizenTittle}`}
                node={node}
                showLabel={showLabel}
                artworks={artworks}
                translation={translation}
            />
            {CommunityPanel}
        </div>
    )
};

/**
 * Returns a panel with all the community's data
 * @param community data of the community
 * @param allUsers data of all users of the perspective
 * @param showLabel visualization option value
 * @param artworks data of all artworks of the perspective
 * @param translation object to translate text
 * @param setSelectedAttribute set the current selected attribute for especific community highlighting
 * @returns 
 */
function getCommunityPanel(community: ICommunityData | undefined, allUsers: IUserData[], showLabel: boolean,
    artworks: IArtworkData[], translation: ITranslation | undefined, setSelectedAttribute: Function) {

    if (community !== undefined) {
        //Add the basic community data
        const tittle = <div key={0} className="dataColumn-subtittle"> {translation?.dataColumn.communityTittle} </div>;
        let content: React.ReactNode[] = [];

        content.push(<div className="row" key={1}> <strong> {translation?.dataColumn.communityNameLabel} </strong> &nbsp; {community.name} </div>);
        content.push(<div className="row" key={2}> {` ${translation?.dataColumn.totalCitizensLabel} ${community.users.length}`} </div>);
        content.push(<div className="row" key={3}> {` ${translation?.dataColumn.anonymousLabel} ${community.anonUsers.length}`} </div>);
        content.push(<br key={4} />);

        //Add an accordion with the artworks related to this community
        let accordionItems: React.ReactNode[] = [];
        let tittles: string[] = [];

        for (let i = community.representative_artworks.length - 1; i >= 0; i--) {

            const artworkData = artworks.find((element: IArtworkData) => { return element.id === community.representative_artworks[i][0] })
            tittles.push(`${artworkData?.tittle} - ${translation?.dataColumn.interactionsName}: ${community.representative_artworks[i][1]}`);

            accordionItems.push(
                <div key={i}>
                    {<ArtworkPanel artworksData={artworks}
                        id={community.representative_artworks[i][0]}
                        nInteractions={community.representative_artworks[i][1]}
                    />}
                </div>
            );
        }

        content.push(
            <div key={5}>
                <div key={0}> {translation?.dataColumn.relevantArtworks} </div>
                <Accordion key={1} items={accordionItems} tittles={tittles} />
            </div>);

        //Add all the diferent community explanations
        for (let i = 0; i < community.explanations.length; i++) {

            if (community.explanations[i].visible) {
                content.push(
                    <React.Fragment key={6 + i * 2}>
                        {getCommunityExplanation(community, community.explanations[i], allUsers, showLabel,
                            artworks, translation, setSelectedAttribute)}
                    </React.Fragment>);

                content.push(<br key={7 + i * 2} />);
            }
        }

        return (
            <div style={{ borderTop: "1px #dadce0 inset" }} key={2}>
                {tittle}
                {content}
            </div>
        )
    } else {
        return <React.Fragment />
    }


}

/**
 * Returns a panel with an available and visible explanation
 * @param communityData source community
 * @param explanation data of the explanation
 * @param allUsers all users of the perspective
 * @param showLabel visualization option value
 * @param artworks all artworks of the perspective
 * @param translation object to translate text
 * @param setSelectedAttribute set the current selected attribute for especific community highlighting
 * @returns 
 */
function getCommunityExplanation(communityData: ICommunityData, explanation: ICommunityExplanation, allUsers: IUserData[],
    showLabel: boolean, artworks: IArtworkData[], translation: ITranslation | undefined, setSelectedAttribute: Function) {
    if (explanation.visible === false) {
        return <React.Fragment />;

    } else {

        /*When an implicit attribute is selected, if possible, will select that attribute in the visualization.
this means all communities with the same attribute key and value will be highlighted*/
        const onAttributeSelected = (value: string) => {
            if (explanation.explanation_key) {
                setSelectedAttribute({ key: explanation.explanation_key, value: value, type: explanation.explanation_type })
            }
        }

        switch (explanation.explanation_type) {
            //Explicit attributes are simply shown in a stacked bar graph with colors representing its dimension
            case EExplanationTypes.explicit_attributes: {
                return (
                    <div>
                        {getStackedBars(communityData.explicitDataArray, translation)}
                    </div>);
            }
            //Medoid explanation is shown showing the medoid user data like any other user
            case EExplanationTypes.medoid: {

                const medoid = allUsers.find((value) => { return value.id === explanation.explanation_data.id });

                return (
                    <React.Fragment>
                        <hr />
                        <NodePanel
                            tittle={`${translation?.dataColumn.medoidTittle}`}
                            node={medoid}
                            showLabel={showLabel}
                            artworks={artworks}
                            translation={translation}
                        />
                    </React.Fragment>);
            }
            //Implicit attribute explanation are more specific and have diferent modes
            case EExplanationTypes.implicit_attributes: {
                return getImplicitExplanation(explanation, artworks);
            }
            case EExplanationTypes.implicit_attributes_map: {
                return getImplicitMapExplanation(explanation, onAttributeSelected, communityData.id);
            }
            case EExplanationTypes.implicit_attributes_list: {
                return getImplicitListExplanation(explanation, onAttributeSelected, artworks);
            }
            default: {
                console.log("Unrecognized explanation type");
                console.log(explanation.explanation_type);
                return "";
            }
        }
    }
}

function getImplicitExplanation(explanation: ICommunityExplanation, artworks: IArtworkData[]) {
    //Show the explanation data in an accordion with diferent artwork informations inside it
    if (explanation.explanation_data.accordionMode) {
        let accordionItems: React.ReactNode[] = [];

        const keys = Object.keys(explanation.explanation_data.data)
        //Check each iconclass family
        for (let key in keys) {
            let artworksPanels: React.ReactNode[] = [];

            const data: string[] = explanation.explanation_data.data[keys[key]];
            //Check each of the related artworks
            for (let i = 0; i < data.length; i++) {
                artworksPanels.push(<ArtworkPanel artworksData={artworks} id={data[i]} />);
            }

            accordionItems.push(
                <div>
                    {keys[key]}
                    {artworksPanels}
                </div>
            );

        }
        return (
            <div>
                <div> {explanation.explanation_data.label} </div>
                <Accordion items={accordionItems} tittles={keys} />
            </div>);


        //If its not an accordion explanation, try to do a wordCloud explanation
    } else {

        //If there are no values for a wordCloud, we just show the information in plain text rows. 
        if (isAllZero(explanation.explanation_data.data as IStringNumberRelation[])) {
            let textData: React.ReactNode[] = [];

            for (let i = 0; i < explanation.explanation_data.data.length; ++i) {
                textData.push(
                    <li key={i} style={{ marginLeft: "2rem" }}>
                        {explanation.explanation_data.data[i].value}
                        <br />
                    </li >);
            }

            return (
                <div>
                    <div> {explanation.explanation_data.label}</div>
                    <div>
                        {textData}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div> {explanation.explanation_data.label}</div>
                    <div> {getWordClouds(explanation.explanation_data.data, true, true, true)}</div>
                </div>);


        }
    }
}

function getImplicitMapExplanation(explanation: ICommunityExplanation, onAttributeSelected: (value: string) => void,
    communityId: string) {

    return (
        <div>
            <div> {`${explanation.explanation_data.label} : ${explanation.explanation_key}`}</div>
            <div> {getCommunityWordCloud(explanation.explanation_data.data, onAttributeSelected, communityId)}</div>
        </div>);
}

function getImplicitListExplanation(explanation: ICommunityExplanation, onAttributeSelected: (value: string) => void,
    artworks: IArtworkData[]) {

    if (explanation.explanation_data.data[0].artworks) {
        return getImplicitListAccordionExplanation(explanation, onAttributeSelected, artworks);
    } else {
        return getImplicitListTextExplanation(explanation, onAttributeSelected);
    }

}

function getImplicitListAccordionExplanation(explanation: ICommunityExplanation, onAttributeSelected: (value: string) => void,
    artworks: IArtworkData[]) {

    const accordionItems: React.ReactNode[] = [];
    const accordionTittles: string[] = [];

    let accordionItemContent: React.ReactNode[] = [];

    for (let i = 0; i < explanation.explanation_data.data.length; ++i) {
        accordionTittles.push(explanation.explanation_data.data[i].key)
        accordionItemContent.push(getExplanationListButton(explanation, onAttributeSelected, i));

        for (let j = 0; j < explanation.explanation_data.data[i].artworks; ++j) {
            accordionItemContent.push(<ArtworkPanel key={`${i}${j}`} artworksData={artworks} id={explanation.explanation_data.data[i].data[j]} />);
        }

        accordionItems.push(accordionItemContent);
        accordionItemContent = [];
    }

    return (<div>
        <div> {`${explanation.explanation_data.label} : ${explanation.explanation_key}`}</div>
        <div style={{ marginTop: "0.5rem" }}>
            <Accordion
                items={accordionItems}
                tittles={accordionTittles}
            />
        </div>
    </div>)
}

function getImplicitListTextExplanation(explanation: ICommunityExplanation, onAttributeSelected: (value: string) => void) {
    const textData = [];

    for (let i = 0; i < explanation.explanation_data.data.length; ++i) {
        textData.push(getExplanationListButton(explanation, onAttributeSelected, i));
    }

    return (
        <div>
            <div> {`${explanation.explanation_data.label} : ${explanation.explanation_key}`}</div>
            <div style={{ marginTop: "0.5rem" }}>
                {textData}
            </div>
        </div>
    )
}

function getExplanationListButton(explanation: ICommunityExplanation, onAttributeSelected: (value: string) => void, index: number) {
    return (
        <li key={index} className="interaction-container" style={{ display: "inline-flex" }}>
            <div style={{ height: "auto", marginRight: "0.2rem" }}>
                <Button
                    content={<div style={{ padding: "0px" }}> {explanation.explanation_data.data[index].key} </div>}
                    onClick={() => {
                        onAttributeSelected(explanation.explanation_data.data[index].key)
                    }}
                    extraClassName={"primary"}
                />
            </div>
            {`  ${explanation.explanation_data.data[index].label}`}
            <br />
        </li >
    )
}
/**
 * Returns a stacked bar graph of some data
 * @param data data to use in the stacked graph
 * @param translation object to translate text
 * @returns 
 */
function getStackedBars(data: IExplicitCommData[] | undefined, translation: ITranslation | undefined) {
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (data !== undefined && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            content.push(
                <StackedBarGraph
                    key={i}
                    tittle={data[i].key}
                    data={data[i].values}
                    dim={data[i].dimension}
                />
            );
        }
    } else {
        content.push(
            <div key={0} > {translation?.dataColumn.noUserAttrb}</div>
        );
    }

    return content;
}

//If the perspective of this dataColumn is active, add a red border
function getDataColumnContainerStyle(currentState: string): React.CSSProperties {
    let newStyle: React.CSSProperties = {}

    if (currentState === "active") {
        newStyle.borderLeft = "0.5rem solid var(--primaryButtonColor)";
    } else {
        newStyle.borderLeft = "1px solid #dadce0";
    }

    return newStyle;
}

/**
 * Creates a word cloud graph and a treeMap graph based on the same data, and pack them in the same container
 * @param data data source
 * @param showPercentage if true, both graphs will show its data with a % at the end
 * @param showCloud If false, the word cloud wont be shown
 * @param showTreeMap if false, the word cloud wont be shown
 * @returns 
 */
export function getWordClouds(data: IStringNumberRelation[], showPercentage: boolean = true, showCloud: boolean = true,
    showTreeMap: boolean = true): React.ReactNode {
    try {
        const wordCloud = <WordCloudGraph
            data={data}
            showPercentage={showPercentage}
        />

        const treeMap = <SingleTreeMap
            data={data}
            showPercentage={showPercentage}
        />

        return (
            <React.Fragment>
                <span className="word-cloud-wrapper" />
                {showCloud ? wordCloud : ""}
                {showTreeMap ? treeMap : ""}
            </React.Fragment>);
    } catch (e: any) {
        console.log("Error while creating a wordCloud from implicit attributes data");
        console.log(e);
        return <React.Fragment />
    }
}

/**
 * Same idea as getWordClouds, but it adds temporal support for onTreeClick function to set the selected attribute
 * @param data data source
 * @param onTreeClick function to execute when a treeMap rectangle has been clicked
 * @param key key of the community to separate diferent treeMaps
 * @returns 
 */
export function getCommunityWordCloud(data: IStringNumberRelation[], onTreeClick: Function, key: string | undefined): React.ReactNode {
    try {
        const wordCloud = <WordCloudGraph
            data={data}
            showPercentage={true}
        />

        const treeMap = <SingleTreeMap
            explKey={key}
            data={data}
            showPercentage={true}
            onTreeClick={onTreeClick}
        />

        return (
            <React.Fragment>
                <span className="word-cloud-wrapper" />
                {wordCloud}
                {treeMap}
            </React.Fragment>);
    } catch (e: any) {
        console.log("Error while creating a wordCloud from implicit attributes data");
        console.log(e);
        return <React.Fragment />
    }
}

/**
 * Check if all the count parameters are zero
 * @param data 
 * @returns 
 */
export function isAllZero(data: IStringNumberRelation[]) {
    let isAllZero = true;

    for (let i = 0; i < data.length; i++) {
        if (data[i].count !== 0) {
            return false;
        }
    }

    return isAllZero;
}