/**
 * @fileoverview This file creates an interaction information panel.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { anyProperty, ArtworkData, Interaction } from "../constants/perspectivesTypes";
//Packages
import { useEffect, useState } from "react";
//Local files
import '../style/interactions.css';


interface InteractionPanelProps {
    artworksData: ArtworkData[];
    interaction: Interaction;
}

/**
 * Basic UI component that shows an interaction data
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
            <div className="interaction">
                <div className="row artwork-data">
                    <div className="col">
                        <div className="author"> {artworkData.author} </div>

                        <br />
                        <div className="row">
                            {artworkData.tittle}&nbsp;
                            ({artworkData.year})
                        </div>
                    </div>
                    <div className="col">
                        <img src={artworkData.image} />
                    </div>
                </div>
                <div className="row">
                    <div className="feelings">
                        "{interaction.feelings}"
                    </div>
                </div>
                <div className="row">
                    <div className="emotions">
                        <strong> Emotions:</strong>&nbsp;
                        {shopiaToString(interaction.sophia_extracted_emotions)}
                    </div>
                </div>
            </div>
        );
    } else
        return (
            <div> </div>
        );
};

function shopiaToString(emotions: anyProperty) {
    if (emotions !== undefined) {
        return JSON.stringify(emotions);
    } else {
        return "";
    }
}