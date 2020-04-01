import _ from "lodash";
import moment from "moment";
import { isValidDate } from "../../../../functions/checks/is-valid-date";
import { AppProductionStateEnum } from "../../enums/app-production-state.enum";
import { AppConfigService } from "./app-config-service";

export class AppConfigQueryService {
  private static _instance: AppConfigQueryService;

  public static getInstance(): AppConfigQueryService {
    if (_.isNil(AppConfigQueryService._instance)) {
      AppConfigQueryService._instance = new AppConfigQueryService();
    }

    return AppConfigQueryService._instance;
  }

  private readonly _appConfigService = AppConfigService.getInstance();

  public getReleaseDateHumanized(): string {
    const releaseDate: string = this._appConfigService.getReleaseDate();

    if (isValidDate(releaseDate)) {
      return _.capitalize(moment(releaseDate).fromNow());
    }

    return releaseDate;
  }

  public getInitializationDateHumanized(): string {
    const initializationDate: string = this._appConfigService.getInitializationDate();

    if (isValidDate(initializationDate)) {
      return _.capitalize(moment(initializationDate).fromNow());
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
