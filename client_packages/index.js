mp.events.add("_createDynamicMarkersByParams", (params) => {
    mp.console.logInfo(`createDynamicMarkersByParams ${params.uniqName}`, true, true);
});

mp.events.add("_removeDynamicMarkersByUniqName", (uniqName) => {
    mp.console.logInfo(`removeDynamicMarkersByUniqName ${uniqName}`, true, true);
});
