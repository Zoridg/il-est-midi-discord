import _ from "lodash";
import { AbstractConfigService } from "../../../../classes/abstract-config-service";
import { PartialNested } from "../../../../types/partial-nested";
import { isNodeProduction } from "../../../node/functions/is-node-production";
import { TimeService } from "../../../time/services/time-service";
import { IAppConfig } from "../../interfaces/app-config";
import { AppConfigCoreService } from "./app-config-core-service";
import { AppConfigService } from "./app-config-service";

export class AppConfigMutationService extends AbstractConfigService<
  IAppConfig
> {
  private static _instance: AppConfigMutationService;

  public static getInstance(
    config?: Readonly<PartialNested<IAppConfig>>
  ): AppConfigMutationService {
    if (_.isNil(AppConfigMutationService._instance)) {
      AppConfigMutationService._instance = new AppConfigMutationService(config);
    }

    return AppConfigMutationService._instance;
  }

  protected readonly _className = `AppConfigMutationService`;
  private readonly _timeService = TimeService.getInstance();
  private readonly _appConfigCoreService = AppConfigCoreService.getInstance();
  private readonly _appConfigService = AppConfigService.getInstance();

  protected constructor(config?: Readonly<PartialNested<IAppConfig>>) {
    super(config);
  }

  // @todo add coverage
  public init(): AppConfigMutationService {
    this._setProductionState();
    this._setBuildDate();

    return this;
  }

  // @todo add coverage
  public updateConfig(config?: Readonly<PartialNested<IAppConfig>>): void {
    if (!_.isNil(config)) {
      this.updateVersion(config.version);
      this.updateReleaseDate(config.releaseDate);
      this.updateInitializationDate(config.initializationDate);
      this.updateTotalReleaseCount(config.totalReleaseCount);
      this.updateReleaseNotes(config.releaseNotes);

      this._loggerService.debug({
        context: this._className,
        message: this._chalkService.text(`configuration updated`),
      });
    }
  }

  public updateVersion(version?: Readonly<string>): void {
    this._appConfigCoreService.version = this._configService.getUpdatedString({
      context: this._className,
      newValue: version,
      oldValue: this._appConfigService.getVersion(),
      valueName: `version`,
    });
  }

  public updateReleaseDate(releaseDate?: Readonly<string>): void {
    this._appConfigCoreService.releaseDate = this._configService.getUpdatedString(
      {
        context: this._className,
        newValue: releaseDate,
        oldValue: this._appConfigService.getReleaseDate(),
        valueName: `release date`,
      }
    );
  }

  public updateInitializationDate(initializationDate?: Readonly<string>): void {
    this._appConfigCoreService.initializationDate = this._configService.getUpdatedString(
      {
        context: this._className,
        newValue: initializationDate,
        oldValue: this._appConfigService.getInitializationDate(),
        valueName: `initialization date`,
      }
    );
  }

  public updateProductionState(isProduction?: Readonly<boolean>): void {
    this._appConfigCoreService.isProduction = this._configService.getUpdatedBoolean(
      {
        context: this._className,
        newValue: isProduction,
        oldValue: this._appConfigService.isProduction(),
        valueName: `production state`,
      }
    );
  }

  public updateTotalReleaseCount(totalReleaseCount?: Readonly<number>): void {
    this._appConfigCoreService.totalReleaseCount = this._configService.getUpdatedNumber(
      {
        context: this._className,
        newValue: totalReleaseCount,
        oldValue: this._appConfigService.getTotalReleaseCount(),
        valueName: `total release count`,
      }
    );
  }

  public updateReleaseNotes(releaseNotes?: Readonly<string>): void {
    this._appConfigCoreService.releaseNotes = this._configService.getUpdatedString(
      {
        context: this._className,
        isValueDisplay: false,
        newValue: releaseNotes,
        oldValue: this._appConfigService.getReleaseNotes(),
        valueName: `release notes`,
      }
    );
  }

  private _setProductionState(): void {
    this.updateProductionState(isNodeProduction());
  }

  private _setBuildDate(): void {
    if (!this._appConfigService.isProduction()) {
      this.updateInitializationDate(this._timeService.now());
    }
  }
}
