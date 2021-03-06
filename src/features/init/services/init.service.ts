import appRootPath from "app-root-path";
import axios, { AxiosResponse } from "axios";
import fs from "fs-extra";
import _ from "lodash";
import { AbstractService } from "../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../enums/service-name.enum";
import { ENVIRONMENT } from "../../../environment/constants/environment";
import { IEnvironment } from "../../../environment/interfaces/environment";
import { getBearer } from "../../../functions/formatters/get-bearer";
import { IPackage } from "../../../interfaces/package";
import { AppConfigMutatorService } from "../../app/services/config/app-config-mutator.service";
import { DiscordMessageConfigMutatorService } from "../../discord/messages/services/config/discord-message-config-mutator.service";
import { DiscordService } from "../../discord/services/discord.service";
import { DiscordSoniaConfigMutatorService } from "../../discord/users/services/config/discord-sonia-config-mutator.service";
import { GITHUB_API_URL } from "../../github/constants/github-api-url";
import { GITHUB_QUERY_RELEASES_LATEST_AND_TOTAL_COUNT } from "../../github/constants/queries/github-query-releases-latest-and-total-count";
import { getHumanizedReleaseNotes } from "../../github/functions/get-humanized-release-notes";
import { IGithubReleasesLatest } from "../../github/interfaces/github-releases-latest";
import { GithubConfigMutatorService } from "../../github/services/config/github-config-mutator.service";
import { GithubConfigService } from "../../github/services/config/github-config.service";
import { ChalkService } from "../../logger/services/chalk.service";
import { LoggerConfigMutatorService } from "../../logger/services/config/logger-config-mutator.service";
import { LoggerService } from "../../logger/services/logger.service";
import { ProfileConfigMutatorService } from "../../profile/services/config/profile-config-mutator.service";
import { ServerConfigMutatorService } from "../../server/services/config/server-config-mutator.service";
import { ServerService } from "../../server/services/server.service";

export class InitService extends AbstractService {
  private static _instance: InitService;

  public static getInstance(): InitService {
    if (_.isNil(InitService._instance)) {
      InitService._instance = new InitService();
    }

    return InitService._instance;
  }

  private readonly _loggerService: LoggerService = LoggerService.getInstance();
  private readonly _chalkService: ChalkService = ChalkService.getInstance();

  public constructor() {
    super(ServiceNameEnum.INIT_SERVICE);
  }

  public init(): void {
    this._loggerService.init();
    this._readEnvironment();
  }

  private _mergeEnvironments(
    environmentA: Readonly<IEnvironment>,
    environmentB: Readonly<IEnvironment>
  ): IEnvironment {
    return _.merge({}, environmentA, environmentB);
  }

  private _runApp(): void {
    DiscordService.getInstance().init();
    ServerService.getInstance().initializeApp();
  }

  private _configureApp(environment: Readonly<IEnvironment>): void {
    this._configureAppFromEnvironment(environment);
    this._configureAppFromPackage();
    this._configureAppFromGitHubReleases();
  }

  private _configureAppFromEnvironment(
    environment: Readonly<IEnvironment>
  ): void {
    LoggerConfigMutatorService.getInstance().updateConfig(environment.logger);
    GithubConfigMutatorService.getInstance().updateConfig(environment.github);
    DiscordSoniaConfigMutatorService.getInstance().updateConfig(
      environment.discord
    );
    DiscordMessageConfigMutatorService.getInstance().updateConfig(
      environment.discord
    );
    ProfileConfigMutatorService.getInstance().updateConfig(environment.profile);
    AppConfigMutatorService.getInstance().init().updateConfig(environment.app);
    ServerConfigMutatorService.getInstance().init();
  }

  private _configureAppFromPackage(): void {
    fs.readJson(`${appRootPath}/package.json`)
      .then((data: Readonly<IPackage>): void => {
        AppConfigMutatorService.getInstance().updateVersion(data.version);
      })
      .catch((error: unknown): void => {
        this._loggerService.error({
          message: this._chalkService.text(`Failed to read the package file`),
        });
        this._loggerService.error({
          message: this._chalkService.text(error),
        });
      });
  }

  private _configureAppFromGitHubReleases(): void {
    axios({
      data: {
        query: GITHUB_QUERY_RELEASES_LATEST_AND_TOTAL_COUNT,
      },
      headers: {
        Authorization: getBearer(
          GithubConfigService.getInstance().getPersonalAccessToken()
        ),
      },
      method: `post`,
      url: GITHUB_API_URL,
    })
      .then((axiosResponse: AxiosResponse<IGithubReleasesLatest>): void => {
        AppConfigMutatorService.getInstance().updateTotalReleaseCount(
          axiosResponse.data.data.repository.releases.totalCount
        );
        AppConfigMutatorService.getInstance().updateReleaseDate(
          axiosResponse.data.data.repository.releases.edges[0].node.updatedAt
        );
        AppConfigMutatorService.getInstance().updateReleaseNotes(
          getHumanizedReleaseNotes(
            axiosResponse.data.data.repository.releases.edges[0].node
              .description
          )
        );
      })
      .catch((): void => {
        this._loggerService.error({
          message: this._chalkService.text(
            `Failed to get the app total release count from GitHub API`
          ),
        });
      });
  }

  private _readEnvironment(): void {
    fs.readJson(`${appRootPath}/src/environment/secret-environment.json`)
      .then((environment: Readonly<IEnvironment>): void => {
        this._startApp(this._mergeEnvironments(ENVIRONMENT, environment));
      })
      .catch((error: unknown): void => {
        console.error(`Failed to read the secret environment file`);
        console.error(error);
        console.debug(
          `Follow the instructions about the secret environment to fix this:`
        );
        console.debug(
          `https://github.com/Sonia-corporation/il-est-midi-discord/blob/master/CONTRIBUTING.md#create-the-secret-environment-file`
        );
        throw new Error(
          `The app must have a secret environment file with at least a "discord.sonia.secretToken" inside it`
        );
      });
  }

  private _startApp(environment: Readonly<IEnvironment>): void {
    this._configureApp(environment);
    this._runApp();
  }
}
