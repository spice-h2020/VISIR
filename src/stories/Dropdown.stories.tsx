import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dropdown } from '../components/Dropdown';

export default {
  title: 'Example/Dropdown',
  component: Dropdown,
  argTypes: { onClick: { action: 'option clicked' } },


} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const onlyOne = Template.bind({});
onlyOne.args = {
  mainLabel:  "Select Only One",
};

export const diferents = Template.bind({});
diferents.args = {
  mainLabel:  "Select Diferents",
};


