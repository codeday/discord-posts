import { Resolver, Query, Arg } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { Inject } from 'typedi';
import { Post } from './Post';

@Resolver(Post)
export class PostResolver {
  @Inject(() => PrismaClient)
  private readonly prisma : PrismaClient;

  @Query(() => [Post])
  async posts(
    @Arg('skip', { nullable: true }) skip?: number,
    @Arg('take', { nullable: true }) take?: number,
  ): Promise<Post[]> {
    return <Promise<Post[]>><unknown> this.prisma.post.findMany({
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
