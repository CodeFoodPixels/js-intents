const stopwords = require('./stopwords.json');

module.exports = class Intents {
    constructor(intents, confidence) {
        this.intents = intents;
        this.confidence = confidence;
    }

    rankIntents(message) {
        let scores = {
            total: 0,
            intents: []
        };

        message = this.normaliseWords(message).split(' ');

        this.intents.forEach((intent) => {
            const score = {
                intentId: intent.intentId,
                score: 0,
                confidence: 0
            };

            const multiplier = intent.keywords.reduce((multiplier, keyword) => {
                if (message.includes(this.normaliseWords(keyword))) {
                    return multiplier *= 2;
                }

                return multiplier;
            }, 1);

            intent.utterances.forEach((utterance) => {
                const utteranceWords = this.normaliseWords(utterance).split(` `);
                const stopwordCount = this.countStopwords(utterance);
                const wordScore = 100/(utteranceWords.length - (stopwordCount * 0.9));
                let utteranceMatchScore = 0;

                let messageCopy = message.slice(0);
                utteranceWords.forEach((utteranceWord) => {
                    const wordIndex = messageCopy.indexOf(utteranceWord);
                    if (wordIndex > -1) {
                        messageCopy = messageCopy.splice(0, wordIndex)
                        const wordMultiplier = stopwords.includes(utteranceWord) ? 0.1 : 1;
                        utteranceMatchScore += wordScore * wordMultiplier;
                    }
                });

                utteranceMatchScore *= multiplier;

                if (utteranceMatchScore > score.score) {
                    score.score = utteranceMatchScore;
                }
            });

            scores.intents.push(score);

            scores.total += score.score;
        });

        return scores.intents.map((score) => {
            score.confidence = score.score / scores.total;

            return score;
        }).filter((score) => {
            return score.confidence >= this.confidence;
        }).sort((a, b) => {
            return b.confidence - a.confidence;
        });
    }

    normaliseWords(message) {
        const punctuation = /[\'\`\"\’\‘\’\“\”\[\]\(\)\{\}\,\.\!\;\?\/\-\:\…]/g;

        return message.toLowerCase().replace(punctuation, '');
    }

    countStopwords(message) {
        const words = this.normaliseWords(message).split(` `);

        return words.reduce((i, word) => {
            if (stopwords.includes(word)) {
                return ++i;
            }

            return i;
        }, 0);
    }
}
