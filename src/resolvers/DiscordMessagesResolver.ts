import { Resolver, Query, Arg } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { Inject } from 'typedi';
import { DiscordMessage } from './DiscordMessage';

@Resolver(DiscordMessage)
export class PostResolver {
  @Inject(() => PrismaClient)
  private readonly prisma : PrismaClient;

  @Query(() => [DiscordMessage])
  async messages(
    @Arg('skip', { nullable: true }) skip?: number,
    @Arg('take', { nullable: true }) take?: number,
  ): Promise<DiscordMessage[]> {
    return <Promise<DiscordMessage[]>><unknown> this.prisma.post.findMany({
      skip,
      take: take || 25,
      orderBy: { createdAt: 'desc' },
      where: {
        approved: {
          equals: true,
        },
      },
    });
  }
}
