# Event Helper (ce-discord-bot)

This is a bot which is able to notify users when an annoucement is made in a Discord server. It is codded with DiscordJS.

## Commands and documentation

You can visit the documentation at https://docs.commu.events/events-helper

## Features

- Sending alerts in a configured channel when an event is detected
- Choose which events should be listened to
- Define a role to ping for each event source
- Enabling/Disabling alerts
...and more coming soon!

## Using the bot

You can either invite the bot at https://commu.events/projects/events-helper or selfhost it yourself!

### Selfhosting

To selfhost the bot, you will need multiple things.
1. The [ce-event-monitor](https://github.com/Communaute-Events/ce-event-monitor) websocket
2. A MongoDB Database (free)
3. Somewhere to host the bot (I recommend https://railway.app, the free trial is very long and after that it's very cheap)

First, download and host **ce-event-monitor** according to the instructions on the repo (do NOT host it on railway, as selfbots are against the TOS)
You can also use our hosted websocket (the ip is in this [paths.json](https://github.com/Communaute-Events/paths/blob/main/paths.json) file).

Then, create a MongoDB account and follow the instructions for a basic free database. You then need to copy your **MongoURI** to connect to the database.

Now, once the **ce-event-monitor** websocket is up-and-running, and that you have created your MongoDB database, you can clone the repository on your machine and then run:
```
npm install
npm run start
```

This will create a .env file, that you need to fill with the correct informations (bot token, clientid, mongoURI, etc...)
Your bot should now be running!

### Changing the name and color

You can easily change the color of the embeds by going in `config/bot/info.yml` and changing the values.

## Contributing

This repo is open to contribution! If you have a suggestion, join [our discord](https://commu.events/discord)!