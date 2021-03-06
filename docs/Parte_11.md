# Parte 11
### Cliente

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/11th_icon-icons.com_68925.png" width="200">

Para la parte final, la parte mas visual, no me voy a explayar mucho, ya que de momento tiene pocas caracteristicas, y puede ser mucho mas completa, o mejor dicho debe serlo.

Solo voy a explicar un par de conceptos.

## Token

El token que generó al registrarse o loggearse, hay que guardarlo en algun lado, mantenerlo, para usarlo en las llamadas a la API que correspondan.

Para las llamadas a la API tengo q agregar en el header

```
'Authorization': `Bearer ${token}`
```

## Log Out

<img src="https://cdn.glitch.com/b08b2821-cd06-4b0d-a360-e3ad18bf1a09%2FScreenshot-2019-1-27%20User-Playground(5).png?1548643409887">

No existe metodo en la API para Salir, deslogearse, para esto basta con eliminar la referencia guardada del token.

## Register

<img src="https://cdn.glitch.com/b08b2821-cd06-4b0d-a360-e3ad18bf1a09%2FScreenshot-2019-1-27%20User-Playground-2.png?1548643409948">

Las llamadas a la API para registrarse no son diferentes a las llamadas comunes, la unica diferencia es agregar `mutation`.

Como son llamadas async le agrego `async` a la espera del token.


```javascript
async function register(username, email, password, token) {
  return fetch(API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ 
      query: `mutation { 
          signIn(input: {userName: "${username}", email: "${email}", password: "${password}"}) {
            token
          }
        }` 
      }),
    })
    .then(res => res.json())
    .then(res => res.data.signIn.token)
    .catch(err => {console.log(err)});
}
```

## Login

<img src="https://cdn.glitch.com/b08b2821-cd06-4b0d-a360-e3ad18bf1a09%2FScreenshot-2019-1-27%20User-Playground(1).png?1548643400826">

Es igual al anterior.

```javascript
async function login(username, password, token) {
  return fetch(API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

    body: JSON.stringify({ 
      query: `mutation { 
          logIn(userName: "${username}", password: "${password}") {
            token
          }
        }` 
      }),
    })
    .then(res => res.json())
    .then(res => res.data.logIn.token)
    .catch(err => {console.log(err); return null});
}
```

## Otros

También use otras llamadas, por ejemplo para mostrar los datos de la persona loggeada en ese caso usé `me`.

Usé `UserName` y `isEmail` para chequear que el usuario y el email no existan al registrarse.

Se podria hacer mucho más. Poner notificaciones, que se edité el usuario, una vez logeado mostrar los usuarios registrados. No lo hice porque queria hacer algo rápido.

### Aclaración

Si bien usé VUE para esto, las llamadas, los fetchs se pueden usar para cualquier tipo de libreria y framework, sin embargo para casos como Angular, React, o mismo Vue Apollo tiene librerias dedicadas que ayudan a que sea mejor y añade caracteristicas.

## Bulma

<img src="https://cdn.glitch.com/b08b2821-cd06-4b0d-a360-e3ad18bf1a09%2FScreenshot-2019-1-27%20User-Playground(4).png?1548643410000" width="900">

Como con la app del clima usé Bulma para desplegar la parte visual, y usando la misma idea de aquella vez.

* Hero con la clase para que ocupe no solo el ancho sino el alto de la pantalla
  * Header para poner una barra de navegación, en este caso donde estan los botones para logearse, registrarse y salir
    * Los botones abren Modals con Forms
  * Footer para poner links como creditos
  * Body para poner una imagen cuando no se esta logeado, que se transforma a otra imagen con algunos datos del usuario abajo.
  
Insito podria tener mas cosas.

- - - -



