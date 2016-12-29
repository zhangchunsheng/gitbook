const Promise = require('../utils/promise');

const validateConfig = require('./validateConfig');
const CONFIG_FILES = require('../constants/configFiles');

/**
    Parse configuration from "book.json" or "book.js"

    @param {Book} book
    @return {Promise<Book>}
*/
function parseConfig(book) {
    const fs = book.getFS();
    let config = book.getConfig();

    return Promise.some(CONFIG_FILES, function(filename) {
        // Is this file ignored?
        if (book.isFileIgnored(filename)) {
            return;
        }

        // Try loading it
        return fs.loadAsObject(filename)
        .then(function(cfg) {
            return fs.statFile(filename)
            .then(function(file) {
                return {
                    file,
                    values: cfg
                };
            });
        })
        .fail(function(err) {
            if (err.code != 'MODULE_NOT_FOUND') throw (err);
            else return Promise(false);
        });
    })

    .then(function(result) {
        let values = result ? result.values : {};
        values = validateConfig(values);

        // Set the file
        if (result.file) {
            config = config.setFile(result.file);
        }

        // Merge with old values
        config = config.mergeValues(values);

        return book.setConfig(config);
    });
}

module.exports = parseConfig;
