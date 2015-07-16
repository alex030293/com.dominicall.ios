module.exports = {
    //Twilio
    twilio: {
        // Twilio Account SID - found on your dashboard
        accountSid: "ACba744ffca6127d57d7d6d1fb05746d06",
        // Twilio Auth Token - found on your dashboard
        authToken: "3f45ddfaafabec690ddb18d2270c46e8",
        // A Twilio number that you have purchased through the twilio.com web
        // interface or API
        twilioNumber: "34932200082"
    },

    //Parse
    Parse: {
        applicationID: "tzoWKMlfGOji0eSrC3h6cw5t6tEBsIOdZzYSkIwz",
        javaScriptKey: "kHG4w0YYUHN83q5TucyRC2sceNPkglUadqDjtWsD"
    },

    //White list
    whitelist: [
        "+34695562311",
        "+18299226595",
        "+34603847010",
        "+34609839964",
        "+34619413131",
        "+34646810736",
        "+34881928475",
        "+34981905883",
        "+34619096364",
        "+34603254093",
        "+34654435434",
        "+447928664097",
        "+34617996733",
        "+34620007868",
        "+34622815003",
        "+447783047504"
    ],

    // The port your web application will run on
    port: process.env.PORT || 3000
};