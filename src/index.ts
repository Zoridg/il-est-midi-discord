import { CoreService } from "./features/core/services/core.service";
import { InitService } from "./features/init/services/init.service";

CoreService.getInstance().init();
InitService.getInstance().init();
