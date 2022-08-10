import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Navbar } from '../basicComponents/Navbar';
import { Button } from '../basicComponents/Button';
import { Dropdown } from '../basicComponents/Dropdown';

export default {
  title: 'Example/Navbar',
  component: Navbar,
  argTypes: { onClick: { action: 'option clicked' } },

} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;

const selectedItems = [false, false, true];
const testButtons = [
  <Button
    content="Option A"
    state={selectedItems[0]}
  />,
  <hr />,
  <Button
    content="Option B"
    state={selectedItems[1]}
  />,
  <Button
    content="Option C"
    state={selectedItems[2]}
  />]

export const example = Template.bind({});
example.args = {
  leftAlignedItems: [
    <Button
      content="Button"
      extraClassName="navBar-mainBtn"
    />,
    ,
    <Dropdown
      items={testButtons}
      content="Dropdown <- A"
      extraClassName="dropdown-light"
    />
    ,
    <Dropdown
      items={testButtons}
      content="Dropdown <- B"
      extraClassName="dropdown-light"
    />
  ],
  midAlignedItems: [
    <Dropdown
      items={testButtons}
      content="Dropdown <-> A"
      extraClassName="dropdown-dark"
    />,
    <Dropdown
      items={testButtons}
      content="Dropdown <-> B"
      extraClassName="dropdown-light"
    />
  ],
  rightAlignedItems: [
    <Dropdown
      items={testButtons}
      content="Dropdown -> A"
      extraClassName="dropdown-dark"
    />,
    <Dropdown
      items={testButtons}
      content="Dropdown -> B"
      extraClassName="dropdown-dark"
    />
  ]
};


