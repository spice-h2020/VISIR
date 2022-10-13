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

const pairs = [
    ["Adult", "39.8%"],
    ["Young", "25.5%"],
    ["Elder", "34.7%"],
]

export const Color = Template.bind({});
Color.args = {
    tittle: "AgeGroup",
    pairs: pairs,
    dimension: Dimensions.Color
};

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

export const None = Template.bind({});
None.args = {
    tittle: "AgeGroup",
    pairs: pairs,
};




