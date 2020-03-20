import { isDiscordUser } from './functions/is-discord-user';
import { AnyDiscordAuthor } from './types/any-discord-author';
import _ from 'lodash';

export class DiscordAuthor {
  private static _instance: DiscordAuthor;

  public static getInstance(): DiscordAuthor {
    if (_.isNil(DiscordAuthor._instance)) {
      DiscordAuthor._instance = new DiscordAuthor();
    }

    return DiscordAuthor._instance;
  }

  public isValidAuthor(author: unknown): author is AnyDiscordAuthor {
    return isDiscordUser(author);
  }

  public hasValidAuthorUsername(author: AnyDiscordAuthor): boolean {
    return _.isString(author.username) && !_.isEmpty(author.username);
  }
}