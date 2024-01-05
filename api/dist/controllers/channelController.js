const mongoose = require("mongoose");
const Channel = require("../models/channelModel");
const Provider = require("../models/providerModel");
const Type = require("../models/typeModel");
const loadash = require("lodash");
exports.getAllChannel = async (req, res) => {
  try {
    const channels = await Channel.aggregate([{
      $lookup: {
        from: "provider",
        localField: "providerId",
        foreignField: "_id",
        as: "provider_data"
      }
    }, {
      $project: {
        _id: 1,
        name: 1,
        desc: 1,
        providerData: "$provider_data",
        status: 1
      }
    }]);
    res.json({
      message: "success",
      status: 200,
      result: channels
    });
  } catch (error) {
    res.json({
      message: error.message,
      result: [],
      status: 500
    });
  }
};
exports.getChannel = async (req, res) => {
  try {
    if (req.query.id == null || req.query.id == "") {
      res.json({
        message: "invalid parameter.",
        status: 102,
        result: []
      });
    } else {
      const channel = await Channel.aggregate([{
        $match: {
          _id: new mongoose.Types.ObjectId(req.query.id)
        }
      }, {
        $lookup: {
          from: "provider",
          localField: "providerId",
          foreignField: "_id",
          as: "providerData"
        }
      }, {
        $project: {
          _id: 1,
          name: 1,
          desc: 1,
          providerData: "$providerData",
          status: 1
        }
      }]);
      if (channel.length == 0) {
        res.json({
          message: "success",
          status: 200,
          result: []
        });
      } else {
        res.json({
          message: "success",
          status: 200,
          result: channel[0]
        });
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
      result: [],
      status: 200
    });
  }
};
exports.createChannel = async (req, res) => {
  try {
    if (req.body.name == null || req.body.name == "" || req.body.providerId == null || req.body.providerId == "" || req.body.status == null || req.body.status == "") {
      res.json({
        message: "invalid parameter.",
        status: 102
      });
    } else {
      const channel = new Channel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        desc: req.body.desc,
        providerId: [],
        status: req.body.status
      });
      const provider = loadash.uniq(req.body.providerId);
      provider.forEach(id => {
        channel.providerId.push(new mongoose.Types.ObjectId(id));
      });
      console.log(channel.providerId);
      await channel.save();
      res.json({
        message: "success",
        status: 200
      });
    }
  } catch (error) {
    if (error.code == 11000) {
      res.json({
        message: "duplicata data",
        status: 202
      });
    } else {
      res.json({
        message: error.message,
        status: 500
      });
    }
  }
};
exports.updateChannel = async (req, res) => {
  try {
    if (req.body.name == null || req.body.name == "" || req.body.providerId == null || req.body.providerId == "" || req.body.status == null || req.body.status == "") {
      res.json({
        message: "invalid parameter.",
        status: 102
      });
    } else {
      let channel = await Channel.findById(req.query.id);
      if (req.body.name) {
        channel.name = req.body.name;
      }
      if (req.body.desc) {
        channel.desc = req.body.desc;
      }
      if (req.body.providerId) {
        const provider = loadash.uniq(req.body.providerId);
        channel.providerId = [];
        provider.forEach(id => {
          channel.providerId.push(new mongoose.Types.ObjectId(id));
        });
      }
      if (req.body.status) {
        channel.status = req.body.status;
      }
      await channel.save();
      res.json({
        message: "success",
        status: 200
      });
    }
  } catch (error) {
    if (error.code == 11000) {
      res.json({
        message: "duplicata data",
        status: 202
      });
    } else {
      res.json({
        message: "failed",
        status: 201
      });
    }
  }
};
exports.deleteChannel = async (req, res) => {
  try {
    const PK = await Type.find({
      msgChannelId: req.query.id
    });
    if (PK.length > 0) {
      res.json({
        message: "Wrong data type.",
        status: 103
      });
    } else {
      const channel = await Channel.findById(req.query.id);
      if (channel.status == 'inactive') {
        res.json({
          message: "failed",
          status: 201
        });
      } else {
        channel.status = 'inactive';
        await channel.save();
        res.json({
          message: "success",
          status: 200
        });
      }
    }
  } catch (error) {
    res.json({
      message: "failed",
      status: 201
    });
  }
};