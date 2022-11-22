import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Navbar } from '../basicComponents/Navbar';
import { Button } from '../basicComponents/Button';
import { EButtonState } from '../constants/viewOptions';

import '../style/base.css';
import { DropMenu } from '../basicComponents/DropMenu';

export default {
  title: 'Example/Navbar',
  component: Navbar,
  argTypes: { onClick: { action: 'option clicked' } },

} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;

const selectedItems = [EButtonState.unactive, EButtonState.unactive, EButtonState.active];
const testButtons = [
  <Button
    content="Option A"
    state={selectedItems[0]}
    extraClassName={"btn-dropdown"}
  />,
  <hr />,
  <Button
    content="Option B"
    state={selectedItems[1]}
    extraClassName={"btn-dropdown"}
  />,
  <Button
    content="Option C"
    state={selectedItems[2]}
    extraClassName={"btn-dropdown"}
  />]

export const example = Template.bind({});
example.args = {
  leftAlignedItems: [
    <Button
      content="Button"
      extraClassName="transparent"
    />,
    ,
    <DropMenu
      items={testButtons}
      content="Dropdown <- A"
      extraClassButton='transparent'
    />
    ,
    <DropMenu
      items={testButtons}
      content="Dropdown <- B"
      extraClassButton='transparent'
    />
  ],
  midAlignedItems: [
    <DropMenu
      items={testButtons}
      content="Dropdown <-> A"
      extraClassButton='primary'
    />,
    <DropMenu
      items={testButtons}
      content="Dropdown <-> B"
      extraClassButton='dark'
    />
  ],
  rightAlignedItems: [
    <DropMenu
      items={testButtons}
      content="Dropdown -> A"
      extraClassButton='dark'
    />,
    <DropMenu
      items={testButtons}
      content="Dropdown -> B"
      extraClassButton='primary'
    />
  ]
};


