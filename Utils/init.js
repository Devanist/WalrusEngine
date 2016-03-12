define([
    "WalrusEngine/Utils/modules/isTouchDevice",
    "WalrusEngine/Utils/modules/SCEvent"
    ], function(isTouchDevice, SCEvent){

    var Utils = {
        
        isTouchDevice : isTouchDevice,
        SCEvent : SCEvent
        
    };

    return Utils;
});