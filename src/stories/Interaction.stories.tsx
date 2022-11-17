import { ComponentStory, ComponentMeta } from '@storybook/react';
import { InteractionPanel } from '../basicComponents/Interaction';
import { IArtworkData, IInteraction } from '../constants/perspectivesTypes';
import '../style/base.css';

export default {
  title: 'Example/Interaction',
  component: InteractionPanel,

} as ComponentMeta<typeof InteractionPanel>;

const Template: ComponentStory<typeof InteractionPanel> = (args) => <InteractionPanel {...args} />;

const artworkData: IArtworkData[] = [
  {
    id: "1",
    tittle: "Le tre finestre, La pianura della torre",
    author: "Jessie Boswell Leeds",
    year: 1924,
    image: "https://www.gamtorino.it/sites/default/files/opere/MALINCONIA-%20BOSWELL%20Le%20tre%20finestre.jpg"
  },
  {
    id: "2",
    tittle: "Mercato Vecchio",
    author: "Antonio Fontanesi Reggio Emilia",
    year: 1867,
    image: "https://www.gamtorino.it/sites/default/files/opere/FONTANESI_P_790.jpg"
  }
]

export const ExampleA = Template.bind({});

const interaction: IInteraction = {
  artwork_id: '1',
  feelings: 'scettico',
  extracted_emotions: [
    { value: "Serenity", count: 0.7 },
    { value: "Trust", count: 0.3 },
    { value: "Fear", count: 0.5 }
  ]
}

ExampleA.args = {
  artworksData: artworkData,
  interaction: interaction,
};

export const ExampleB = Template.bind({});


const interactionB: IInteraction = {
  artwork_id: '2',
  feelings: 'Vociare, odori, curiosità, calore',
  extracted_emotions: [
    { value: "Surprise", count: 0.62 },
    { value: "Anger", count: 1 },
    { value: "Disgust", count: 1 },
    { value: "Love", count: 1 }
  ]
}

ExampleB.args = {
  artworksData: artworkData,
  interaction: interactionB,
};
