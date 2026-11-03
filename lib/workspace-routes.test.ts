import {describe,it,expect} from 'vitest';
import {parseWorkspaceRoute,safeReturnPath,workspaceHref} from './workspace-routes';
describe('workspace URLs',()=>{
 it('maps real project, audit, settings and resource URLs',()=>{expect(parseWorkspaceRoute(['projects','p1','keywords'])).toEqual({scope:'project',resourceId:'p1',view:'Keywords'});expect(parseWorkspaceRoute(['audits','a1','pages','page1'])?.detailId).toBe('page1');expect(parseWorkspaceRoute(['settings','integrations'])?.view).toBe('Integrations');expect(workspaceHref('Pages',{auditId:'a1'})).toBe('/app/audits/a1/pages');expect(workspaceHref('Keywords',{scope:'project',projectId:'p1',auditId:'a1'})).toBe('/app/projects/p1/keywords');});
 it('rejects unknown routes and unsafe return destinations',()=>{expect(parseWorkspaceRoute(['audits','a1','not-a-view'])).toBeNull();expect(parseWorkspaceRoute(['settings','anything'])).toBeNull();for(const input of ['https://attacker.example','//attacker.example','/application','/app/../../outside','/app\\..\\outside'])expect(safeReturnPath(input)).toBe('/app');expect(safeReturnPath('/app/audits/a1/keywords')).toBe('/app/audits/a1/keywords');});
});
