const express = require("express");
const cosmosdbhelper = require('./cosmosdbhelper')

function routerDeleteData(){
    this.router = express.Router();
    this.useRoute("deleteModel","post")
    this.useRoute("deleteTopologySchema","post")
    this.useRoute("deleteTwins","post")
}

routerDeleteData.prototype.useRoute=function(routeStr,isPost){
    this.router[(isPost)?"post":"get"]("/"+routeStr,(req,res)=>{
        this[routeStr](req,res)
    })
}

routerDeleteData.prototype.deleteModel =async function(req,res) {
    var projectID=req.body.projectID
    var modelID=req.body.model

    try {
        await cosmosdbhelper.deleteRecord("dtproject",projectID,modelID)
        res.end()
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
}

routerDeleteData.prototype.deleteTwins =async function(req,res) {
    var projectID=req.body.projectID
    var twinIDs=req.body.arr
    var promiseArr=[]
    twinIDs.forEach(oneTwinID=>{
        promiseArr.push(cosmosdbhelper.deleteRecord("dtproject",projectID,oneTwinID))
    })

    try{
        var results=await Promise.allSettled(promiseArr);
        var succeedList=[]
        results.forEach((oneSet,index)=>{
            if(oneSet.status=="fulfilled") {
                succeedList.push(twinIDs[index]) 
            }
        })
        res.send(succeedList)
    }catch(e){
        res.status(400).send(e.message);
    }
}



routerDeleteData.prototype.deleteTopologySchema =async function(req,res) {
    var accountID=req.body.account
    var projectID=req.body.projectID
    var topologyName=req.body.layoutName

    try {
        await cosmosdbhelper.deleteRecord("appuser",accountID,"TopoSchema."+projectID+"."+topologyName)
        res.end()
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
}





module.exports = new routerDeleteData().router