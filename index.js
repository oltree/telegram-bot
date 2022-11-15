const TelegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

const token = "5666313152:AAHRmbJj9VSFOZELp3y6Or28-IOl0npoyQE";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);

  chats[chatId] = randomNumber;

  console.log(chats);

  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`,
    gameOptions
  );
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра отгадай цифру" },
  ]);

  bot.on("message", async (message) => {
    const text = message.text;

    const chatId = message.chat.id;

    if (text === "/start") {
      await bot.sendMessage(chatId, `Добро пожаловать в телеграм бот!`);

      return bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${message.from.first_name} ${message.from.last_name}!`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`);
  });

  bot.on("callback_query", async (message) => {
    const data = message.data;

    const chatId = message.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (Number(data) === chats[chatId]) {
      return bot.sendMessage(chatId, `Ты отгадал! Молодец!`, againOptions);
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не отгадал, я загадал цифру ${chats[chatId]}).`,
        againOptions
      );
    }
  });
};

start();
