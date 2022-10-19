# SPICE-visualization-ReactPort
Port of [SPICE-visualization repository](https://github.com/gjimenezUCM/SPICE-visualization) to react and typescript

Access to the [github pages deployment](https://marcoexpper.github.io/SPICE-visualization-ReactPort/). 

Documentation explained in the [wiki](https://github.com/MarcoExpPer/SPICE-visualization-ReactPort/wiki)

#### Index
1. [How to run the application localy](#How-to-run-the-application-localy)
    1. [Using Docker](#Using-Docker)
    2. [Using Node.js and NPM](#Using-Node.js-and-NPM)
2. [How to use the app](#How-to-use-the-app)
3. [How to add more testing files](#How-to-add-more-testing-files)

## How to run the application localy
There are 2 ways of running the application. Docker allows for an easy one command instalation, Node.js allows to introduce new testing files. Both options start with these steps.

Prerequisite: [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell) or any similar command prompt to execute commands.

1. Download all the code of [this repository](https://codeload.github.com/MarcoExpPer/SPICE-visualization-ReactPort/zip/refs/heads/main).

2. Go to the project forlder inside PowerShell or similars.

### Using Docker.
Prerequisite: [Docker](https://www.docker.com/).

3. Run the docker container with the following command `docker-compose -f docker-compose.dev.yml up` inside the project folder.

4. The app will be automaticaly launched in `http://localhost:3000/` once the previous command finishes, so open that URL in your web browser.

### Using Node.js and NPM. 
Prerequisite: [Node](https://nodejs.org/en/).

3. Use powershell to go to the downloaded program folder and install all packages with the following command `npm install`

4. Launch the local server with the following command `npm run start`

5. The app will automaticaly be opened by your web browser in the localhost port 3000. If it hasn't opened, try manualy opening the page `http://localhost:3000/`

______________________
## How to use the app.

0. By default, when you open the APP, it will load 2 predetermined files from the local file system.

1. You need to tell the APP the ID of the files u want to see. You can do that by editing directly editing "perspective1" and "perspective2" URL's values to the desired IDs. Idealy, there would be another UI that streamlines the perspectiveID selection.
   1.1. Keep in mind, that the moment u enter the new parameters, the APP will try to load them and will output a little error if they dont exist in the selected File Source. U can accept the alert box and then pick the desired File Source where the perspective is saved.

2. Now u need to pick the desired FIle Source, where the selected perspectives are saved. Local files is the default option for local testing. The connection to the API is still work in progress.

3. If u click a node of any network, all networks will select that node, will show the node's info in the nearby dataTables and will zoom in to that node and its connected nodes. A tooltip will be shown nearby the node to represent similar info.

4. If u click a bounding box and not a node, two diferent things will happen depending on which network was clicked:
    4.1 The network that was clicked will zoom in to all nodes inside the bounding box, and will show information about the community related to the bounding box.
    4.2 The network that was *not* clicked, will search for all nodes inside the clicked bounding box, and if they exist in this network, they will be highlighted and the view will zoom to them

5. If u neither click a node or a bounding box, all datatables and tooltips will be cleared and a zoom out will bring the network to the original zoom.

6. All nodes will have diferent colours and shapes. Legend dropdown allows u to understand what does every colour/shape means. If u click any of the legend rows, all nodes that contain that characteristic will be made less obstrusive to the visualization.

#### Other options
Options dropdown has several diferent options to change how the visualization is shown.

- Hide node labels is activated by default. Hides the label and id of the nodes both in the dataTables/tooltip and in the visualized network.

- Hide unselected Edges. Hide all edges excepts the ones that are conected to the current selected node.

- Minimum Similarity. Delete all edges that doesnt have a minimum similarity value. *Can improve performance if increased*

- Remove % of edges. Directly removes a % of all edges of the network, chosen randomly. *Can improve performance if increased*

- Activate node borders. Add a third visualization dimension to all nodes when possible. Depending on one characteristic, all nodes' border colour will change. The legend dropdown will be updated with this new characteristic and the new border colours.

______________________
## How to add more testing files
There is a format guide for new testing files [here](https://github.com/MarcoExpPer/SPICE-visualization-ReactPort/blob/main/public/data/dataFormatGuide.txt).

To add testing files using LocalFile file source options, Node.js instalation is required.

- Localfiles: Move any new file to ./public/data/ directory. The new file must follow the required format. The id of the perspective will be equal to the name of its file. Now u can write the ID of the file in the URL in one of the url parameters, "perspective1" or "perspective2" to load that one. 

- API (WIP): Currently theres no way to upload new files or perspectives to the API.
_______________________
