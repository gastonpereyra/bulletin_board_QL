const API = 'https://bullentin-board-ql.glitch.me/graphql';

async function checkUser(username) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Le paso el Query en JSON
    body: JSON.stringify({ 
      query: `{ 
          isUserName(userName:"${username}")
        }` 
      }),
    })
    .then(res => res.json())
    .then(res => res.data.isUserName)
    .catch(err => {console.log(err)});
}

async function checkEmail(email) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Le paso el Query en JSON
    body: JSON.stringify({ 
      query: `{ 
          isEmail(email:"${email}")
        }` 
      }),
    })
    .then(res => res.json())
    .then(res => res.data.isEmail)
    .catch(err => {console.log(err)});
}

async function getUser(token) {
  return fetch(API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // Le paso el Query en JSON
    body: JSON.stringify({ 
      query: `{ 
          me {
            userName
            email
            role
          }
        }` 
      }),
    })
    .then(res => res.json())
    .then(res => res.data.me)
    .catch(err => {console.log(err)});
}

async function register(username, email, password, token) {
  return fetch(API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // Le paso el Query en JSON
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

async function login(username, password, token) {
  return fetch(API, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // Le paso el Query en JSON
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

const app = new Vue({
  el: "#main",
  data: {
    token: null,
    modalLogIn: false,
    modalSignIn: false,
    menu: false,
    l_username: null,
    l_userVal: null,
    l_password: null,
    l_passVal: null,
    username: null,
    userVal: null,
    email: null,
    emailVal: null,
    password: null,
    passVal: null,
    u_username: null,
    u_email: null,
    u_role: null
  },
  methods: {
    toggleSignIn: function () {
      this.modalSignIn= !this.modalSignIn;
    },
    toggleLogIn: function () {
      this.modalLogIn= !this.modalLogIn;
    },
    toggleMenu: function () {
      this.menu= !this.menu;
    },
    l_checkUser: async function (e) {
      this.l_userVal= (await checkUser(this.l_username));
    },
    l_checkPassword: async function (e) {
      this.l_passVal= this.l_password.length>3 && this.l_password.length<17;
    },
    login: async function(e) {
      this.token= await login(this.l_username, this.l_password, this.token);
      if (this.token) this.getUser();
      this.toggleLogIn();
      e.preventDefault();
    },
    checkUser: async function (e) {
      this.userVal= !(await checkUser(this.username));
    },
    checkEmail: async function (e) {
      this.emailVal= !(await checkEmail(this.email)) && this.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    },
    checkPassword: async function (e) {
      this.passVal= this.password.length>3 && this.password.length<17;
    },
    register: async function(e) {
      this.token= await register(this.username, this.email, this.password, this.token);
      if (this.token) this.getUser();
      this.toggleSignIn();
      e.preventDefault();
    },
    getUser: async function() {
      const user = await getUser(this.token);
      this.u_username= user.userName;
      this.u_email = user.email
      this.u_role = user.role === 0 ? "Usuario" : user.role === 1 ? "Mod" : "Admin";
    },
    userOut: function() {
      this.token= null;
    }
  }
  
});