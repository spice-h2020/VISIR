/**
 * @fileoverview This file creates a table with the data of a community, a user and its interactions.
 * If a user is provided, the communnity will be the users community. Otherwise, no user data will be shown.
 * Community data will include stacked bars and the medoid user information if the explanation configuration allows it.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import {
    IArtworkData, ICommunityExplanation as IExplanationData, ICommunityData, EExplanationTypes, IUserData
    , IExplicitCommData, IStringNumberRelation, IHumanizator
}
    from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { StackedBarGraph } from "../basicComponents/StackedBarGraph";
import { NodePanel } from "./NodePanel";
import { WordCloudGraph } from "../basicComponents/WordCloudGraph";
import { SingleTreeMap } from "../basicComponents/SingleTreeMap";
import { CTranslation } from "../constants/auxTypes";

const sectionTittleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    fontWeight: "400",
    fontFamily: "var(--contentFont)",
    lineHeight: "135%",
    width: "100%",
    margin: "1rem 0px",
    color: "var(--title)"
}

const tableContainer: React.CSSProperties = {
    margin: "auto",
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    border: "1px solid #dadce0",
    boxSizing: "border-box",
    borderRadius: "8px",

    height: "fit-content",
    width: "100%",

    maxHeight: "80vh",
    maxWidth: "35vw",

    wordWrap: "break-word",

    overflowY: "auto",
}

interface DataTableProps {
    tittle?: String;
    node?: IUserData;
    community?: ICommunityData;

    artworks: IArtworkData[];
    allUsers: IUserData[];

    hideLabel: boolean;
    state: string;

    translationClass: CTranslation;
    humanizator: IHumanizator;
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
    hideLabel,
    state,
    translationClass: tClass,
    humanizator,
}: DataTableProps) => {

    const CommunityPanel: React.ReactNode = getCommunityPanel(community, allUsers, hideLabel, artworks, tClass, humanizator);

    return (
        <div className={state} style={getContainerStyle(state)}>
            <h2 key={0} className="tittle" style={{ fontSize: "1.5rem" }}>  {tittle} </h2>
            <NodePanel
                key={1}
                tittle={tClass.t.dataColumn.citizenTittle}
                node={node}
                hideLabel={hideLabel}
                artworks={artworks}
                translationClass={tClass}
                humanizator={humanizator}
            />
            {CommunityPanel}

        </div>
    )
};


/**
 * Returns a panel with all the community's information.
 * @param community source community.
 * @returns a react component with the community's panel.
 */
