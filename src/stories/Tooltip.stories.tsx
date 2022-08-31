import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tooltip } from '../basicComponents/tooltip';
import { DataRow, Point, TooltipInfo } from '../constants/auxTypes';

//import '../style/base.css';

export default {
  title: 'Example/Tooltip',
  component: Tooltip,

} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;


export const userExample = Template.bind({});
const mainNodeData = new Array();

mainNodeData.push(new DataRow("Id", "40"))
mainNodeData.push(new DataRow("Label", "nº 40"))
mainNodeData.push(new DataRow("Implicit_community", "14"))

const subNodeData = new Array();

subNodeData.push(new DataRow("Selected language", "FIN"))
subNodeData.push(new DataRow("Selected age", "GenX"))
subNodeData.push(new DataRow("Selected avatar", "p\u00e4ssi"))

const userContent: TooltipInfo = {
  tittle: "Citizen data",
  mainDataRow: mainNodeData,
  subDataRow: subNodeData,
}
const userPosition: Point = {
  x: 200,
  y: 150
}

userExample.args = {
  content: userContent,
  state: true,
  position: userPosition
};

export const commExample = Template.bind({});
const mainCommData = new Array();

mainCommData.push(new DataRow("Id", "1"))
mainCommData.push(new DataRow("Name", "Community 1"))
mainCommData.push(new DataRow("Explanation", "Representative Properties: {'Artefacts collected': 'Stool60, Pastille chair, Pehtoori'}"))

const subCommData = new Array();

const commContent: TooltipInfo = {
  tittle: "Community data",
  mainDataRow: mainCommData,
  subDataRow: subCommData
}

const commPosition: Point = {
  x: 450,
  y: 100
}

commExample.args = {
  content: commContent,
  state: true,
  position: commPosition
};

