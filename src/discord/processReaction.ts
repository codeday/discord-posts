/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { User, MessageReaction } from 'discord.js';
import config from '../config';
import uploadMessage from './uploadMessage';

const prisma = new PrismaClient();

export default async function processReaction(reaction: MessageReaction): Promise<void> {
  if (reaction.message.channel.id !== config.discord.channel) return;
  const message = await reaction.message.fetch();

  await uploadMessage(message);
  if ((await prisma.post.count({ where: { id: message.id } })) === 0) return;

  const reactedUsers = (await Promise.all(message.reactions.cache
    .map(async (e) => e.users.fetch())))
    .reduce((accum, users) => [...accum, ...users.values()], <User[]>[]);

  const reactedMembers = reactedUsers
    .map((user) => message?.guild?.member(user))
    .filter((u) => u);

  const hasAdminReacted = reactedMembers
    // eslint-disable-next-line no-underscore-dangle
    .reduce((accum, member) => accum || (<any>member)._roles.includes(config.discord.approverRole), false);

  console.log(`Updating ${message.id}, approved=${hasAdminReacted}`);
  await prisma.post.update({
    where: {
      id: message.id,
    },
    data: {
      approved: hasAdminReacted,
    },
  });
}
