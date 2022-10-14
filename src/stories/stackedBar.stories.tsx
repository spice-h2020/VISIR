import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../basicComponents/Button';
import { StackedBar } from '../basicComponents/StackedBar';
import { Dimensions } from '../constants/nodes';
import { ButtonState } from '../constants/viewOptions';

import '../style/base.css';

export default {
  title: 'Example/Bars',
  component: StackedBar,

} as ComponentMeta<typeof StackedBar>;

const Template: ComponentStory<typeof StackedBar> = (args) => <StackedBar {...args} />;

let pairs = [
    ["Adult", 73.9],
    ["Young", 17.4],
    ["(empty)", 4.3],
    ["Elderly", 4.3],
]

export const Color = Template.bind({});
Color.args = {
    tittle: "AgeGroup",
    pairs: pairs,
    dimension: Dimensions.Color
};

pairs = [
    ["EN", 37.0],
    ["IT", 32.6],
    ["HE", 23.9],
    ["FI", 4.3],
    ["ES", 2.2],
];

export const Shape = Template.bind({});
Shape.args = {
    tittle: "AgeGroup",
    pairs: pairs,
    dimension: Dimensions.Shape
};

export const Border = Template.bind({});
Border.args = {
    tittle: "AgeGroup",
    pairs: pairs,
    dimension: Dimensions.Border
};


pairs = [
    ["EN", 40.0],
    ["ES", 30.0],
    ["FI", 10.0],
    ["HE", 7.5],
    ["AL", 5.0],
    ["IT", 2.5],
    ["DE", 2.0],
    ["PO", 2.0],
    ["FR", 1.0],
];

export const None = Template.bind({});
None.args = {
    tittle: "AgeGroup",
    pairs: pairs,
};




