import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../basicComponents/Button';

export default {
  title: 'Example/Button',
  component: Button,

} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: "Default Button",
  state: false,
  autoToggle: true,
};

import '../style/Navbar.css';
export const NavBarBtn = Template.bind({});
NavBarBtn.args = {
  content: "NavBar Button",
  state: false,
  autoToggle: false,
  extraClassName:"navBar-mainBtn",
};


import '../style/Dropdown.css';
export const DropdownLightBtn = Template.bind({});
DropdownLightBtn.args = {
  content: "Light Button",
  state: false,
  autoToggle: true,
  extraClassName:"dropdown-light",
};
export const DropdownDarkBtn = Template.bind({});
DropdownDarkBtn.args = {
  content: "Dark Button",
  state: false,
  autoToggle: true,
  extraClassName:"dropdown-dark",
};


