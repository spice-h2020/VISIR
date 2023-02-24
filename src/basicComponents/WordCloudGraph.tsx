/**
 * @fileoverview This file creates a words cloud graph. Currently the colors of the words are randomized 
 * by the package.
 * @package Requires React package.  
 * @package Requires react-tagcloud package.
 * @author Marco Expósito Pérez
 */
//Packages
import React from 'react';
import { TagCloud } from 'react-tagcloud'
import { IStringNumberRelation } from '../constants/perspectivesTypes';

const tagCloudStyle: React.CSSProperties = {
    maxHeight: "20vh",
    cursor: "default",
    backgroundColor: "white",
    width: "80%",
    margin: "auto",

    textAlign: "center",
    fontWeight: "bold",
}

interface WordCloudProps {
    minSize?: number;
    maxSize?: number;
    data: IStringNumberRelation[];
    showPercentage: boolean;
}

/**
 * UI component that creates a word cloud graph.
 */
export const WordCloudGraph = ({
    minSize = 10,
    maxSize = 30,
    data,
    showPercentage,
}: WordCloudProps) => {

    if (showPercentage) {
        for (let obj of data) {
            obj.props = { title: `${obj.count}%` }
        }
    }

    return (
        <div style={tagCloudStyle}>
            <TagCloud
                tags={data}
                minSize={minSize}
                maxSize={maxSize}
                colorOptions={{ luminosity: "dark" }}
            />
        </div>
    );
};