function getCommunityPanel(community: ICommunityData | undefined, allUsers: IUserData[], hideLabel: boolean,
    artworks: IArtworkData[], tClass: CTranslation, humanizator: IHumanizator) {

    if (community !== undefined) {
        const tittle = <div key={0} style={sectionTittleStyle}> {tClass.t.dataColumn.communityPanelTittle} </div>;
        let content: React.ReactNode[] = [];

        content.push(<div className="row" key={1}> <strong> {tClass.t.dataColumn.communityNameLabel} </strong> &nbsp; {community.name} </div>);
        content.push(<div className="row" key={2}> {` ${tClass.t.dataColumn.citizenAmount} ${community.users.length}`} </div>);
        content.push(<div className="row" key={23}> {` ${tClass.t.dataColumn.anonymous} ${community.anonUsers.length}`} </div>);
        content.push(<br key={4} />);

        for (let i = 0; i < community.explanations.length; i++) {
            if (community.explanations[i].visible) {
                content.push(
                    <React.Fragment key={5 + i * 2}>
                        {getCommunityExplanation(community, community.explanations[i], allUsers, hideLabel,
                            artworks, tClass, humanizator)}
                    </React.Fragment>);

                content.push(<br key={6 + i * 2} />);
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
 * Returns a panel with the explanations of the community based on the explanation parameter configuration.
 * @param communityData source community.
 * @param explanation data of the explanations to know its type and if it should be visible.
 * @returns a react component with the explanations.
 */
function getCommunityExplanation(communityData: ICommunityData, explanation: IExplanationData, allUsers: IUserData[],
    hideLabel: boolean, artworks: IArtworkData[], tClass: CTranslation, humanizator: IHumanizator) {
    if (explanation.visible === false) {
        return <React.Fragment />;

    } else {

        switch (explanation.explanation_type) {
            case EExplanationTypes.explicit_attributes: {
                //Humanize the text outputs of the stacked bars
                if (communityData.explicitDataArray !== undefined && communityData.explicitDataArray.length) {
                    const data = communityData.explicitDataArray;

                    for (let i = 0; i < data.length; i++) {

                        const tittle = data[i].key;
                        const values = data[i].values;

                        for (const legendAttrb of humanizator.legendAttrb) {
                            const humanTittle = legendAttrb.get(tittle);

                            data[i].key = humanTittle ? humanTittle : data[i].key;

                            for (let i = 0; i < values.length; i++) {
                                const humanData = legendAttrb.get(values[i].value);
                                values[i].value = humanData ? humanData : values[i].value;
                            }
                        }
                    }
                }
                //Return the explanation
                return (
                    <div>
                        <hr />
                        {getStackedBars(communityData.explicitDataArray, tClass)}
                    </div>);
            }
            case EExplanationTypes.medoid: {

                const medoid = allUsers.find((value) => { return value.id === explanation.explanation_data.id });

                return (
                    <React.Fragment>
                        <hr />
                        <NodePanel
                            tittle={tClass.t.dataColumn.medoidTittle}
                            node={medoid}
                            hideLabel={hideLabel}
                            artworks={artworks}
                            translationClass={tClass}
                            humanizator={humanizator}
                        />
                    </React.Fragment>);
            }
            case EExplanationTypes.implicit_attributes: {
                //Humanize the values used in the world clouds
                const humanLabel = humanizator.normalAttrb.get(explanation.explanation_data.label);
                if (humanizator !== undefined) {
                    for (let i = 0; i < explanation.explanation_data.data.length; i++) {
                        const humanData = humanizator.normalAttrb.get(explanation.explanation_data.data[i].value);
                        explanation.explanation_data.data[i].value = humanData ? humanData : explanation.explanation_data.data[i].value;
                    }
                }

                //Create the explanation
                if (isAllZero(explanation.explanation_data.data as IStringNumberRelation[])) {
                    let textData: React.ReactNode[] = [];

                    for (let i = 0; i < explanation.explanation_data.data.length; ++i) {
                        const humanValue = humanizator.normalAttrb.get(explanation.explanation_data.data[i].value);
                        textData.push(
                            <li key={i} style={{ marginLeft: "2rem" }}>
                                {humanValue ? humanValue : explanation.explanation_data.data[i].value}
                                <br />
                            </li >);
                    }

                    return (
                        <div>
                            <hr />
                            <div> {humanLabel ? humanLabel : explanation.explanation_data.label}</div>
                            <div>
                                {textData}
                            </div>
                        </div>
                    )
                } else {

                    return (
                        <div>
                            <hr />
                            <div> {humanLabel ? humanLabel : explanation.explanation_data.label}</div>
                            <div> {getWordClouds(explanation.explanation_data.data)}</div>
                            <div>
                                <StackedBarGraph
                                    tittle={""}
                                    data={explanation.explanation_data.data as IStringNumberRelation[]}
                                    dim={undefined}
                                />
                            </div>
                        </div>);
                }
            }
            default: {
                console.log("Unrecognized explanation type");
                console.log(explanation.explanation_type);
                return "";
            }
        }
    }
}



/**
 * Returns all stacked bar graphs of a community.
 * @param community source community.
 * @returns a react component array with the community's stacked bar.
 */
function getStackedBars(data: IExplicitCommData[] | undefined, tClass: CTranslation) {
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
            <div key={0} > {tClass.t.dataColumn.unknownUserAttrb}</div>
        );
    }

    return content;
}

function getContainerStyle(currentState: string): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(tableContainer)));

    if (currentState === "active") {
        newStyle.borderLeft = "0.5rem solid var(--primaryButtonColor)";
    } else {
        newStyle.borderLeft = "1px solid #dadce0";
    }

    return newStyle;
}

/**
 * Creates two word cloud graphs
 * @param data parameters that will be represented in the cloud
 * @returns a react node with two diferent word clouds visualizations.
 */
export function getWordClouds(data: IStringNumberRelation[]): React.ReactNode {
    try {
        return (
            <React.Fragment>
                <span style={{
                    height: "10px",
                    display: "block",
                }} />
                <WordCloudGraph
                    data={data}
                />
                <SingleTreeMap
                    data={data}
                />
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
function isAllZero(data: IStringNumberRelation[]) {
    let isAllZero = true;

    for (let i = 0; i < data.length; i++) {
        if (data[i].count !== 0) {
            return false;
        }
    }

    return isAllZero;
}