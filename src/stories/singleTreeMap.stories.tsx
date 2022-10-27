import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SingleTreeMap } from '../basicComponents/SingleTreeMap';

import '../style/base.css';

export default {
    title: 'Example/WordCloud',
    component: SingleTreeMap,

} as ComponentMeta<typeof SingleTreeMap>;

const Template: ComponentStory<typeof SingleTreeMap> = (args) => <SingleTreeMap {...args} />;

const data = [
    { value: "Serenity", count: 0.25 },
    { value: "Anticipation", count: 1 },
    { value: "Trust", count: 1 },
    { value: "Joy", count: 1 },
    { value: "Fear", count: 0.5 },
    { value: "Anger", count: 0.5 },
    { value: "Surprise", count: 0.5 },
]

export const Treemap = Template.bind({});
Treemap.args = {
    data: data
};


