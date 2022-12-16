import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../basicComponents/Button';
import { EButtonState } from '../constants/viewOptions';

import '../style/base.css';

export default {
  title: 'Basic/Button',
  component: Button,

} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  content: "Default Button",
  state: EButtonState.unactive,
  autoToggle: true,
  extraClassName: "primary"
};

export const Secondary = Template.bind({});
Secondary.args = {
  content: "Default Button",
  state: EButtonState.unactive,
  autoToggle: true,
  extraClassName: "secondary"
};

export const NavBarBtn = Template.bind({});
NavBarBtn.args = {
  content: "NavBar Button",
  state: EButtonState.unactive,
  autoToggle: false,
  extraClassName: "transparent",
};

export const DropdownLightBtn = Template.bind({});
DropdownLightBtn.args = {
  content: "Light Button",
  state: EButtonState.unactive,
  autoToggle: true,
  extraClassName: "dropdown-light",
};
export const DropdownDarkBtn = Template.bind({});
DropdownDarkBtn.args = {
  content: "Dark Button",
  state: EButtonState.unactive,
  autoToggle: true,
  extraClassName: "dropdown-dark",
};


