import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../basicComponents/Button';
import { StackedBarGraph } from '../basicComponents/StackedBarGraph';
import { Dimensions } from '../constants/nodes';
import { ExplicitCommData } from '../constants/perspectivesTypes';
import { ButtonState } from '../constants/viewOptions';

import '../style/base.css';

export default {
    title: 'Example/Bars',
    component: StackedBarGraph,

} as ComponentMeta<typeof StackedBarGraph>;

const Template: ComponentStory<typeof StackedBarGraph> = (args) => <StackedBarGraph {...args} />;


let explicitData = {
    map: new Map<string, number>(),
    dimension: Dimensions.Color,
    array: [
        ["Adult", 73.9],
        ["Young", 17.4],
        ["(empty)", 4.3],
        ["Elderly", 4.3],
    ]
} as ExplicitCommData;

export const Color = Template.bind({});
Color.args = {
    tittle: "AgeGroup",
    commData: explicitData,
};

explicitData = {
    map: new Map<string, number>(),
    dimension: Dimensions.Shape,
    array: [
        ["EN", 37.0],
        ["IT", 32.6],
        ["HE", 23.9],
        ["FI", 4.3],
        ["ES", 2.2],
    ]
} as ExplicitCommData;

export const Shape = Template.bind({});
Shape.args = {
    tittle: "Language",
    commData: explicitData,
};

explicitData = {
    map: new Map<string, number>(),
    dimension: undefined,
    array: [
        ["EN", 40.0],
        ["ES", 30.0],
        ["FI", 10.0],
        ["HE", 7.5],
        ["AL", 5.0],
        ["IT", 2.5],
        ["DE", 2.0],
        ["PO", 2.0],
        ["FR", 1.0],
    ]
} as ExplicitCommData;

export const None = Template.bind({});
None.args = {
    tittle: "Language",
    commData: explicitData,
};




