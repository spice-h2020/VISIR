# SPICE-visualization-ReactPort
Port of https://github.com/gjimenezUCM/SPICE-visualization to react and typescript



Access to the github pages deployment:
https://marcoexpper.github.io/SPICE-visualization-ReactPort/
_________________________
#### Known Errors

- Community data from all HECHT and MNCN are incorrect. The users ID array inside each community are diferent of the user ID inside each user in users array.
    This crashes the application when clicking a bounding box.

- Both IMMA_country_taxonomy perspectives dont have explicit communitys in their users.
    Makes the application crash when loading one of the perspectives.

- Opening 2 perspectives at the same time and closing the first opened perspective close the second one instead despite UI showing otherwise.
    Surprisingly doesnt break anything.
    
- Deleting edges before clicking a node breaks the app.
