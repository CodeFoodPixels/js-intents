const Intents = require('./index.js');

const intents = [
    {
        "intentId": "WEATHER",
        "utterances": [
            "Weather",
            "Whats the weather like?",
            "Hows the weather looking?",
            "Whats the weather forecast",
            "whats the weather today"
        ],
        "keywords": [
            "Weather",
            "Forecast"
        ]
    },
    {
        "intentId": "NEWS",
        "utterances": [
            "News",
            "Today news",
            "Whats the top story?",
            "Whats the top news",
            "Whats going on today",
            "Whats going on"
        ],
        "keywords": [
            "News",
            "Story"
        ]
    },
    {
        "intentId": "GREETING",
        "utterances": [
            "Hello",
            "Hey",
            "Howdy",
            "Hello how are you?"
        ],
        "keywords": [
            "Hello",
            "Hey",
            "Howdy"
        ]
    }
];

const instance = new Intents(intents, 0);

console.log(instance.rankIntents("Whats going on in the news today"));
