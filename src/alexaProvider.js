const commands = [
    'Alexa, show me pictures of cats.',
    'Alexa, show me the trailer for \'It\'.',
    'Alexa set a sleep timer for 45 minutes',
    'Alexa, what\'s on my calendar for tomorrow?',
    'Alexa, good morning.',
    'Alexa, beam me up.',
    'Alexa, show me the money.',
    'Alexa, surely you can\'t be serious.',
    'Alexa, party time!',
];

module.exports.getRandomCommand = function () {
    return commands[Math.floor(Math.random() * commands.length)];
};


