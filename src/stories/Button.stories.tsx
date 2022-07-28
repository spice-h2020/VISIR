import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Example/Button',
  component: Button,

} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Toggle = Template.bind({});
Toggle.args = {
  label: "Button",
  toggleState: true,
};

export const noToggle = Template.bind({});
noToggle.args = {
  label: "Button",
  toggleState: false,
};

export const startInit = Template.bind({});
startInit.args = {
  label: "Button",
  toggleState: true,
  state: true,
};


