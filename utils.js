function generateRandomNumber(length) {
    if (length <= 0) {
        throw new Error("Length must be a positive integer");
    }

    const min = 10 ** (length - 1);
    const max = (10 ** length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    generateRandomNumber
}