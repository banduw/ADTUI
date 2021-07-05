const express = require("express");
const got = require('got');

function routerDeviceManagement(){
    this.router = express.Router();
    this.useRoute("changeModelIoTSettings","isPost")
    this.useRoute("provisionIoTDeviceTwin","isPost")
    this.useRoute("deprovisionIoTDeviceTwin","isPost")
}

routerDeviceManagement.prototype.useRoute=function(routeStr,isPost){
    this.router[(isPost)?"post":"get"]("/"+routeStr,(req,res)=>{
        this[routeStr](req,res)
    })
}

routerDeviceManagement.prototype.provisionIoTDeviceTwin = async function(req,res){
    //TODO:
}

routerDeviceManagement.prototype.deprovisionIoTDeviceTwin = async function(req,res){
    //TODO:
}

routerDeviceManagement.prototype._provisionIoTDeviceTwin = async function(twinUUID,tags,desiredInDeviceTwin,accountID){
    try{
        var provisionDevicePayload={"deviceID":twinUUID,"tags":tags,"desiredProperties":desiredInDeviceTwin}
        await got.post(process.env.iothuboperationAPIURL+"controlPlane/provisionDevice", {json:provisionDevicePayload,responseType: 'json'});

        var postLoad={account:accountID,twinID:twinUUID,updateInfo:JSON.stringify({"IoTDeviceID":twinUUID})}
        var {body} = await got.post(process.env.dboperationAPIURL+"insertData/updateTwin", {json:postLoad,responseType: 'json'});
        return body
    }catch(e){
        console.error("IoT device provisioning fails: "+ twinUUID)
    }
}

routerDeviceManagement.prototype._deprovisionIoTDeviceTwin = async function(twinUUID,accountID){
    try{
        var deprovisionDevicePayload={"deviceID":twinUUID}
        await got.post(process.env.iothuboperationAPIURL+"controlPlane/deprovisionDevice", {json:deprovisionDevicePayload,responseType: 'json'});
    }catch(e){

    }
    try{
        var postLoad={account:accountID,twinID:twinUUID,updateInfo:JSON.stringify({"IoTDeviceID":null})}
        var {body} = await got.post(process.env.dboperationAPIURL+"insertData/updateTwin", {json:postLoad,responseType: 'json'});
        return body
    }catch(e){
        console.error("IoT device deprovisioning fails: "+ twinUUID)
    }
}


routerDeviceManagement.prototype.changeModelIoTSettings = async function(req,res){
    var postLoad=req.body;
    var accountID=req.authInfo.account
    postLoad.account=accountID
    


    try{
        var {body} = await got.post(process.env.dboperationAPIURL+"insertData/updateModel", {json:postLoad,responseType: 'json'});
    }catch(e){
        res.status(e.response.statusCode).send(e.response.body);
        return;
    }

    var updatedModelDoc=body.updatedModelDoc;
    var twins= body.twins //[{id:..,IoTDeviceID:...,displayName:...}...]
    var returnDBTwins=[]
    
    if(updatedModelDoc.isIoTDeviceModel){
        //provision each device to iot hub
        for(var i=0;i<twins.length;i++){
            var aTwin=twins[i]
            var iotTwinID= aTwin.IoTDeviceID
            if(iotTwinID!=null && iotTwinID!="") {
                return; //the twin has been provisioned to iot hub
            }
            var twinDisplayName=aTwin.displayName
            var twinID= aTwin.id;
            var iotDeviceTags={
                "app":"azureiotrocks",
                "twinName":twinDisplayName,
                "owner":accountID,
                "modelID":updatedModelDoc.id
            }
            try{
                var provisionedTwinDoc = await this._provisionIoTDeviceTwin(twinID,iotDeviceTags,req.body.desiredInDeviceTwin,accountID)
                returnDBTwins.push(provisionedTwinDoc)
            }catch(e){
                console.error(e.response.body)
            }
        }
    }else{
        //deprovision each device off iot hub
        for(var i=0;i<twins.length;i++){
            var aTwin=twins[i]
            var iotTwinID= aTwin.IoTDeviceID
            if(iotTwinID==null || iotTwinID=="") {
                return; //the twin has been deprovisioned off iot hub
            }
            try{
                var deprovisionedTwinDoc = await this._deprovisionIoTDeviceTwin(aTwin.id,accountID)
                returnDBTwins.push(deprovisionedTwinDoc)
            }catch(e){
                console.error(e.response.body)
            }
        }
    }
    res.send({"updatedModelDoc":updatedModelDoc,"DBTwins":returnDBTwins})
}


module.exports = new routerDeviceManagement().router