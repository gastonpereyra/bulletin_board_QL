# Bullentin Board QL Log

La idea para crear mi nuevo ejemplo lo voy a tratar de explicar un poco diferente a los otros proyectos.
Seguramente va a ser el mas largo de todos, por el momento, se me ocurrió hacerlo o contarlo como si fuera una bitacora.
Contar las cosas que me iban pasando a medida que me iban pasando. 

## Contenido

* [Parte 1](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/01.md) - Primeras decisiones
* [Parte 2](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/02.md) - Modelo de Datos

### Usuarios

* [Parte 3](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/03.md) - Base de datos
* [Parte 4](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/04.md) - App de Prueba
* [Parte 5](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/05.md) - Usuarios
* [Parte 6](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/06.md) - Configurar Sequelize
* [Parte 7](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/07.md) - Query
* [Parte 8](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/08.md) - Mutations
* [Parte 9](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/09.md) - Passport
* [Parte 10](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/10.md) - Apollo Server
* [Parte 11](https://github.com/gastonpereyra/bulletin_board_QL/blob/master/docs/blog/11.md) - UI de App Secundaria 

### App Secundaria

1. [APP Secundaria en Glitch (codigo + UI + Playground)](https://glitch.com/~user-playground)
2. [APP Secundaria en Github (UI + Playground)](https://gastonpereyra.github.io/user_playground/) o [APP Secundaria - Repo](https://github.com/gastonpereyra/user_playground)

----


## Idea

La idea es que en la página se pueda:

* [USUARIO_00] - Crear un Usuario, Entrar y Salir cuando quieran.
* [USUARIO_01] - Que pueda registrarse via mail.
* [USUARIO_02] - Que pueda registrarse via Github.
* [USUARIO_03] - Que pueda registrarse via Google.
* [USUARIO_04] - Diferentes niveles de Usuario: Administradores, Moderadores, Comunes.
* [CREAR_POST_00] - Cualquier Usuario puede crear un Post con Titulo, Etiquetas (varias), un mensaje (no muy largo).
* [CREAR_COM_00] - Cualquier Usuario puede comentar un Post, un mensaje corto.
* [CREAR_LIKE_00] - Cualquier Usuario puede valorar un Post (positivo, negativo).
* [ANON_00] - Alguien no loggeado no puede crear Post.
* [ANON_01] - Alguien no loggeado no puede comentar.
* [ANON_02] - Cualquiera puede ver los diferentes Posts.
* [ANON_03] - Cualquiera puede ver los comentarios.
* [VER_POST_00] - Se pueden ver los Post por Etiquetas.
* [VER_POST_01] - Se pueden ver los Post por Autor.
* [ORDER_00] - Se pueden ordenar los Posts por fecha (mas nuevo, mas viejo).
* [ORDER_01] - Se pueden ordenar los Posts por cantidad de visitas.
* [ORDER_02] - Se pueden ordenar los Posts por Positivos.
* [ORDER_03] - Se pueden ordenar los Posts por Negativos.
* [MOD_00] - El Autor del post puede modificar su Post.
* [VER_POST_03] - El Autor del post puede ver su Post invisible.
* [VER_COM_00] - El Autor del comentario puede ver su comentario invisible.
* [MOD_01] - Un Moderador puede hacer invisible un Post.
* [MOD_02] - Un Moderador puede hacer invisible un Comentario.
* [ADMIN_00] - Un Admin puede borrar un Post.
* [ADMIN_01] - Un Admin puede borrar un comentario.
* [ADMIN_02] - Un Admin puede cambiar el nivel del Usuario hasta Moderador.
* [ADMIN_03] - Un Admin puede borrar un Usuario.
* [ADMIN_04] - Solo desde el server se pueden crear los Admin.

## Estado de Avance:

Recién Empiezo.

* [USUARIO_00]
* [USUARIO_01]
* [USUARIO_04]
* [ADMIN_02]
* [ADMIN_02]
* [ADMIN_03]
* [ADMIN_04]



