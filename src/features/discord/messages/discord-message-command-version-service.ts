import { MessageEmbedAuthor } from 'discord.js';
import _ from 'lodash';
import { AppConfigService } from '../../app/app-config-service';
import { IDiscordMessageCommandVersionConfig } from '../interfaces/discord-message-command-version-config';
import { DiscordSoniaService } from '../users/discord-sonia-service';
import { DiscordSoniaMentalStateEnum } from '../users/enums/discord-sonia-mental-state.enum';
import { DiscordMessageConfigService } from './discord-message-config-service';
import { IDiscordMessageResponse } from './interfaces/discord-message-response';

export class DiscordMessageCommandVersionService {
  private static _instance: DiscordMessageCommandVersionService;

  public static getInstance(): DiscordMessageCommandVersionService {
    if (_.isNil(DiscordMessageCommandVersionService._instance)) {
      DiscordMessageCommandVersionService._instance = new DiscordMessageCommandVersionService();
    }

    return DiscordMessageCommandVersionService._instance;
  }

  private readonly _appConfigService = AppConfigService.getInstance();
  private readonly _discordSoniaService = DiscordSoniaService.getInstance();
  private readonly _discordMessageConfigService = DiscordMessageConfigService.getInstance();

  public handle(): IDiscordMessageResponse {
    const appVersion: string = this._appConfigService.getVersion();
    const appReleaseDate: string = this._appConfigService.getReleaseDateHumanized();
    const author: MessageEmbedAuthor = this._discordSoniaService.getCorporationMessageEmbedAuthor();
    const soniaFullName: string | null = this._discordSoniaService.getSoniaFullName();
    const soniaMentalState: DiscordSoniaMentalStateEnum = this._discordSoniaService.getMentalState();
    const commandVersionConfig: IDiscordMessageCommandVersionConfig = this._discordMessageConfigService.getMessageCommandVersion();

    return {
      options: {
        embed: {
          author,
          color: commandVersionConfig.imageColor,
          fields: [
            {
              name: `Application version`,
              value: `[${appVersion}](https://github.com/Sonia-corporation/il-est-midi-discord/releases/tag/${appVersion})`
            },
            {
              name: `Release date`,
              value: appReleaseDate
            },
            {
              name: `Release notes`,
              value: `[CHANGELOG](https://github.com/Sonia-corporation/il-est-midi-discord/blob/master/CHANGELOG.md)`
            },
            {
              name: `Status`,
              value: `Ready`
            },
            {
              name: `Mental state`,
              value: _.capitalize(soniaMentalState)
            }
          ],
          thumbnail: {
            url: commandVersionConfig.imageUrl
          },
          title: `${soniaFullName} version`
        },
        split: true
      },
      response: ``
    };
  }
}
