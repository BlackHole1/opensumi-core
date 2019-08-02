import { WorkspaceServerPath } from '../common';
import { WorkspaceContribution } from './workspace-contribution';
import { Provider } from '@ali/common-di';
import { BrowserModule, EffectDomain } from '@ali/ide-core-browser';
import { injectWorkspacePreferences } from './workspace-preferences';
import { IWorkspaceService } from '../common';
import { WorkspaceService } from './workspace-service';

const pkgJson = require('../../package.json');
@EffectDomain(pkgJson.name)
export class WorkspaceModule extends BrowserModule {
  providers: Provider[] = [
    WorkspaceContribution,
    {
      token: IWorkspaceService,
      useClass: WorkspaceService,
    },
  ];

  preferences = injectWorkspacePreferences;

  // 依赖 fileService 服务
  backServices = [{
    servicePath: WorkspaceServerPath,
  }];
}
