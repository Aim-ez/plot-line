# Running Backend

## Install Packages
In the login_server folder in your terminal, run:

npm install

This should install all necessary packages for the backend in your local repository. I recommend you run the same in the plot-line folder, to ensure you have all the new packages required there. 

## Edit IP Address Information
Unfortunately you'll have to do this anytime you'll be on a new IP address, since we can no longer test in the web view (due to react-navigation apparently not working well with web). This is because when you connect to the tunnel with your Expo Go app, you can't use 'localhost' to connect to the DB, as it's hosted on a different machine. 

So, edit the following lines with your computer's IP address:

### Within server.jsx
...
const corsOptions = {
    origin: ['http://<COMPUTER_IP_ADDRESS>:3000', 'https://<ADDRESS_OF_EXPO_SERVER>'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}
...

### Within screens/Signup.jsx   AND   screens/Login.jsx
...
const url = "http://<COMPUTER_IP_ADDRESS>:3000/user/signup" // CHANGE IF IP ADDRESS CHANGES
...

### Add your IP address to the Mongo database
1) Login into MongoDB in the web (I will give you password)
2) Click 'Browse Collections' in Cluster 0
3) Go to 'Network Access'
4) Click 'Add Current IP Address'
5) Should be good to go!

### Firewall (Potentially)
I believe that's the only things you'll have to change.

If this isn't working, check that your firewall allows requests to port 3000. Not sure how to do this on windows, but it was pretty easy on Linux, so hopefully it's not too bad if required. 

## Run the Backend Server
Still within login_server, run:

nodemon server.jsx

This should launch the mongodb database so that you're able to make calls to it. You will see the message "DB Connected", if this was successful. 

## Run the Frontend Expo App
npx expo start --tunnel

npm rebuild bcrypt --build-from-source


And you should be good to go!
