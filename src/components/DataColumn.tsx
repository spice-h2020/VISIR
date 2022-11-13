/**
 * @fileoverview This file creates a table with the data of a community, a user and its interactions.
 * If a user is provided, the communnity will be the users community. Otherwise, no user data will be shown.
 * Community data will include stacked bars and the medoid user information if the explanation configuration allows it.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IArtworkData, ICommunityExplanation as IExplanationData, ICommunityData, EExplanationTypes, IUserData, anyProperty, IExplicitCommData }
    from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { StackedBarGraph } from "../basicComponents/StackedBarGraph";
import { NodePanel } from "./NodePanel";
import { WordCloudGraph } from "../basicComponents/WordCloudGraph";
import { SingleTreeMap } from "../basicComponents/SingleTreeMap";
import NodeDimensionStrategy from "../managers/nodeDimensionStat";

const sectionTittleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    fontWeight: "400",
    fontFamily: "var(--contentFont)",
    lineHeight: "135%",
    width: "100%",
    margin: "5px 0px"
}

const tableContainer: React.CSSProperties = {
    margin: "auto",
    padding: "16px 16px 24px 16px",
    backgroundColor: "white",
    border: "1px solid #dadce0",
    boxSizing: "border-box",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    wordWrap: "break-word",
}

interface DataTableProps {
    tittle?: String;
    node?: IUserData;
    community?: ICommunityData;

    artworks: IArtworkData[];
    allUsers: IUserData[];

    hideLabel: boolean;
    state: string;
    dimStrat: NodeDimensionStrategy | undefined;
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
    dimStrat,
}: DataTableProps) => {

    const CommunityPanel: React.ReactNode = getCommunityPanel(community, allUsers, hideLabel, artworks, dimStrat);

    return (
        <div className={state} style={getContainerStyle(state)}>
            <h2 key={0} className="tittle" style={{ fontSize: "1.5rem" }}>  {tittle} </h2>
            <NodePanel
                key={1}
                tittle={"Citizen Attributes"}
                node={node}
                hideLabel={hideLabel}
                artworks={artworks}
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
    artworks: IArtworkData[], dimStrat: NodeDimensionStrategy | undefined) {

    if (community !== undefined) {
        const tittle = <div key={0} style={sectionTittleStyle}> Community Attributes </div>;
        let content: React.ReactNode[] = [];

        content.push(<div className="row" key={1}> <strong> Name: </strong> &nbsp; {community.name} </div>);
        content.push(<div className="row" key={2}> {` Total Citizens: ${community.users.length}`} </div>);
        content.push(<div className="row" key={23}> {` Anonimous: ${community.anonUsers.length}`} </div>);
        content.push(<br key={4} />);

        for (let i = 0; i < community.explanations.length; i++) {
            if (community.explanations[i].visible) {
                content.push(<React.Fragment key={5 + i * 2}> {getCommunityExplanation(community,
                    community.explanations[i], allUsers, hideLabel, artworks, dimStrat)} </React.Fragment>);
                content.push(<br key={6 + i * 2} />);
            }
        }

        return (
            <div style={{ borderTop: "1px #dadce0 inset", paddingTop: "3px" }} key={2}>
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
    hideLabel: boolean, artworks: IArtworkData[], dimStrat: NodeDimensionStrategy | undefined) {
    if (explanation.visible === false) {
        return <React.Fragment />;

    } else {
        switch (explanation.explanation_type) {
            case EExplanationTypes.explicit_attributes: {
                return getStackedBars(communityData, dimStrat);
            }
            case EExplanationTypes.medoid: {

                const medoid = allUsers.find((value) => { return value.id === explanation.explanation_data.id });

                return <NodePanel
                    tittle={"Medoid Attributes"}
                    node={medoid}
                    hideLabel={hideLabel}
                    artworks={artworks}
                />;
            }
            case EExplanationTypes.implicit_attributes: {
                //Prepare the data for the stackedBarGraph
                const array: [string, number][] = [];

                const keys = Object.keys(explanation.explanation_data.data);
                for (let i = 0; i < keys.length; ++i) {
                    array.push([keys[i], explanation.explanation_data.data[keys[i]]]);
                }

                if (dimStrat !== undefined) {

                    return <div>
                        <div> {explanation.explanation_data.label}</div>
                        <div> {getImplicitDataClouds(explanation.explanation_data.data)}</div>
                        <div> {<StackedBarGraph
                            tittle={""}
                            commData={{ map: new Map(), array: array } as IExplicitCommData}
                            dimStrat={dimStrat}
                        />}</div>
                    </div>
                } else {
                    return <div>
                        <div> {explanation.explanation_data.label}</div>
                        <div> {getImplicitDataClouds(explanation.explanation_data.data)}</div>
                    </div>
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
function getStackedBars(community: ICommunityData, dimStrat: NodeDimensionStrategy | undefined) {
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (community.explicitCommunityArray !== undefined && dimStrat !== undefined) {

        for (let i = 0; i < community.explicitCommunityArray.length; i++) {
            content.push(
                <StackedBarGraph
                    key={i}
                    tittle={community.explicitCommunityArray[i][0]}
                    commData={community.explicitCommunityArray[i][1]}
                    dimStrat={dimStrat}
                />
            );
        }
    } else {
        content.push(
            <div key={0} > All users' attributes are unknown</div>
        );
    }

    return content;
}

function getContainerStyle(currentState: string): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(tableContainer)));

    if (currentState === "active") {
        newStyle.borderLeft = "7px solid var(--primaryButtonColor)";
    } else {
        newStyle.borderLeft = "1px solid #dadce0";
    }

    return newStyle;
}

function getImplicitDataClouds(data: anyProperty): React.ReactNode {
    try {
        const array = [];
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            array[i] = { value: keys[i], count: data[keys[i]] };
        }

        return (
            <div>
                <span style={{
                    height: "10px",
                    display: "block",
                }} />
                <WordCloudGraph
                    data={array}
                />
                <SingleTreeMap
                    data={array}
                />
            </div>);
    } catch (e: any) {
        console.log("Error while creating a wordCloud from implicit attributes data");
        console.log(e);
    }
}