# Azure Digital Twin UI Application
Azure digital twin service can be utilized to IoT solutions that it utilizes DTDL language to create twins that map to real work scenerio. Though It works mainly as part of the backend service, there is need to have a convinient UI for models/twins creation. This software is for that purpose. It can be used in real-world scenerio by supporting large scale digital twins management.

## Getting Started

For out-of-the-box usage, directly install node library and run
1. in root folder, run "npm install"
2. If you have not execute "az login", please run it before continue
3. run "npm start"

It will pop up a browser window with initial dialog to choose which ADT service instance you want to operate.

For developer's usage, there is additional npm run option to use
1. npm run dev  -  It will monitor change in frontend code change (in ./portalSourceCode) and refresh browser window automatically
2. npm run production - It will minify the frontend code and put the code to folder portalProduction

## Prerequisites

- An Azure Digital Twin service subscription in any of your Azure subscriptions
- Azure CLI
- Nodejs

## Highlight Features
1. Full support of ADT editing functionalites, including relationship level properties editing
2. Create multiple customized layout of your twins for your purpose like in CAD tool. It is important for practical tasks.
3. Adopt heavily parallel asynchronize ADT service calls. It achieves a satisfying responding time for operation.
4. A flexible data selection feature at the start so you do not need to wait a long loading time when there are many twins.
5. Customizable twin and relationship visualization style, including importing image as twin's avarta    

![Main UI](https://raw.githubusercontent.com/leolumicrosoft/ADTUI/master/libfiles/images/screenshot1.jpg)
![Choose datasets](https://raw.githubusercontent.com/leolumicrosoft/ADTUI/master/libfiles/images/screenshot2.jpg)

## How To Use Tips
1. Start with a set of twins data
    - You can create a filter in start screen to query a subset of twins to start, instead of "ALL" filter
    - You can always append another filter (that queries another subset of twins) to the current workspace in "Source" 
    - You can choose twins, and use "query inbound/outbound" button to expand the twins set in your workspace

2. You can multi-select twins and connections in topology view by pressing shift key

3. You can define color and icon image for twins and connections in "Models"

4. You can save the location of twins in topology view to layouts. You can call back twins' location by selecting a stored layout.

5. You can edit the connections line by inserting bend points or control points. You will create segmented edge line or bezier curve edge line.

6. There is a text search box above the twins list tree view. You can use it to search twins by typing substring and press enter till you find the twin you are looking for.

7. Double click the twin name in the twins list tree view will center to the twin in topology view.

## Development
### Plan
The application is created as an single web page application that accesses azure digital twin service remotely. Since this limitation, more advanced features, such as
- SingalR integration for live telemetry event
- database storage and so on, are not created
- Azure indoor map view integration
- Revit 3D Autocad BIM model integration

It should. So it is in plan to create a native cloud host demonstration platform with those advanced capabilities.

### New Feature update
- Support edge shape editing (segment lines or bezier curve), thanks to Cytoscape edge editing plugin
![bending edge](https://raw.githubusercontent.com/leolumicrosoft/ADTUI/master/libfiles/images/saveEdge.jpg)

## Purpose
- A convinient application to use together with ADT cloud service
- Demonstrate how ADT SDK can be used in your product development

## Built With

* JQuery
* Crytoscape.js (https://js.cytoscape.org/#demos)
* Crytoscape Edge Editing extension (https://github.com/iVis-at-Bilkent/cytoscape.js-edge-editing)
* Azure Digital Twin Javascript SDK (https://docs.microsoft.com/en-us/javascript/api/@azure/digital-twins-core/?view=azure-node-latest)
* Azure Identity Javascript SDK (https://docs.microsoft.com/en-us/javascript/api/@azure/identity/?view=azure-node-latest)
* JQuery UI (https://jqueryui.com/)
* JQuery UI Layout (http://layout.jquery-dev.com/)


## Contributing

## Versioning

## Authors

leolu@microsoft.com


## License


## Acknowledgments