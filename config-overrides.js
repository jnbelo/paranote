module.exports = function override(config, env) {
    config.target = 'electron-renderer';
    config.externals = {
        '@journeyapps/sqlcipher': 'commonjs @journeyapps/sqlcipher',
        sequelize: 'commonjs sequelize'
    };
    return config;
};
