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

0. By default if the URL contains perspective1 and/or perspective2 variables, the app will try to request and activate those perspectives. These URL variables are optional, there are other ways to pick between perspectives.
    1. An example of a URL with IDs is the following "http://localhost:3000/?perspective1=5&perspective2=6" Where 5 and 6 are the id of the files.

1. First you need to tell the app where the perspectives you want to see are located. With the FileSource dropdown you can pick between some options (local app files is the default option).
    1. Keep in mind, the moment u change the file source, the app will disable all active perspectives and will try to reload the URL perspectives if they exist.
    2. Currently the API server is not active, so unless u launch it localy, this option wont work.

2. Now you need to pick what perspectives you want to see. One way is the URL parameters as mentioned, the other way is to use the select perspective dropdowns. Clicking the name of the desired perspective will disable the prevously active perspective, if there is one, and load the new one.
    1. If a perspective is highlighted in red, it means its the current active perspective in this side of the app.
    2. If a perspective inside a dropdown is greyed out, it means its active in the other dropdown and you cant edit it from this dropdown.


3. Now that the perspective is active, if you click a node of any network, all networks will select that node, will show the node's info in the nearby dataTables and will zoom in to that node and its connected nodes. A tooltip will be shown nearby the node to represent similar info.

4. If you click a bounding box and not a node, two diferent things will happen depending on which network was clicked:
    1. The network that was clicked will zoom in to all nodes inside the bounding box, and will show information about the community related to the bounding box.
    2. The network that was *not* clicked, will search for all nodes inside the clicked bounding box, and if they exist in this network, they will be highlighted and the view will zoom to them

5. If you neither click a node or a bounding box, all datatables and tooltips will be cleared and a zoom out will bring the network to the original zoom.

6. All nodes will have diferent colours and shapes. Legend dropdown allows you to understand what does every colour/shape means. If you click any of the legend rows, all nodes that contain that characteristic will be made less obstrusive to the visualization.

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

To add testing files using LocalFile file source options, you need to do the following changes. 

- Localfiles: Move any new file to ./public/data/ directory. The new file must follow the required format explained in ./public/dataSchemas/perspectiveData.json. The id of the perspective must be queal to the name of the file. It's also necesary to add the id and the name to the ./public/data/dataList.json file. 

Once all of these changes are completed, the node.js instalation should already see the changes on the search engine. Reloading the page may help.
Docker instalation will need to re-execute the instalation process to create the ocker container with the changes. It's recommended to remove all previously loaded docker containers and images of this application.

_______________________
