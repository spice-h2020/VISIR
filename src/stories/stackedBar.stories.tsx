import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StackedBarGraph } from '../basicComponents/StackedBarGraph';
import { Dimensions } from '../constants/nodes';
import { IStringNumberRelation } from '../constants/perspectivesTypes';



import '../style/base.css';

export default {
    title: 'Basic/Bars',
    component: StackedBarGraph,

} as ComponentMeta<typeof StackedBarGraph>;

const Template: ComponentStory<typeof StackedBarGraph> = (args) => <StackedBarGraph {...args} />;

//COLOR EXAMPLE
const colValues: IStringNumberRelation[] = [
    { value: "Adult", count: 73.9, props: 0 },
    { value: "Young", count: 17.4, props: 1 },
    { value: "", count: 4.3, props: 2 },
    { value: "Elderly", count: 4.3, props: 3 }
];

export const Color = Template.bind({});
Color.args = {
    tittle: "AgeGroup",
    data: colValues,
    dim: Dimensions.Color,
};

//SHAPE EXAMPLE
const shpValues: IStringNumberRelation[] = [
    { value: "EN", count: 37.0, props: 0 },
    { value: "IT", count: 32.6, props: 1 },
    { value: "HE", count: 23.9, props: 2 },
    { value: "FI", count: 4.3, props: 3 },
    { value: "ES", count: 2.2, props: 4 }
];

export const Shape = Template.bind({});
Shape.args = {
    tittle: "Language",
    data: shpValues,
    dim: Dimensions.Shape,
};

//NONE EXAMPLE
const noneValues: IStringNumberRelation[] = [
    { value: "EN", count: 40.0 },
    { value: "ES", count: 30.0 },
    { value: "FI", count: 10.0 },
    { value: "HE", count: 7.5 },
    { value: "AL", count: 5.0 },
    { value: "IT", count: 2.5 },
    { value: "DE", count: 2.0 },
    { value: "PO", count: 2.0 },
    { value: "FR", count: 1.0 }
];

export const None = Template.bind({});
None.args = {
    tittle: "Language",
    data: noneValues,
    dim: Dimensions.Shape,
};


