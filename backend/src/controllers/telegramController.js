const Contact = require("../models/Contact");
const sendTelegramAlert = require("../utils/telegram");

const telegramWebhook = async (req, res) => {
  try {
    // Verify that webhook request has our secret
    const webhookSecret = req.get("X-Telegram-Bot-Api-Secret-Token");

    if (
      !process.env.TELEGRAM_WEBHOOK_SECRET ||
      webhookSecret !== process.env.TELEGRAM_WEBHOOK_SECRET
    ) {
      return res.status(401).json({
        message: "Unauthorized webhook request",
      });
    }

    const message = req.body?.message;

    // Ignore updates that are not messages
    if (!message?.text || !message?.chat?.id) {
      return res.sendStatus(200);
    }

    // Only link private Telegram users
    if (message.chat.type !== "private") {
      return res.sendStatus(200);
    }

    const text = message.text.trim();

    const match = text.match(/^\/start(?:@\w+)?(?:\s+([A-Za-z0-9_-]{1,64}))?$/);

    if (!match) {
      return res.sendStatus(200);
    }

    const token = match[1];

    // Normal /start without SafeRide token
    if (!token) {
      await sendTelegramAlert(
        String(message.chat.id),
        "Welcome to SafeRide AI. Please use the Telegram connection link generated from your SafeRide emergency contact.",
      );

      return res.sendStatus(200);
    }

    // Find valid contact connection request
    const contact = await Contact.findOne({
      telegramLinkToken: token,
      telegramLinkExpiresAt: {
        $gt: new Date(),
      },
    });

    if (!contact) {
      await sendTelegramAlert(
        String(message.chat.id),
        "This SafeRide AI Telegram connection link is invalid or expired. Please request a new link.",
      );

      return res.sendStatus(200);
    }

    // Save Telegram Chat ID automatically
    contact.telegramChatId = String(message.chat.id);
    contact.telegramLinkedAt = new Date();

    // Make token single-use
    contact.telegramLinkToken = null;
    contact.telegramLinkExpiresAt = null;

    await contact.save();

    await sendTelegramAlert(
      String(message.chat.id),
      `✅ Telegram Connected Successfully!\n\nYou are now connected as an emergency contact for ${contact.name} in SafeRide AI. Emergency SOS alerts can now be delivered to this Telegram account.`,
    );

    console.log("Telegram linked successfully:", contact._id.toString());

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.error("Telegram Webhook Error:", error.message);

    // Non-2xx response makes Telegram retry the update
    return res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  telegramWebhook,
};
