# WebSocket user specific messages

## Setup

1. Run `npm install` from inside the **client** directory, followed by `npm start`.
2. Run `npm install` from inside the **server** directory, followed by `npm start`.

## How to use

1. Open up `http://localhost:7000`, then fill in your name and press `Start`.
2. Open another tab at the address `http://localhost:7000/agent`, then click `Send greet` to session you created in step 1.
3. Open another tab at `http://localhost:7000`, but this time enter a different name (only required for proof), then click `Start`.
4. Go to the agent tab and refresh the page.
5. You should see another session has been created. Send a greeting to the new session, and notice that the first tab doesn't receive the alert.

## Disclaimer

None of this code is production ready, and has been created for demonstrative purposes only.