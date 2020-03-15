module.exports = function override(config, env) {
    config.target = 'electron-renderer';
    config.externals = {
        '@journeyapps/sqlcipher': 'commonjs @journeyapps/sqlcipher'
    };
    return config;
};
