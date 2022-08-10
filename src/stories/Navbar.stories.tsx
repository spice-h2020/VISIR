import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Navbar } from '../components/Navbar';
import { Dropdown } from '../components/Dropdown';

export default {
  title: 'Example/Navbar',
  component: Navbar,
  argTypes: { onClick: { action: 'option clicked' } },

} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;

export const example = Template.bind({});
example.args = {
  leftAlignedItems: [
    <Dropdown
      mainLabel="<-- First"
    />
    ,
    <Dropdown
      mainLabel="<-- Segundo"
    />
    ,
    <Dropdown
      mainLabel="<-- troisième"
    />
  ],
  rightAlignedItems: [
    <Dropdown
      mainLabel="--> First"
    />
    ,
    <Dropdown
      mainLabel="--> Segundo"
    />
    ,
    <Dropdown
      mainLabel="--> troisième"
    />
  ],
  midAlignedItems: [
    <Dropdown
      mainLabel="<-> First"
    />
    ,
    <Dropdown
      mainLabel="<-> Segundo"
    />
    ,
    <Dropdown
      mainLabel="<-> troisième"
    />
  ],
};


