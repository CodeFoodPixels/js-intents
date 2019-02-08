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

        message = message.toLowerCase();

        this.intents.forEach((intent) => {
            const score = {
                intentId: intent.intentId,
                score: 0,
                confidence: 0
            };

            const multiplier = intent.keywords.reduce((multiplier, keyword) => {
                if (message.includes(keyword.toLowerCase())) {
                    return multiplier *= 2;
                }

                return multiplier;
            }, 1);

            intent.utterances.forEach((utterance) => {
                const words = utterance.toLowerCase().split(` `);
                const wordScore = 100/words.length;

                let utteranceMatchScore = 0;

                words.forEach((word) => {
                    if (message.includes(word)) {
                        utteranceMatchScore += wordScore;
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
}
