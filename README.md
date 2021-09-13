# Course Crush

An ecommerce platform built to democratize online learning, built using Node.js, Express, MongoDB and Ejs templating engine.

## Installation

1. Clone the repo
2. Open the directory
3. `npm install`

## Provide the environment variables

Create a file called `config.env` in the config directory and provide the following values

```
MONGO_URI=<your database URI>

PORT=<port number>

EMAIL=<email id used for sending emails>
PWD=<password of the above email-id>

RAZ_ID=<razorpay id>
RAZ_SEC=<razorpay secret>
```

## Other Setup

1. Create a folder called data and add a file called `testTemplate.pdf` which is your certificate generation template

2. Videos go inside a folder called `video` with their names being their mongoDB ObjectID

3. Discount codes can be created by creating a file called `discountcodes.json` with the following format

```
[
    {
    "code":"<coupon code>",
    "disPercent":"<discount in percent without the sign>",
    "maxValue":"<max discount value in rupees>"
    },
    {
        ...
    }
]

```

## Running the server

Open up your console and type `npm start` then open up a browser and navigate to `localhost:3000` or `localhost:<port number>` as per config

## Links

Demo video - https://drive.google.com/file/d/1Z-z4h1RlJN4enGcsTvwDW2Za4_Nn6IWT/view?usp=sharing
Presentation - https://drive.google.com/file/d/1B0NZEURp5X5OcRFc4_vJ_GQuwUiXetz6/view?usp=sharing
Postman Docs - https://documenter.getpostman.com/view/15044944/U16nK43R
