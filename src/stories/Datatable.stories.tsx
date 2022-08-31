import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DataTable } from '../basicComponents/datatable';
import { DataRow } from '../constants/auxTypes';
import '../style/base.css';

export default {
  title: 'Example/Datatable',
  component: DataTable,

} as ComponentMeta<typeof DataTable>;

const Template: ComponentStory<typeof DataTable> = (args) => <DataTable {...args} />;


export const userExample = Template.bind({});
const mainNodeData = new Array();

mainNodeData.push(new DataRow("Id", "40"))
mainNodeData.push(new DataRow("Label", "nº 40"))
mainNodeData.push(new DataRow("Implicit_community", "14"))

const subNodeData = new Array();

subNodeData.push(new DataRow("Selected language", "FIN"))
subNodeData.push(new DataRow("Selected age", "GenX"))
subNodeData.push(new DataRow("Selected avatar", "p\u00e4ssi"))

userExample.args = {
  tittle: "Citizen data",
  MainRows: mainNodeData,
  SubRows: subNodeData
};

export const commExample = Template.bind({});
const mainCommData = new Array();

mainCommData.push(new DataRow("Id", "1"))
mainCommData.push(new DataRow("Name", "Community 1"))
mainCommData.push(new DataRow("Explanation", "Representative Properties: {'Artefacts collected': 'Stool60, Pastille chair, Pehtoori'}"))

const subCommData = new Array();

commExample.args = {
  tittle: "Community data",
  MainRows: mainCommData,
  SubRows: subCommData
};

