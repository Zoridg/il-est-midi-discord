import { DiscordGuildConfigValueNameEnum } from "./discord-guild-config-value-name.enum";

describe(`DiscordGuildConfigValueNameEnum`, (): void => {
  it(`should have a member "SHOULD_WELCOME_NEW_MEMBERS"`, (): void => {
    expect.assertions(1);

    expect(
      DiscordGuildConfigValueNameEnum.SHOULD_WELCOME_NEW_MEMBERS
    ).toStrictEqual(`welcome new members state`);
  });

  it(`should have a member "SONIA_PERMANENT_GUILD_INVITE_URL"`, (): void => {
    expect.assertions(1);

    expect(
      DiscordGuildConfigValueNameEnum.SONIA_PERMANENT_GUILD_INVITE_URL
    ).toStrictEqual(`Sonia permanent guild invite url`);
  });
});