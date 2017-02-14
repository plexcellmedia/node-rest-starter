# Node REST Starter Template With JWT Authentication
Build REST application quickly with this pre-configured starter template. 

## Instructions
* Clone repo
* Run "npm install --save"
* Enter encryption key and mongodb connection string at root/config.js
* Run "node server"
* DONE!

## What is included?
This REST application includes basic CRUD and authentication example using JSON Web Token (JWT).

## Routes
| URL               | Method | Required                                       | Description                                                    |
|-------------------|--------|------------------------------------------------|----------------------------------------------------------------|
| /setup            | GET    |                                                | Inserts test user to database. Username: user, password: pass  |
| /api/authenticate | POST   | username, password                             | Returns encrypted token to make API calls to protected routes. |
| /api/users        | GET    | token                                          | Returns all users in database.                                 |
| /api/user         | POST   | token, firstname, lastname, username, password | Insert user to database.                                       |
| /api/user/:id     | PUT    | token, firstname, lastname, username, password | Update user by user id.                                        |
| /api/user/:id     | DELETE | token                                          | Delete user by user id.                                        |

## Optional
Visit URL/setup to add test user.

## License
GPL-3.0 - see LICENSE file for details.
