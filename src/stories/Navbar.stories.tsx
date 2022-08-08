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
      itemsLabels={["First", "Second", "-", "Third", "-", "Fourth"]}
      mainLabel="<-- First"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
    ,
    <Dropdown
      itemsLabels={["Primero", "-", "Segundo"]}
      mainLabel="<-- Segundo"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
    ,
    <Dropdown
      itemsLabels={["Premier ", "seconde ", "troisième"]}
      mainLabel="<-- troisième"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
  ],
  rightAlignedItems: [
    <Dropdown
      itemsLabels={["First", "Second", "-", "Third", "-", "Fourth"]}
      mainLabel="--> First"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
    ,
    <Dropdown
      itemsLabels={["Primero", "-", "Segundo"]}
      mainLabel="--> Segundo"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
    ,
    <Dropdown
      itemsLabels={["Premier ", "seconde ", "troisième"]}
      mainLabel="--> troisième"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
  ],
  midAlignedItems: [
    <Dropdown
      itemsLabels={["First", "Second", "-", "Third", "-", "Fourth"]}
      mainLabel="<-> First"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
    ,
    <Dropdown
      itemsLabels={["Primero", "-", "Segundo"]}
      mainLabel="<-> Segundo"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
    ,
    <Dropdown
      itemsLabels={["Premier ", "seconde ", "troisième"]}
      mainLabel="<-> troisième"
      onClick={(key: string) => {
        console.log(key);
        return true;
      }}
    />
  ],
};


