import React from 'react';
import './style/base.css';

import { Navbar } from './components/Navbar';
import { Dropdown } from './components/Dropdown';
import { Button } from './components/Button';

function App() {

  return (
    <div>
      <Navbar
        leftAlignedItems={[
          <Button
            content="Visualization module"
            extraClassName="navBar-mainBtn"
            onClick={() => { window.location.reload() }}
          />,
          <Dropdown
            mainLabel='File Source'
            itemsLabels={["Github Main", "Local", "Github Develop", "Use the api (WIP)"]}
            extraClassName="navBar-dropdown-light"
          />,
          <Dropdown
            mainLabel='Layout'
            itemsLabels={["Vertical", "Horizontal"]}
          />,

          <Dropdown
            mainLabel='Options'
            itemsLabels={["Hide node labels", "Hide unselected Edges", "-", "Variable edge width", "-", "Third dimension"]}
          />,
        ]}
        midAlignedItems={[
          <Dropdown
            mainLabel='Select Perspective'
            itemsLabels={["1", "2", "3"]}
          />,

        ]}
        rightAlignedItems={[
          <Button
            content={"Legend"}
          />,
        ]}
      />
      <h1> Communities Visualization</h1>

    </div>
  );
}

export default App;
