import { ComponentStory, ComponentMeta } from '@storybook/react';
import { WordCloudGraph } from '../basicComponents/WordCloudGraph';

import '../style/base.css';

export default {
    title: 'Example/WordCloud',
    component: WordCloudGraph,

} as ComponentMeta<typeof WordCloudGraph>;

const Template: ComponentStory<typeof WordCloudGraph> = (args) => <WordCloudGraph {...args} />;

const data = [
    { value: "Serenity", count: 0.25 },
    { value: "Anticipation", count: 1 },
    { value: "Trust", count: 1 },
    { value: "Joy", count: 1 },
    { value: "Fear", count: 0.5 },
    { value: "Anger", count: 0.5 },
    { value: "Surprise", count: 0.5 },
]

export const WordCloud = Template.bind({});
WordCloud.args = {
    data: data
};


