import { IDiscordGuildConfig } from "../../../interfaces/discord-guild-config";
import { DiscordGuildConfigCoreService } from "./discord-guild-config-core-service";
import { DiscordGuildConfigService } from "./discord-guild-config-service";

jest.mock(`../../../../config/services/config-service`);

describe(`DiscordGuildConfigService`, (): void => {
  let service: DiscordGuildConfigService;
  let discordGuildConfigCoreService: DiscordGuildConfigCoreService;

  beforeEach((): void => {
    service = DiscordGuildConfigService.getInstance();
    discordGuildConfigCoreService = DiscordGuildConfigCoreService.getInstance();
  });

  describe(`getConfig()`, (): void => {
    beforeEach((): void => {
      discordGuildConfigCoreService.shouldSendCookiesOnCreate = true;
      discordGuildConfigCoreService.shouldWelcomeNewMembers = true;
      discordGuildConfigCoreService.soniaPermanentGuildInviteUrl = `dummy-sonia-permanent-guild-invite-url`;
    });

    it(`should return the Discord guild config`, (): void => {
      expect.assertions(1);

      const result = service.getConfig();

      expect(result).toStrictEqual({
        shouldSendCookiesOnCreate: true,
        shouldWelcomeNewMembers: true,
        soniaPermanentGuildInviteUrl: `dummy-sonia-permanent-guild-invite-url`,
      } as IDiscordGuildConfig);
    });
  });

  describe(`shouldSendCookiesOnCreate()`, (): void => {
    beforeEach((): void => {
      discordGuildConfigCoreService.shouldSendCookiesOnCreate = true;
    });

    it(`should return the Discord guild config send cookies on create state`, (): void => {
      expect.assertions(1);

      const result = service.shouldSendCookiesOnCreate();

      expect(result).toStrictEqual(true);
    });
  });

  describe(`shouldWelcomeNewMembers()`, (): void => {
    beforeEach((): void => {
      discordGuildConfigCoreService.shouldWelcomeNewMembers = true;
    });

    it(`should return the Discord guild config welcome new members state`, (): void => {
      expect.assertions(1);

      const result = service.shouldWelcomeNewMembers();

      expect(result).toStrictEqual(true);
    });
  });

  describe(`getSoniaPermanentGuildInviteUrl()`, (): void => {
    beforeEach((): void => {
      discordGuildConfigCoreService.soniaPermanentGuildInviteUrl = `dummy-sonia-permanent-guild-invite-url`;
    });

    it(`should return the Discord guild config sonia permanent guild invite url`, (): void => {
      expect.assertions(1);

      const result = service.getSoniaPermanentGuildInviteUrl();

      expect(result).toStrictEqual(`dummy-sonia-permanent-guild-invite-url`);
    });
  });
});
