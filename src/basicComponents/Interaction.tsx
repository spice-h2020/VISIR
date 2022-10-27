/**
 * @fileoverview This file creates a panel with the information of a user interaction with an artwork.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { anyProperty, ArtworkData, Interaction } from "../constants/perspectivesTypes";
//Packages
import { useEffect, useState } from "react";

import { WordCloudGraph } from "./WordCloudGraph";
import { SingleTreeMap } from "./SingleTreeMap";

const interactionBox: React.CSSProperties = {
    borderLeft: "1px solid var(--grayLineColor)",
    borderRight: "1px solid var(--grayLineColor)",
    padding: "5px",
}

const userFeelings: React.CSSProperties = {
    width: "80%",
    margin: "15px auto",
    border: "2px dashed var(--primaryButtonColor)",
    boxSizing: "border-box",
    textAlign: "center",
}

const artworkImage: React.CSSProperties = {
    maxHeight: "100%",
    maxWidth: "100%",
    border: "2px solid var(--grayLineColor)",
}

interface InteractionPanelProps {
    artworksData: ArtworkData[];
    interaction: Interaction;
}

/**
 * Basic UI component that shows the information about a single interaction of a user with an artwork
 */
export const InteractionPanel = ({
    artworksData,
    interaction,
}: InteractionPanelProps) => {

    const [artworkData, setArtworkData] = useState<ArtworkData>();

    useEffect(() => {
        const newArtwork = artworksData.find((element: ArtworkData) => { return element.id === interaction.artwork_id })
        setArtworkData(newArtwork);

    }, [interaction, artworksData]);

    if (artworkData !== undefined) {
        return (
            <div style={interactionBox}>
                <div style={{ maxHeight: "20vh" }} className="row">
                    <div className="col">
                        <div style={{ fontSize: "80%" }}>
                            {artworkData.author}
                        </div>
                        <br />
                        <div className="row">
                            {artworkData.tittle}&nbsp;
                            ({artworkData.year})
                        </div>
                    </div>
                    <div className="col">
                        <img style={artworkImage} src={artworkData.image}
                            alt={artworkData.tittle}
                        />
                    </div>
                </div>
                <div className="row">
                    <div style={userFeelings}>
                        "{interaction.feelings}"
                    </div>
                </div>
                <div>
                    <strong> Makes me feel:</strong>
                    {getEmotionsCloud(interaction.extracted_emotions)}
                    {/* {shopiaToString(interaction.extracted_emotions)} */}
                </div>
            </div>
        );
    } else
        return (
            <div> </div>
        );
};

/**
 * Function to parse shopia emotions to a readable string. Currently does nothing but parsing its text to string
 * @param emotions shopia emotion results
 * @returns a string with the translation
 */
function shopiaToString(emotions: anyProperty) {
    if (emotions !== undefined) {
        return JSON.stringify(emotions);
    } else {
        return "";
    }
}

function getEmotionsCloud(emotions: anyProperty) {
    const array = [];
    const keys = Object.keys(emotions);

    for (let i = 0; i < keys.length; i++) {
        array[i] = { value: keys[i], count: emotions[keys[i]] };
    }


    return (
        <div>
            <span style={{
                  height: "10px",
                  display: "block",
            }}/>
            <WordCloudGraph
                data={array}
            />
            <SingleTreeMap
                data={array}
            />
        </div>);
}