# MEANingful Tweets

This is a Twitter clone developed as a MEAN stack application deployed to Google
Cloud. Check out the full
[Cloud Next video](https://cloud.withgoogle.com/next/catalog?session=BLD212#build)
which discusses this project, its architecture, and the most interesting aspects
of its design.

![Screenshot of the application in this repository. It is titled
"MEAN-ingful Tweets". There is a small form for creating new tweets with a list
of already posted tweets underneath. There are three tweets all from
"Devel without a Cause". The first one reads: "Howdy, World!" The second tweet
reads: "I like JavaScript *and* TypeScript." The final tweet reads: "🫵 You
matter. 🤜🤛"](demo.png)

## Developer Setup

To run the application locally, you need to install a few things:

*   [Node.js and NPM](https://nodejs.org/en/download/)
*   [MongoDB](https://www.mongodb.com/docs/manual/installation/)

To deploy to Google Cloud, you'll also need:

*   [`gcloud` CLI](https://cloud.google.com/sdk/docs/install)

Clone the repository and run `npm install` to install NPM dependencies.

The frontend Angular application code lives in
[`projects/frontend/`](/projects/frontend/). While the backend Express code lives
in [`projects/backend/`](/projects/backend/).

## Local Run

To run the application locally, we need to execute three commands in three
different terminals.

First, run `npm run frontend:dev` to start the Angular development server at
[`http://localhost:4200/`](http://localhost:4200/). This will live update with
any changes to your frontend Angular application.

Second, in another terminal, run `npm run backend:dev` to start the backend
Express API server on port 8000. This will also live update with any changes to
the backend server.

Third, in one more terminal, run `npm run database:dev` to start a local MongoDB
database on port 27017. Alternatively, you can run `mongod` directly, since that
is all the NPM script really does.

Once all three commands are running, visit
[`http://localhost:4200/`](http://localhost:4200/) and you should be able to see
the Angular frontend and post and view tweets!

## Deployment

To deploy the application to Google Cloud, follow these steps:

1.  Log in or make an account in
    [Google Cloud Console](https://console.cloud.google.com/).
1.  Create a new project named "MEANingful Tweets".
    *   Cloud Console will generate a slightly different project ID
        (such as `meaningful-tweets`), note this for later.
1.  Run `gcloud config set project "PROJECT_ID"` to configure the Google Cloud
    CLI to use this new project for future commands.
1.  Deploy the MongoDB database.
    1.  Visit [cloud.mongodb.com](https://cloud.mongodb.com/) and sign in or
        create an account.
    1.  Create an organization (or pick an existing one).
        *   Make sure the organization uses MongoDB Atlas, _not_ Cloud Manager.
    1.  Create a new project named "MEANingful Tweets".
    1.  Create a database.
        *   Free tier is fine.
        *   Host in Google Cloud in any region.
        *   Name the cluster "Tweets".
    1.  Create a user named `backend`.
        *   Generate a password and copy it for later.
    1.  Connect from "Cloud Environment".
        *   Enter `0.0.0.0/0` for the IP to allow access from anywhere.
    1.  Wait for the database to roll out and it is successfully deployed!
    1.  For later, open the database and click "Connect", then choose
        "Connect your application" and copy the connection string.
        *   Should look like:
            > mongodb+srv://backend:&lt;password&gt;@tweets.wyyvou8.mongodb.net/?retryWrites=true&w=majority
1.  Store the database connection string.
    1.  Open
        [Secret Manager](https://console.cloud.google.com/security/secret-manager)
    1.  Enable the API.
    1.  Create a secret.
        *   Name it `mongodb-prod-uri`.
        *   For the value, paste the MongoDB connection string from step 4.8.
            Also replace `<password>` with the MongoDB `backend` account
            password from step 4.5.
1.  Deploy the backend server.
    1.  Run `npm run backend:deploy`.
        *   Accept all the prompts to enable required Google Cloud APIs.
        *   This deployment will fail because we need to set a couple options in
            the service definition.
    1.  Open the [Cloud Run dashboard](https://console.cloud.google.com/run),
        pick the `backend` service, and click on "Edit & Deploy New Revision".
    1.  Add `backend:prod` as a "container argument" which will tell the service
        to run the _backend_ server from our monorepo.
    1.  Click "Reference a Secret".
        *   Choose the `mongodb-prod-uri` secret.
        *   Grant permission for the `backend` service to access this secret.
        *   For "reference method", choose to expose as an environment variable.
        *   Name the environment variable `MONGO_DB_URI`.
    1.  Deploy the revision.
        *   This should now succeed.
    1.  Copy the service URL at the top of the `backend` service details page
        in Cloud Run.
        *   Should look like: `https://backend-abcd123xyz-uw.a.run.app`.
1.  Deploy the frontend server.
    1.  Open the
        [`environment.prod.ts`](/projects/frontend/src/environments/environment.prod.ts)
        file and update the `backendOrigin` property to the backend service URL
        copied from step 6.6.
    1.  Run `npm run frontend:deploy`.
        *   Accept all the prompts to enable required Google Cloud APIs.
        *   This deployment will fail because we need to set a couple options in
            the service definition.
    1.  Open the [Cloud Run dashboard](https://console.cloud.google.com/run),
        pick the `frontend` service, and click on "Edit & Deploy New Revision".
    1.  Add `frontend:prod` as a "container argument" which will tell the
        service to run the _frontend_ server from our monorepo.
    1.  Under "Capacity", set "Memory" to at least 2GB.
    1.  Consider setting "minimum instances" to `1` to reduce cold start
        friction while getting the deployment started.
    1.  Deploy the revision.
        *   This should now succeed.
1.  Test the application.
    1.  Open the service URL at the top of the `frontend` service details page
        in Cloud Run.
    1.  Post and view tweets in the production cloud environment.
    1.  Congratulations! You've deployed MEANingful Tweets to Google Cloud!

Future changes to the frontend codebase can be deployed via the
`npm run frontend:deploy` command, while future changes to the backend codebase
can be deployed via the `npm run backend:deploy` command.
