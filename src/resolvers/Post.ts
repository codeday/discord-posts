import {
  ObjectType, Field, Arg, registerEnumType,
} from 'type-graphql';

enum ResizeStrategy {
  CLAMP = 'clamp',
  CLIP = 'clip',
  CROP = 'crop',
  FACEAREA = 'facearea',
  FILL = 'fill',
  FILLMAX = 'fillmax',
  MAX = 'max',
  MIN = 'min',
  SCALE = 'scale',
}
registerEnumType(ResizeStrategy, { name: 'ResizeStrategy' });

@ObjectType()
export class Post {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  text: string;

  imageUrl: string;

  @Field(() => String, { name: 'imageUrl' })
  makeImageUrl(
    @Arg('width', { nullable: true }) width: number,
    @Arg('height', { nullable: true }) height: number,
    @Arg('strategy', () => ResizeStrategy, { nullable: true }) strategy: ResizeStrategy,
    @Arg('fillBlur', { nullable: true }) fillBlur: boolean,
  ): string {
    const resizeString = [
      width && `w=${width}`,
      height && `h=${height}`,
      strategy && `fit=${strategy}`,
      fillBlur && `fill=blur`,
    ].filter((e) => e).join(';');

    return this.imageUrl.replace('/o/', `/${resizeString}/`);
  }

  @Field(() => String, { nullable: true })
  videoUrl?: string;

  @Field(() => Date)
  createdAt: Date;
}
