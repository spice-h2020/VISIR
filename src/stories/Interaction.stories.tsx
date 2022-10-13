import { ComponentStory, ComponentMeta } from '@storybook/react';
import { InteractionPanel } from '../basicComponents/Interaction';
import { ArtworkData, Interaction } from '../constants/perspectivesTypes';
import '../style/base.css';

export default {
  title: 'Example/Interaction',
  component: InteractionPanel,

} as ComponentMeta<typeof InteractionPanel>;

const Template: ComponentStory<typeof InteractionPanel> = (args) => <InteractionPanel {...args} />;

const artworkData: ArtworkData[] = [
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

const interaction: Interaction = {
  artwork_id: '1',
  feelings: 'scettico',
  sophia_extracted_emotions: {
    "Serenity": 0.7,
    "Trust": 0.3,
    "Fear": 0.5
  }
}

ExampleA.args = {
  artworksData: artworkData,
  interaction: interaction,
};

export const ExampleB = Template.bind({});


const interactionB: Interaction = {
  artwork_id: '2',
  feelings: 'Vociare, odori, curiosità, calore',
  sophia_extracted_emotions: {
    "Surprise": 0.622342,
    "Anger": 1,
    "Disgust": 1,
    "Love": 1
  }
}

ExampleB.args = {
  artworksData: artworkData,
  interaction: interactionB,
};
