/**
 * @fileoverview This file creates a table with the data of a community, a user and its interactions.
 * If a user is provided, the communnity will be the users community.
 * Otherwise, no user data will be shown.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ArtworkData, CommExplanation as ExplanationData, CommunityData, ExplanationTypes, UserData } from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { InteractionPanel } from "../basicComponents/Interaction";
import { Accordion } from "../basicComponents/Accordion";
import { StackedBarGraph } from "../basicComponents/StackedBarGraph";

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
    node?: UserData;
    community?: CommunityData;

    artworks: ArtworkData[];
    allUsers: UserData[];

    hideLabel: boolean;
    state: string;
}

/**
 * Basic UI component that shows some data in a table
 */
export const DataTable = ({
    tittle = "Perspective",
    node,
    community,
    artworks,
    allUsers,
    hideLabel,
    state,
}: DataTableProps) => {

    const nodePanel = getNodePanel("Citizen Attributes", node, hideLabel);
    const interactions = getInteractionsAccordion(node, artworks);
    const communities = getCommunityPanel(community, allUsers, hideLabel, artworks)

    return (
        <div className={state} style={getContainerStyle(state)}>
            <h2 className="tittle" style={{fontSize: "1.5rem"}}>  {tittle} </h2>
            {nodePanel}
            {interactions}
            {communities}
        </div>
    )
};

/**
 * Returns a panel with all the node's information.
 * @param node source node.
 * @param hideLabel boolean that will hide the node label in the panel.
 * @returns a react component with the node's panel.
 */
function getNodePanel(header: string, node: UserData | undefined, hideLabel: boolean) {
    const tittle = <div style={sectionTittleStyle}> {header} </div>;
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (node !== undefined) {

        if (!hideLabel) {
            content.push(<div className="row" key={-1}> <strong> Label: </strong> &nbsp; {node.label} </div>);
        }

        const keys = Object.keys(node.explicit_community);

        for (let i = 0; i < keys.length; i++) {
            content.push(<div className="row" key={i}> {`${keys[i]}: ${node.explicit_community[keys[i]]}`} </div>);
        }
    }

    if (content.length === 0) {
        return "";
    } else {
        return (
            <div style={{ borderBottom: "1px #dadce0 inset", paddingBottom: "3px" }} key={1}>
                {tittle}
                {content}
            </div>
        )
    }
}

/**
 * Returns an accordion that includes all the node's interactions.
 * @param node source node
 * @param artworks all artworks' data
 * @returns a react component with the node's interactions accordion.
 */
function getInteractionsAccordion(node: UserData | undefined, artworks: ArtworkData[]) {
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (node !== undefined && node.interactions !== undefined) {

        const tittles: string[] = new Array<string>();
        const interactions: React.ReactNode[] = new Array<React.ReactNode>();

        for (let i = 0; i < node.interactions.length; i++) {

            const interaction = node.interactions[i];
            const artwork = artworks.find((element: ArtworkData) => { return element.id === interaction.artwork_id });

            if (artwork !== undefined) {
                tittles.push(artwork.tittle);
                interactions.push(
                    <InteractionPanel
                        artworksData={artworks}
                        interaction={interaction}
                    />
                );
            }
        }

        content.push(
            <div key={2} style={{ margin: "5px 0px" }}>
                <Accordion
                    items={interactions}
                    tittles={tittles}
                />
            </div>
        )
    }

    return (<React.Fragment key={2}>
        {content}
    </React.Fragment>);
}

/**
 * Returns a panel with all the community's information.
 * @param community source community.
 * @returns a react component with the community's panel.
 */
function getCommunityPanel(community: CommunityData | undefined, allUsers: UserData[], hideLabel: boolean, artworks: ArtworkData[]) {

    const tittle = <div style={sectionTittleStyle}> Community Attributes </div>;
    let content: React.ReactNode[] = [];

    if (community !== undefined) {

        content.push(<div className="row" key={-1}> <strong> Name: </strong> &nbsp; {community.name} </div>);
        content.push(<div className="row" key={-4}> {` Citizens: ${community.users.length}`} </div>);
        content.push(<br key={-5} />);

        for (let i = 0; i < community.explanations.length; i++) {
            content.push(getCommunityExplanation(community, community.explanations[i], allUsers, hideLabel, artworks));
            content.push(<br key={-6 - i} />);
        }
    }

    return (
        <div style={{ borderTop: "1px #dadce0 inset", paddingTop: "3px" }} key={3}>
            {tittle}
            {content}
        </div>
    )
}


function getCommunityExplanation(communityData: CommunityData, explanation: ExplanationData, allUsers: UserData[], hideLabel: boolean, artworks: ArtworkData[]) {
    if (explanation.visible === false) {
        return "";

    } else {
        switch (explanation.explanation_type) {
            case ExplanationTypes.explicit_attributes: {
                return getStackedBars(communityData);
            }
            case ExplanationTypes.medoid: {

                const medioid = allUsers.find((value) => { return Number(value.id) === explanation.explanation_data.id });

                return (
                    <React.Fragment>
                        {getNodePanel("Medoid Attributes", medioid, hideLabel)}
                        {getInteractionsAccordion(medioid, artworks)}
                    </React.Fragment>);
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
function getStackedBars(community: CommunityData) {
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (community.explicitCommunityArray !== undefined) {

        for (let i = 0; i < community.explicitCommunityArray.length; i++) {
            content.push(
                <StackedBarGraph
                    key={i}
                    tittle={community.explicitCommunityArray[i][0]}
                    commData={community.explicitCommunityArray[i][1]}
                />
            );

        }
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