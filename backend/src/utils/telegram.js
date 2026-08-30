// const axios = require("axios");

// const BOT_TOKEN = process.env.BOT_TOKEN;

// const sendTelegramAlert = async (chatId, message) => {
//   try {
//     const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

//     const response = await axios.post(
//       url,
//       {
//         chat_id: chatId,
//         text: message,
//       },
//       {
//         timeout: 15000,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     console.log("Telegram Alert Sent Successfully");
//     console.log(response.data);

//     return response.data;
//   } catch (error) {
//     console.log("Message:", error.message);
//   }
// };

// module.exports = sendTelegramAlert;

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;

const sendTelegramAlert = async (chatId, message) => {
  try {
    console.log("Sending Telegram to Chat ID:", chatId);
    console.log("BOT TOKEN EXISTS:", !!BOT_TOKEN);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await axios.post(
      url,
      {
        chat_id: chatId,
        text: message,
      },
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Telegram Alert Sent Successfully");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log("Telegram Error:", error.response?.data || error.message);
  }
};

module.exports = sendTelegramAlert;
