import _ from "lodash";
import { AbstractService } from "../../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../../classes/enums/service-name.enum";
import { IDiscordGuildConfig } from "../../../interfaces/discord-guild-config";

export class DiscordGuildConfigCoreService extends AbstractService
  implements IDiscordGuildConfig {
  private static _instance: DiscordGuildConfigCoreService;

  public static getInstance(): DiscordGuildConfigCoreService {
    if (_.isNil(DiscordGuildConfigCoreService._instance)) {
      DiscordGuildConfigCoreService._instance = new DiscordGuildConfigCoreService();
    }

    return DiscordGuildConfigCoreService._instance;
  }

  public shouldSendCookiesOnCreate = true;
  public shouldSendIlEstMidiMessage = true;
  public shouldWelcomeNewMembers = true;
  public soniaPermanentGuildInviteUrl = `https://discord.gg/PW4JSkv`;

  protected constructor() {
    super(ServiceNameEnum.DISCORD_GUILD_CONFIG_CORE_SERVICE);
  }
}