# Parte 9
### Passport

<img src="https://cdn.icon-icons.com/icons2/885/PNG/512/9th_icon-icons.com_68912.png" width="200">

Voy a usar [Passport](http://www.passportjs.org/) y [JWT](https://jwt.io/) para las autenticaciones y mantener las sesiones.

## Sobre Passport

<img src="https://cdn.glitch.com/project-avatar/0d184ee3-fd8d-4b94-acf4-b4e686e57375.png" width="200">

Passport es un middleware para Node para Auths. La ventaja de usar Passport es que tiene una gran lista de posibilidades para diferentes estrategias, incluyendo OAuth de otras redes como gitHub, Facebook, Twitter, Google, Spotify, etc.. 

* Hay que elegir y configurar una de las estrategias (o varias).
`const strategy = new Strategy(...)`

* Incluirla en el modulo de Passport
`passport.use(strategy);`

* Iniciar Passport
`passport.initialize();`

* Pedirle a Passport que identifique donde lo requiera
`passport.authenticate(...)`

## JWT

<img src="https://jwt.io/img/logo-asset.svg" width="200">

En mi caso voy a usar JWT, o mejor dicho ya lo venia usando en los resolvers. 

Para generar este Token lo que venia haciendo es lo siguiente:

`const token = jwt.sign(OBJETO, CLAVE_SECRETA);`

* OBJETO es eso clave-valor, de los datos que se desean guardar, como un ID, un nombre, lo que sea, cuanto mas info es mas largo el TOKEN.

* CLAVE_SECRETA es eso una clave, numerica o letras, que no deberia saber mas que el server.

Para sacar infor del TOKEN

`const objeto = jwt.verify(token, CLAVE_SECRETA);` 

Y obtenemos el Objeto devuelta.

En mi caso voy a usar Passport para este paso.

## Configurando Passport

En `passport.js`

Importo estas 2 dependencias

```javascript
const passport = require('passport');
const passportJWT = require('passport-jwt');
```

Una es el modulo de Passport y la la otra es para la Estrategia del JWT. De esta ultima voy a pedirle 2 funciones

```javascript
const { Strategy, ExtractJwt } = passportJWT;
```

* Strategy es para armar la estrategia
* ExtractJwt es para extraer la info del JWT

En este caso como estoy trabajando en un archivo fuera del de configuración del server voy a exportar una función para que luego pueda ser conectada allí (o en otro lado).

```javascript
module.exports = (app, route, users) => {
  // Codigo
}
```

* app = instancia de Express
* route = donde voy a aplicarlo
* users = en este caso es la tabla de la DB que voy a usar para la estrategia

Dentro de esta función armo la estrategia

```javascript

const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(params, (payload, done) => { 
    // Si el Usuario Existe agregamos el ID en el request
    return users.findOne({where: {id: payload.id}}).then(u => {
      return done(null, u.id);
    }).catch(err => done(err));
  });
```

Los parametros de la estrategia son la clave sino no se podria y la función encargada de eso.

En payload viene el resultado de esta operación. Lo que hacemos es chequear que el ID exista en la Base de datos, si lo hace lo devuelvo al middleware, sino tira un err.

Podria devolver el usuario completo, pero para no tener todos los datos "encima" me conformó con el ID.

Luego conectamos esto e iniciamos Passport

```javascript
 passport.use(strategy);
 passport.initialize();
```

Y lo aplicamos a la ruta

```javascript
app.use(route, (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (user) { req.user = user }
      next()
    })(req, res, next)
  });
```

En este caso guardamos la info en objeto de request, esto es porque lo vamos a pasar como contexto en GraphQL.

Y asi esta listo Passport

- - - -

