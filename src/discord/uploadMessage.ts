/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import Uploader from '@codeday/uploader-node';
import fetch from 'node-fetch';
import { Message } from 'discord.js';
import config from '../config';

const MAX_SIZE = 1024 * 1024 * 25;
const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
const VIDEO_TYPES = ['mp4', 'mov', 'webm'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

const prisma = new PrismaClient();
const upload = new Uploader(<string>config.uploader.base);

export default async function uploadMessage(message: Message): Promise<void> {
  const {
    id, author: { id: userId }, channel: { id: channelId }, content, attachments, createdAt,
  } = message;

  // If this already exists, return.
  if ((await prisma.post.count({ where: { id } })) > 0) return;

  const attachment = attachments
    .filter((a) => ALLOWED_TYPES.includes(a.url.split('.').pop() || '') && a.size <= MAX_SIZE)
    .first();
  if (!attachment || channelId !== config.discord.channel) return;

  const attachmentFileName = <string>attachment.url.split('/').pop();
  const attachmentFile = typeof attachment.attachment === 'string'
    ? await (await fetch(attachment.attachment)).buffer()
    : attachment.attachment;

  console.log(`Mirroring message ${id} from user ${userId}...`);

  let videoUrl = null;
  let imageUrl;
  if (VIDEO_TYPES.includes(<string>attachment.url.split('.').pop())) {
    ({ stream: videoUrl, image: imageUrl } = await upload.video(<Buffer>attachmentFile, attachmentFileName));
  } else {
    ({ url: imageUrl } = await upload.image(<Buffer>attachmentFile, attachmentFileName));
  }

  console.log(` ... saving to database.`);

  await prisma.post.create({
    data: {
      id,
      userId,
      text: content,
      createdAt,
      videoUrl,
      imageUrl,
    },
  });
}
