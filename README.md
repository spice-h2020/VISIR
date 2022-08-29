# SPICE-visualization-ReactPort
Port of https://github.com/gjimenezUCM/SPICE-visualization to react and typescript




_________________________
#### Comentarios % Errores

- El visualizar las labels de las aristas reduce mucho el rendimiento de la aplicación.

- Los datos de todas las perspectivas de HETCH, en concreto el array de userID en las comunidades, no tienen la misma id que la que aparece posteriormente en el objeto users. 
    Provoca fallos al clicar una bounding box en la perspectiva

- Ambas perspectives de IMMA_country:taxonomy no tienen comunidades explicitas en los usuarios.
    Provoca fallos al cargar la perspectiva