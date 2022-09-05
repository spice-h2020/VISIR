# SPICE-visualization-ReactPort
Port of [SPICE-visualization repository](https://github.com/gjimenezUCM/SPICE-visualization) to react and typescript.


Access to the [github pages deployment](https://marcoexpper.github.io/SPICE-visualization-ReactPort/). 

## How to run the application localy

1. Download all the code of [this repository](https://codeload.github.com/MarcoExpPer/SPICE-visualization-ReactPort/zip/refs/heads/main).

### Using NPM package manager and Node.js
Prerequisite: Download NPM package manager and Node.js. Powershell or a similar program its also necesary to use the NPM commands.

2. Use powershell to go to the downloaded programm folder and install all packages with the following command `npm install`

3. Launch the local server with the following command `npm run start`

4. The app will automaticaly be opened by your web browser in the localhost port 3000. If it hasn't opened, try manualy opening the page `http://localhost:3000/`


## How to use the app.

1. Select the desired File Source from the FileSource dropdown. (local app files is the default option)

2. Once a correct source has been loaded, the Select Perspective dropdown should be clickable. Click any row to activate/disactivate the view of the perspective.

    1. When 2 or more perspectives are opened, the layout will of the perspectives will change, shrinking to fit both perspectives' visualizations at the same time. You can change this Layout with the Layout dropdown.
    
3. If u click a node of any network, all networks will select that node, will show the node's info in the nearby dataTables and will zoom in to that node and its connected nodes. A tooltip will be shown nearby the node to represent the same info as the dataTables.

4. If u click a bounding box and not a node, only this network will zoom in to all the nodes inside the bounding box, the dataTables will be updated with the community represented by the bounding box and a tooltip will appear similar to the node tooltip.

5. If u neither click a node or a bounding box, all datatables and tooltips will be cleared and a zoom out will bring the network to the original zoom.

6. All nodes will have diferent colours and shapes. Legend dropdown allows u to understand what does every colour/shape means. If u click any of the legend rows, all nodes that contain that characteristic will be made less obstrusive to the visualization.

### Other options
Options dropdown has several diferent options to change how the visualization is shown.

- Hide node labels is activated by default. Hides the label and id of the nodes both in the dataTables/tooltip and in the visualized network.

- Hide unselected Edges. Hide all edges excepts the ones that are conected to the current selected node.

- Minimum Similarity. Hide all edges that doesnt have a minimum similarity value even if they are selected.

- Remove % of edges. Directly removes a % of all edges of the network, chosen randomly. *Increasing this number heavily improves the visualization's performance*

- Make edge width variable. Change all edges' width to change based on each edge similarity.

- Activate node borders. Add a third visualization dimension to all nodes when possible. Depending on one characteristic, all nodes' border colour will change. The legend dropdown will be updated with this new characteristic and the new border colours.


## How to add more testing files

- Localfiles: Move any new file to ./public/data/ directory and update the dataList.json file with its perspective details. The new file and the perspective details must follow the format that all others perspectives are following. Now the app should be able to see that file after refreshing the browser and selecting local app files as the file source.

- API (WIP): Currently theres no way to upload new files or perspectives to the API.
_________________________
#### Known Errors

- Community data from all HECHT and MNCN are incorrect. The users ID array inside each community are diferent of the user ID inside each user in users array.
    This crashes the application when clicking a bounding box.

- Both IMMA_country_taxonomy perspectives dont have explicit communitys in their users.
    Makes the application crash when loading one of the perspectives.

- Opening 2 perspectives at the same time and closing the first opened perspective close the second one instead despite UI showing otherwise.
    Surprisingly doesnt break anything.
