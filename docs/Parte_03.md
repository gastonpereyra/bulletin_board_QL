# Parte 3
### Base de Datos

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/3rd_icon-icons.com_68924.png" width="200">

La base de datos va a ser en SQL. Voy a alojar el Server en Glitch, y este me ofrece la posiblidad de usar SQLite.

Lo bueno de Glitch en este tema es que usando SQLite no tengo que registrar nada nuevo, ni siquiera tengo que usar la memoria de la App, solo necesitar crear el archivo en `./.data/`

## ORM

Decido usar un ORM para manejar la Base de Datos, va a ser mejor para muchas cosas.
Elijo [**Sequelize**](http://docs.sequelizejs.com/)

<img src="http://docs.sequelizejs.com/manual/asset/logo-small.png">

Con Sequelize voy a tener que modelar los datos para poder que luego se formen las tablas y trabajar con ellos. No muy diferente a lo que ya iba a tener que hacer GraphQL.

También me va a poder agregar unos Hooks, para por ejemplo encriptar las passwords.

Y definir las relaciones entre las tablas.

Los documentos de la página son claros. En el fondo no me parece tan diferente a Mongoose que hubiera sido mi elección de usar MongoDB. El problema con MongoDB es que hubiera tenido que buscar donde guardarlo en la nube, talvez mLab.

Voy a empezar haciendo los Usuarios.

- - - -

