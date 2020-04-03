import { DiscordGuildConfigCoreService } from "./discord-guild-config-core-service";

jest.mock(`../../../../config/services/config-service`);

describe(`DiscordGuildConfigCoreService`, (): void => {
  let service: DiscordGuildConfigCoreService;

  beforeEach((): void => {
    service = DiscordGuildConfigCoreService.getInstance();
  });

  it(`should send a message when new members joins the current guild`, (): void => {
    expect.assertions(1);

    expect(service.shouldWelcomeNewMembers).toStrictEqual(true);
  });

  it(`should have a permanent invitation url to joins`, (): void => {
    expect.assertions(1);

    expect(service.soniaPermanentGuildInviteUrl).toStrictEqual(
      `https://discord.gg/PW4JSkv`
    );
  });
});