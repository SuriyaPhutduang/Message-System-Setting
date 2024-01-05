const express = require("express");
const router = express.Router();
const ProviderController = require("../controllers/providerController");
const ChannelController = require("../controllers/channelController");
const TypeController = require("../controllers/typeController");
const TemplateController = require("../controllers/templateController");



// test route
router.get("/", (req, res) => {
  res.json({ msg: "Hello World", status: 200 }), console.log("Hello World");
});


// provider
router.get("/providers", ProviderController.getProviders);
router.get("/provider", ProviderController.getProvider);
router.post("/provider", ProviderController.createProvider);
router.patch("/provider", ProviderController.updateProvider);
router.delete("/provider", ProviderController.deleteProvider);

// channel
router.get("/channels", ChannelController.getAllChannel);
router.get("/channel", ChannelController.getChannel);
router.post("/channel", ChannelController.createChannel);
router.patch("/channel", ChannelController.updateChannel);
router.delete("/channel", ChannelController.deleteChannel);

// type
router.get("/types", TypeController.getAllType);
router.get("/type", TypeController.getType);
router.post("/type", TypeController.createType);
router.patch("/type", TypeController.updateType);
router.delete("/type", TypeController.deleteType);

// template
router.get("/templates", TemplateController.getAllTemplate);
router.get("/template", TemplateController.getTemplate);
router.post("/template", TemplateController.createTemplate);
router.patch("/template", TemplateController.updateTemplate);
router.delete("/template", TemplateController.deleteTemplate);

module.exports = router;
