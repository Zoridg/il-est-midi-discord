import _ from "lodash";
import { AbstractService } from "../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../enums/service-name.enum";
import { isValidDate } from "../../../../functions/checks/is-valid-date";
import { TimeService } from "../../../time/services/time.service";
import { AppProductionStateEnum } from "../../enums/app-production-state.enum";
import { AppConfigService } from "./app-config.service";

export class AppConfigQueryService extends AbstractService {
  private static _instance: AppConfigQueryService;

  public static getInstance(): AppConfigQueryService {
    if (_.isNil(AppConfigQueryService._instance)) {
      AppConfigQueryService._instance = new AppConfigQueryService();
    }

    return AppConfigQueryService._instance;
  }

  private readonly _appConfigService: AppConfigService = AppConfigService.getInstance();
  private readonly _timeService: TimeService = TimeService.getInstance();

  public constructor() {
    super(ServiceNameEnum.APP_CONFIG_QUERY_SERVICE);
  }

  public getReleaseDateHumanized(): string {
    const releaseDate: string = this._appConfigService.getReleaseDate();

    if (isValidDate(releaseDate)) {
      return this._timeService.fromNow(releaseDate);
    }

    return releaseDate;
  }

  public getInitializationDateHumanized(): string {
    const initializationDate: string = this._appConfigService.getInitializationDate();

    if (isValidDate(initializationDate)) {
      return this._timeService.fromNow(initializationDate);
    }

    return initializationDate;
  }

  public getProductionStateHumanized(): AppProductionStateEnum {
    return this._appConfigService.isProduction()
      ? AppProductionStateEnum.PRODUCTION
      : AppProductionStateEnum.DEVELOPMENT;
  }

  public getTotalReleaseCountHumanized(): string {
    const totalReleaseCount: number = this._appConfigService.getTotalReleaseCount();
    let sentence = `${totalReleaseCount} version`;

    if (_.gt(totalReleaseCount, 1)) {
      sentence = `${sentence}s`;
    }

    return sentence;
  }
}
