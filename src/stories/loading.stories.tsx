import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoadingFrontPanel } from '../basicComponents/LoadingFrontPanel';
import { EButtonState } from '../constants/viewOptions';

import '../style/base.css';

export default {
    title: 'Example/Loading',
    component: LoadingFrontPanel,

} as ComponentMeta<typeof LoadingFrontPanel>;

const Template: ComponentStory<typeof LoadingFrontPanel> = (args) => <LoadingFrontPanel {...args} />;

export const normal = Template.bind({});
normal.args = {
    message: "Loading Nothing",
    isActive: true
};


