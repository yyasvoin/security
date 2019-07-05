# Security Lab

In this lab we'll be adding security measures to the website contained in this repository including authentication. The website comes with three pages along with status pages for any errors. The lab is broken up into three parts to cover each topic of security.

To run the website simply run `npm start` from your command line.


***
- [**Part One:** Implementing Sessions](#part-one-implementing-sessions)
- [**Part Two:** Protecting Routes and Static Assets](#part-two-protecting-routes-and-static-assets)
- [**Part Three:** `.env` Files](#part-three-env-files)
- [**Part Four:** Registration](#part-four-registration)
***




## **Part One:** Implementing Sessions

Before we can start protecting any of our resources we need to apply the middleware provided by the [express-session npm package](https://www.npmjs.com/package/express-session). We will also apply our own custom middleware to apply default session values.


### Instructions

```sh
git checkout part-1
```

1. Install the [express-session npm package](https://www.npmjs.com/package/express-session)
1. Apply the middleware after the first `express.static` middleware for open static assets
	- Set [`secret`](https://www.npmjs.com/package/express-session#secret) and make it any non-empty string
	- Set [`resave`](https://www.npmjs.com/package/express-session#resave) to `false`
	- Set [`saveUninitialized`](https://www.npmjs.com/package/express-session#saveuninitialized) to `true`
	- Set [`cookie.httpOnly`](https://www.npmjs.com/package/express-session#cookiehttponly) to `true`
	- Set [`cookie.maxAge`](https://www.npmjs.com/package/express-session#cookiemaxage) to expire in two hours
1. Create middleware to assign `null` to `req.session.username` if `req.session.username === undefined`
	- This middleware should always call `next` with no parameters when it's done
1. Apply the middleware you just created to be used directly after the [express-session](https://www.npmjs.com/package/express-session) middleware is applied
1. Check if the provided username and password in `req.body` are valid and if so set `req.session.username` to `req.body.username`
	- Is valid if `req.body.username` is `'fs1020'` and `req.body.password` is `'P@ssw0rd'`




## **Part Two:** Protecting Routes and Static Assets

```sh
git checkout part-2
```

Now that we've implemented sessions that store the username of whoever is logged in. In this portion of the lab we'll be protecting the `GET /secrets` route as well as the all static assets inside of [`static/protected`](https://gitlab.com/york-u-fs1020-spring-2013/security/tree/master/static/protected). To do this we'll need to create a new custom middleware and apply some simple flow control in our `GET /secrets` route.


### Instructions

1. Protect the `GET /secrets` route by checking if `req.session.username` is truthy or not
	- If the user is not authenticated, render the `status/forbidden` EJS view
1. Create a new custom middleware for authentication that checks if `req.session.username` is truthy or not
	- If the user is not authenticated, render the `status/forbidden` EJS view
1. Apply the middleware after the router middleware but before the `express.static` middleware serving the contents of [`static/protected`](https://gitlab.com/york-u-fs1020-spring-2013/security/tree/master/static/protected)




## Part Three: `.env` Files

As it stands right now our source code available on GitLab contains some highly sensitive data:

- [**Username and password:**](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/server/router/login.js#L21) Can be used to login to our website.
- [**Session secret:**](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/server/index.js#L31) Can be used to exploit our backend and guess valid session tokens.

If an unauthorized party were to gain access to our GitLab repository all of this information would become available to them. Even worse than this is if we were to work on a team with twenty other developers, some of which have already left the organization you work for and can no longer be contacted, every machine those developers have worked off of now has a copy of this sensitive information.

One could make the argument that [`views/secrets.ejs`](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/views/secrets.ejs) as well as the [`static/protected`](https://gitlab.com/york-u-fs1020-spring-2013/security/tree/part-3/static/protected) folder contains sensitive information as well. For the sake of keeping this lab simple, we can just imagine that all sensitive data contained in either comes from a database as that would generally be the case in the real world.

One method of eliminating these attack vectors is to store all of this sensitive data in a file we add into our [`.gitignore`](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/.gitignore) file. Each line in this file is a file we're telling git not to track, and therefore won't be shared around between computers or ever touch GitLab. We can store this information in a simple JSON file, however another common solution is to use a `.env` file. You can find an example of one that will have all the values required for us [here](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/.env.example).

A popular JavaScript library for using these libraries is [dotenv](https://www.npmjs.com/package/dotenv). It can be installed by simply running `npm install dotenv`. If we put `require('dotenv').config();` before any other call to the `require` function in our [`server/index.js`](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/server/index.js#L2) we can be sure that throughout our app all of our environment variables are set. We can access them as properties of the globally available `process.env` object. **Examples:**

```js
process.env.HTTP_PORT; // 3000
process.env.USERNAME; // 'exampleUsername'
process.env.PASSWORD; // 'examplePassword
process.env.SESSION_SECRET; // 'this can be anything'
```

Each developer will be required to make a copy of `.env.example` called `.env` in the root of our git repository right alongside the example file. They will also be required to fill out the values with whatever makes sense for their environment. The `.env` files on a production environment would not be made available to developers, and is usually confidential to as many people as possible to reduce any risk of exploits through said information leaking out.

`.env` files also have more practical uses such as defining which port the HTTP server should run on. An HTTP server running in a production environment will often use port _80_ or _443_ which you can expect to find in the production environment's `.env` file. In a developer's `.env` file, you'll likely see a non-standard port such as _3000_, _8000_, or _8080_. You can see this in our [`.env.example`](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-3/.env.example) with the `HTTP_PORT` value.


### Instructions

1. Copy `.env.example` into a file named `.env`
1. Inside your `.env` file:
	- Change `USERNAME` value to your first initial followed by your last name, eg: `USERNAME="mpalmer"`
	- Change `PASSWORD` to any non-empty string
	- Change `SESSION_SECRET` to any non-empty string
1. Install the [dotenv](https://www.npmjs.com/package/dotenv) npm package and follow usage instructions (found on the npm page just linked) to apply our environment variables to `process.env`
1. Use the port from our `.env` file so our Express server listens on that port
1. Replace hardcoded cookie secrets
1. Replace hardcoded username and password checks




## Part Four: Registration

```sh
git checkout part-4
```

In this portion of the lab a lot of the programming has been done for us. We see a new directory called `db` that exposes three functions for us. We don't need to concern ourself with the contents of this directory. We also see there are two new files:

- [`views/register.ejs`](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-4/views/register.ejs)
- [`server/router/register.js`](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-4/server/router/register.js)

We will be using the [argon2 npm package](https://www.npmjs.com/package/argon2) to both hash our passwords upon registeration. We will also modify our newly updated (via the `part-4` git branch) to verify the provided password with any hashes stored in the DB.


### Instructions

1. Install the [argon2 npm package](https://www.npmjs.com/package/argon2)
1. In [`server/router/register.js` on line 51](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-4/server/router/register.js#L51) hash the password and call `db.addUser(newUser)` which if successful should redirect to `/login`
1. In [`server/router/login.js` on line 37](https://gitlab.com/york-u-fs1020-spring-2013/security/blob/part-4/server/router/login.js#L37) verify that the password provided matches the hash in our database
