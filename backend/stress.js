module.exports = function () {
    const start = Date.now();
    while (Date.now() - start < 5000) Math.sqrt(Math.random());
    return "CPU spike created";
};
