/*jshint node:true*/
"use strict";

import configuredI18n from '@config/middleware/localization';

const i18n = configuredI18n();

let processDependentModules = (i18n, req, res) => {
    let userCountryCode = req.app.geolocation.userCountryCode;
    if( userCountryCode )
        i18n.setInitialLocaleByCountryCode(req, res, userCountryCode);
};

export default (req, res, next) => {
    i18n.init(req, res);

    processDependentModules(i18n, req, res);

    next();
};