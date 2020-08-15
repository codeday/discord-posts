import { Client as Discord } from 'discord.js';
import { uploadMessage, processReaction } from './discord';
import config from './config';

export default function Bot(): void {
  const discord = new Discord({ partials: ['MESSAGE', 'REACTION'] });

  discord.on('message', (message) => {
    try {
      uploadMessage(message);
    } catch (ex) {
      console.error(ex);
    }
  });
  discord.on('messageReactionAdd', (reaction) => {
    try {
      processReaction(reaction);
    } catch (ex) {
      console.error(ex);
    }
  });
  discord.on('messageReactionRemove', (reaction) => {
    try {
      processReaction(reaction);
    } catch (ex) {
      console.error(ex);
    }
  });

  // eslint-disable-next-line no-console
  discord.on('ready', () : void => console.log('listening on discord'));
  discord.login(config.discord.botToken);
}
