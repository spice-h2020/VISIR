/**
 * @fileoverview This file creates a panel with the information of an artwork related to a community. This is used
 * inside accordion items to show diferent artworks in a compact way.
 * It shows the name,year,author, the image of the artwork and the number of interactions with the artwork.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IArtworkData } from "../constants/perspectivesTypes";
//Packages
import { useEffect, useState } from "react";
import React from "react";

interface ArtworkPanelProps {
    artworksData: IArtworkData[];
    id: string;
    nInteractions?: number;
}

/**
 * UI component that only shows information about a single artwork of a community.
 */
export const ArtworkPanel = ({
    artworksData,
    id,
    nInteractions,
}: ArtworkPanelProps) => {

    const [artworkData, setArtworkData] = useState<IArtworkData>();

    useEffect(() => {
        const newArtwork = artworksData.find((element: IArtworkData) => { return element.id === id })
        setArtworkData(newArtwork);

    }, [id, artworksData]);

    if (artworkData !== undefined) {
        return (
            <div className="interaction-container row">
                <div className="col">
                    <div style={{ fontSize: "80%" }}>
                        {artworkData.author}
                    </div>
                    <br />
                    <div className="row">
                        {artworkData.tittle}&nbsp;
                        ({artworkData.year})
                    </div>
                    <br />
                    {getNInteractionsRow(nInteractions)}

                </div>
                <div className="col">
                    <img className="artwork-image" src={artworkData.image}
                        alt={artworkData.tittle}
                    />
                </div>
            </div>
        );
    } else
        return (
            <div> </div>
        );
};



function getNInteractionsRow(nInteractions: number | undefined) {
    if (nInteractions !== undefined)
        return (<div className="row">
            Number of interactions: &nbsp; {nInteractions}
        </div>)
    else {
        return <React.Fragment />
    }
}