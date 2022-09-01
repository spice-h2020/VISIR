# SPICE-visualization-ReactPort
Port of https://github.com/gjimenezUCM/SPICE-visualization to react and typescript




_________________________
#### Known Errors

- Community data from all HECHT and MNCN are incorrect. The users ID array inside each community are diferent of the user ID inside each user in users array.
    This crashes the application when clicking a bounding box.

- Both IMMA_country_taxonomy perspectives dont have explicit communitys in their users.
    Makes the application crash when loading one of the perspectives.