# SPICE-visualization-ReactPort
Port of [SPICE-visualization repository](https://github.com/gjimenezUCM/SPICE-visualization) to react and typescript

Access to the [github pages deployment](https://marcoexpper.github.io/SPICE-visualization-ReactPort/). 

Documentation explained in the [wiki](https://github.com/MarcoExpPer/SPICE-visualization-ReactPort/wiki)

#### Index
1. [How to run the application localy](#How-to-run-the-application-localy)
    1. [Using Docker](#Using-Docker)
    2. [Using Node.js and NPM](#Using-Node.js-and-NPM)
2. [Easy how to use guide](#Easy-how-to-use-the-app)
3. [How to add more testing files](#How-to-add-more-testing-files)
4. [Preconfiguration available](#Preconfiguration-available)
5. [Complete user guide](#Complete-user-guide)
    1. [Loading](#Loading)
    2. [Toolbar](#Toolbar)
    1. [Perspective representation](#Perspective-representation)
    2. [Clicking the network](#Clicking-the-network)
    2. [DataColumn](#DataColumn)

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
## Easy how to use the app.
0. By default if the URL contains perspective1 and/or perspective2 variables, the app will try to request and activate those perspectives. These URL variables are optional, there are other ways to pick between perspectives.
    1. An example of a URL with IDs is the following "http://localhost:3000/?perspective1=5&perspective2=6" Where 5 and 6 are the id of the files.

1. First you need to tell the app where the perspectives you want to see are located. With the FileSource dropdown you can pick between some options (using the API files is the default option).
    1. Keep in mind, the moment file source is changed, the app will disable all active perspectives and will try to reload the URL perspectives if they exist.
    2. Currently the API server is not active, so unless you launch it localy or you know an URI with the API server, this option wont work.
    3. If its planed to use the API server, VISIR by default uses the local URI. To change this it's necesary to open the API dropright inside File Source dropdown. Pressing the update button at the right will load the textbox URL as the API server.

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

## Preconfiguration available

- Change default API url: Update the parameter `API_URI` in the app config file [located here](./src/appConfig.json)`

- Change default Docker deploy port: Update the parameter `DOCKER_PORT` from the .env file [located here](./.env)

- Change default NPM deploy port: Update the parameter `PORT` from the .env file [located here](./.env)

## Complete user guide

In this section all the app will be explained from a user point of view.

### Loading
When the app starts, it will request files to the API. If the API is not well defined, unavailable or is not corectly configured, an error will pop explaining what was the problem. Accept the error to continue using the  app. It's not a critical problem if the api is not intended to be used.

### Toolbar

From left to right: 
- **The first button** with VISIR logo and name will refresh the webpage to its default value, reseting any visualization configuration to default.
- **File Source** is a dropdown that let you pick the source of all perspectives.  The current file source will be highlighted in red.
    - Local app files to use the testing files available inside the app.
    - Click or hover Api URL to open a dropright. This dropdown allows to update the file source with the URL in the text box, clicking the update icon/btn at the right will trigger the update.
- **Options** is another dropdown to pick diferent options that will change how to visualize the perspectives. Options that are active are highlighted in red.
    - **Hide node labels** will toggle node's labels visibility from the visualization and from the dataColumn.
    - **Hide unselected edges** wil toggle edge visibility of the edges not directly connected to the clicked node/user. If no node is clicked, all edges will be hidden.
    - **Minimum similarity** slider allows to remove from the visualization all edges that are less than the value selected. Higher values can improve performance.
    - **Remove % of edges** slider allows to randomly remove a % of edges to reduce the amount of edges displayed. Higher values will increase performance.
    - **Activate node's borders** activates a third visualization dimension available to perspectives that include 3 or more explicit attributes. The new dimension is the color of the border of a node. Currently there are no examples of this button and it may not work properly.
- **Select perspective A** dropdown let the user pick what perspective want to visualize. When there are no available perspectives, it will be white and barely visible. When some perspectives are available, first it will do a little animation while changing its color to red.
    - The dropdown has a row for each of the available perspectives.
    - If a perspective is highlighted in red, its the current active perspective in this dropdown. Clickig it will desactivate it.
    - If a perspective name is semitransparent and a bit darker, its a perspective active in the other dropdown, and it wont responde to user clicks.
    - Any other perspective is available for visualization and clicking it will change the active perspective to the new clicked one.

- **Select perspective B** dropdown works exactly the same as the previous one.

    When there is a perspective selected on each of the dropdowns, both perspectives will be visualized side to side. The perspective at the left will be related to the active perspective in the left dropdown, "Select perspective A", and the perspective at the right will be related to the active perspective in the right dropdown, "Select perspective B"

    When two perspectives are selected, the collapse buttons will appear.
- **Collapse Buttons** are two dark buttons with "<<" ">>" icons inside. This buttons collapse the perspectives in te direction the arrow points, making the perspective in that side smaller, and the one at the other side bigger.

- **Legend dropdown** will show the legend of the current actives perspectives. If there are no active perspectives, will be disabled.
Once is active, the legend will show all the explicit communities of the users and the value of each of them. Clicking any of the values in the legend will reduce the visibility of all the users/nodes with that explicit value. 

### Perspective representation

All users will be represented with a node of a determined size,color and shape, distributed inside diferent bounding boxes of diferent colrs.

The **color dimension** represents one of the nodes' explicit communities while the specific color of a node represents the value of that explicit community.
The **shape** of a node works exactly the same, but with another explicit community and of course, shapes instead of colors.

There are some users that doesnt have any explicit community value, we call these users **Anonymous** and represent them with a "?" inside a circle.

The colored **bounding boxes** means that all nodes inside it are in the same community obtained via clustering. If some nodes are grouped but its bounding box is transparent, it means those nodes are not placed inside any community.

Finally, the **size** of the node represents if its the medoid user of the community.

The lines that goes from a node to another node represent that those nodes are connected by a similarity value. The value is equal or higher than the value selected in the minimum similarity slider.

### Clicking the network

Once any perspective is active, the user can interact with the network by clicking it.

- **Clicking a node** will highlight all nodes connected to the focused node and will zoom too all of them. The same will happen in the other active perspective. This will also show node's information and its community on the side dataColumns and will show a little tooltip with some of the node's info.
- **Clicking** one of the **bounding boxes** (and not a node inside the box), will highlight and zoom to all node inside the box. The other active perspective will highlight the same nodes in it's own perspective and distribution. dataColumns will show information about this community and will explain why it was created.
- **Not clicking** a node nor a bounding box will zoom to fit all nodes inside the viewport and will clear all the dataColumns.

### DataColumn

The data column shows diferent data based on the click interaction of the user. 
- **Node information**: Node information will show the node's label (if its not hided by the options dropdown) and also all its explicit communities and values. 
Then an accordion will show the diferent interactions the user has gotten with different artworks that were also specialy used to make this user part of a community.
After the accordion, a new accordion will include the user's interactions that are not related to the user community.
- **Interaction**: An interaction is a little box that contains the information about an artwork or a similar entity. Its tittle, date, author and an image if possible. Inside a red dashed box there is a commentary of the user. After that, we can see the representation of the diferent sentiments and feelings the user felt about the artwork.
- **Community information**: The community information will show the name of the community, the number of citizens inside the community and how many of them are anonymous. After the basic information, the dataColumn will show the communnity explanations.

    There are diferent types of explanations trying to explain why this community exist and what are the relations between the users inside. The order and quantity of these explanations can also change from one perspective to another and even from one community to another from the same perspective.

    - **Explicit Explanation**:
    Shows a bar divided in portions that represents an explicit community. Each portion represents one of the explicit community value. Hovering above a portion will show the name of the value.
    - **Medoid Explanation**:
    Shows the node information of the medoid user/node.
    - **Implicit Explanation**: 
    Shows a percentage distribution of an implicit attribute in a wordCloud or in some cases, only shows a list of the most representative implicit attributes.



*Last update of the content of this doc: 29/11/2022*






 
