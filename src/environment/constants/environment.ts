import { LoggerConfigLevelEnum } from "../../features/logger/enums/logger-config-level.enum";
import { IEnvironment } from "../interfaces/environment";

export const ENVIRONMENT: IEnvironment = {
  discord: {
    message: {
      command: {
        prefix: [`--`, `!`],
      },
    },
    sonia: {
      id: `689829775317139460`,
      secretToken: `TO_DEFINE_BY_ASKING_IT`,
    },
  },
  github: {
    personalAccessToken: `TO_DEFINE_BY_YOU`,
  },
  logger: {
    isEnabled: true,
    level: LoggerConfigLevelEnum.DEBUG,
  },
};
