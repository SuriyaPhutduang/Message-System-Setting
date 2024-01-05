const mongoose = require("mongoose");
const Type = require("../models/typeModel");
const Channel = require("../models/channelModel");
const Template = require("../models/templateModel");

exports.getAllType = async (req, res) => {
  try {
    const msgType = await Type.find();
    res.json({ message: "success", status: 200, result: msgType });
  } catch (error) {
    res.json({ message: "failed", status: 201, result: [] });
  }
};

exports.getType = async (req, res) => {
  if (req.query.id == null || req.query.id == "") {
    res.json({ message: "invalid parameter.", status: 102 });
  } else {
    try {
      const msgType = await Type.findById(req.query.id);
      if (msgType == null) {
        res.json({ message: "success", status: 200, result: [] });
      } else {
        res.json({ message: "success", status: 200, result: msgType });
      }
    } catch (err) {
      res.json({ message: "failed", status: 201 });
    }
  }
};

exports.createType = async (req, res) => {
  try {
    if (
      req.body.name == null ||
      req.body.name == "" ||
      req.body.msgChannelId == null ||
      req.body.msgChannelId == "" ||
      req.body.status == null ||
      req.body.status == ""
    ) {
      res.json({ message: "invalid parameter.", status: 102 });
    } else {
      const channel = await Channel.findById(req.body.msgChannelId);
      if (channel == null || channel == "") {
        res.json({ message: "Wrong data type.", status: 103 });
      } else {
        const msgType = new Type(req.body);
        msgType._id = new mongoose.Types.ObjectId();
        await msgType.save();
        res.json({ message: "success", status: 200 });
      }
    }
  } catch (error) {
    if (error.code == 11000) {
      res.json({ message: "duplicata data", status: 202 });
    } else {
      res.json({ message: "failed", status: 201 });
    }
  }
};

exports.updateType = async (req, res) => {
  try {
    if (
      req.body.name == null ||
      req.body.name == "" ||
      req.body.msgChannelId == null ||
      req.body.msgChannelId == "" ||
      req.body.status == null ||
      req.body.status == ""
    ) {
      res.json({ message: "invalid parameter.", status: 102 });
    } else {
      if (!mongoose.Types.ObjectId.isValid(req.query.id) || !mongoose.Types.ObjectId.isValid(req.body.msgChannelId)) {
        res.json({ message: "Wrong data type.", status: 103 });
      } else {
        const msgType = await Type.findById(req.query.id);
        if (msgType == null) {
          res.json({ message: "Wrong data type.", status: 103 });
        } else {
          if(req.body.name){
            msgType.name = req.body.name;
          }
          if(req.body.desc){
            msgType.desc = req.body.desc;
          }else{
            msgType.desc = "";
          }
          if(req.body.msgChannelId){
            msgType.msgChannelId = req.body.msgChannelId;
          }
          if(req.body.status){
            msgType.status = req.body.status;
          }

          await msgType.save();
          res.json({ message: "success", status: 200 });
        }
      }
    }
  } catch (error) {
    res.json({ message: "failed", status: 201 });
  }
};

exports.deleteType = async (req, res) => {
  try {
    // const PK = await Template.find({ messageTypeId: req.query.id });
    // if (PK.length > 0) {
    //   res.json({ message: "invalid parameter.", status: 102 });
    // } else {
    if (req.query.id == null || req.query.id == "") {
      res.json({ message: "Wrong data type.", status: 103 });
    } else {
      const msgType = await Type.findById(req.query.id);
      if (msgType.status == "inactive") {
        res.json({ message: "failed", status: 201 });
      } else {
        msgType.status = "inactive";
        await msgType.save();
        res.json({ message: "success", status: 200 });
      }
    }
    // }
  } catch (error) {
    res.json({ message: "failed", status: 201 });
  }
};
