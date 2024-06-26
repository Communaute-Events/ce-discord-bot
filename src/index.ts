// Pre-run scripts
import '@core/globals';
import 'dotenv/config';

// File imports
import {ansi, logging} from '@core/utilities';
import {deployCommands, getCommands} from '@core/deploy-commands';
import {initEvents} from './core/events';
import {alert} from './alerts/hander';

// Imports
import {ActivityType, Client, Events, GatewayIntentBits} from 'discord.js';
import {WebSocket} from 'ws';
import fetch from 'cross-fetch';
import {getSources} from './commands/alerts/functions';

// Main
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
(async () => {
	client.commands = await getCommands();
})();

// function checkWs(ws: WebSocket) {
//     if (ws.readyState != WebSocket.OPEN) {
//         logging(`WebSocket connection has been established. The bot is operational.`,"success")
//     } else {
//         setTimeout(checkWs,500)
//     }
// }

let websockets: WebSocket[] = [];
let isReconnecting;

export let botInfo = {
	websocket: false,
	lastConexion: 0,
};

export function closeWebsockets() {
	websockets.forEach((ws) => {
		const url = ws.url;
		ws.terminate();
		logging(`Closed ws "${url}" at "${new Date().toISOString()}"`, 'minimal');
	});
	websockets = [];
}

export async function wsConnect(): Promise<WebSocket> {
	function wsError(error) {
		botInfo.websocket = false;
		if (isReconnecting) return;
		isReconnecting = true;
		logging(`WebSocket error, retrying to connect in 10 seconds.\n${error}: ${error.message}`, 'error');
		// Retry after 10 seconds
		setTimeout(wsConnect, 10000);
	}

	isReconnecting = false;
	try {
		const response = await fetch('https://raw.githubusercontent.com/Communaute-Events/paths/main/paths.json', {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
		});

		const res = await response.json();
		const ws = new WebSocket(res.websocket);

		// checkWs(ws)
		websockets.push(ws);

		ws.onmessage = (msg) => {
			try {
				const data = JSON.parse(msg.data.toString());
				if ('_type' in data && data._type === 'event') {
					alert(data, client);
				}
			} catch (error) {
				logging(`Error in ws:\n${error}`, 'error');
			}
		};

		ws.onclose = ({code, reason}) => {
			wsError({message: reason});
		};

		ws.onerror = (error) => {
			wsError(error);
		};

		ws.onopen = () => {
			logging(`WebSocket connection has been established. The bot is operational.`, 'success');
			botInfo.websocket = true;
			botInfo.lastConexion = Math.floor(new Date().getTime() / 1000);
		};
		return ws;
	} catch (error) {
		wsError({message: error});
	}
}

export async function reconnectWebsocket() {
	logging('Reconnecting to the WebSocket...', 'info');
	logging(`Closed all Websockets. (3 sec delay)`, 'info');
	closeWebsockets();
	await setTimeout(() => {}, 3000);
	logging('Re-establishing connection...', 'info');
	const ws = await wsConnect();
	logging(`Connection should be up. Current state: ${ws.readyState}`, `success`);
}

async function automaticWsRestart() {
	logging(`Automatically restarting websocket (10min interval)`, 'info');
	await reconnectWebsocket();
	logging(`Finished automated restarting function.`, 'success');
}

async function updateStatus(client: Client) {
	client.user.setPresence({
		activities: [
			{
				name: `${(await getSources()).length} évents pour ${client.guilds.cache.size} serveurs.`,
				type: ActivityType.Watching,
				url: 'https://commu.events/projects/events-helper',
			},
		],
		status: 'online',
	});
}

client.once(Events.ClientReady, async (c: Client) => {
	logging('Init. Client...', 'info');
	logging(ansi(`Logged in as %bold%${c.user.tag}%end%%light_green%!%end%`), 'success');
	logging(`Initalizing Events...`, 'info');
	await initEvents(c);
	logging(`Started deploying slash commands...`, 'info');
	await deployCommands();
	logging(`All slash commands have been deployed.`, 'success');
	logging(`Connecting to the Event Websocket`, 'info');
	await wsConnect();
	setInterval(automaticWsRestart, 600000);
	updateStatus(client);
	setInterval(() => {
		updateStatus(c);
	},60_000);
});

// Login, needs to be at the bottom
client.login(process.env.token);
