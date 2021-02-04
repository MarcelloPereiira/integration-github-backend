## Integration with Github serving as a proxy

An app that implements "Integration with GitHub serving as a proxy" functionality in Nodejs

### Usage and Setup
- Clone this repo. Go into the root folder and run *yarn* to install the dependencies.
- Create a .env file in the root folder and set these variables: 
  ```
  CLIENT_ID=Your Client ID from Github
  CLIENT_SECRET=Your Client Secret from Github
  REDIRECT_URI=http://localhost:3000/login
  ```

- Run *yarn dev* to start the app development
- Run *yarn start* to start the app production