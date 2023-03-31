/**
 * @fileoverview This file creates a words cloud graph. Currently the colors of the words are randomized 
 * by the package but it tryes to only use dark colors.
 * @package Requires React package.  
 * @package Requires react-tagcloud package.
 * @author Marco Expósito Pérez
 */
//Packages
import { TagCloud } from 'react-tagcloud'
import { IStringNumberRelation } from '../constants/perspectivesTypes';

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
        <div className='word-cloud-container'>
            <TagCloud
                tags={data}
                minSize={minSize}
                maxSize={maxSize}
                colorOptions={{ luminosity: "dark" }}
            />
        </div>
    );
};
