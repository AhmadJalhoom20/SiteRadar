export const viewSlugs = {
  Overview: '', Issues: 'issues', Pages: 'pages', Performance: 'performance',
  Keywords: 'keywords', Competitors: 'competitors', 'Fix prompt': 'fix-prompt',
  'Audit history': 'audits', Projects: 'projects', Integrations: 'integrations', Settings: 'settings',
} as const;
export type WorkspaceView = keyof typeof viewSlugs;
export type WorkspaceRoute = {
  view: WorkspaceView;
  scope: 'workspace' | 'project' | 'audit';
  resourceId?: string;
  detailId?: string;
};
const reportViews:WorkspaceView[]=['Overview','Issues','Pages','Performance','Keywords','Competitors','Fix prompt','Audit history'];
export function parseWorkspaceRoute(segments:string[]):WorkspaceRoute|null {
  if(!segments.length)return {view:'Projects',scope:'workspace'};
  if(segments.length===1&&segments[0]==='projects')return {view:'Projects',scope:'workspace'};
  if(segments[0]==='settings'){
    if(segments.length===1)return {view:'Settings',scope:'workspace'};
    if(segments.length===2&&segments[1]==='integrations')return {view:'Integrations',scope:'workspace'};
    return null;
  }
  if(!['projects','audits'].includes(segments[0])||!segments[1]||segments.length>4)return null;
  const scope=segments[0]==='projects'?'project':'audit';
  const view=reportViews.find(v=>viewSlugs[v]===(segments[2]??''));
  if(!view)return null;
  if(segments[3]&&!['Issues','Pages'].includes(view))return null;
  return {view,scope,resourceId:segments[1],...(segments[3]?{detailId:segments[3]}:{})};
}
export function workspaceHref(view:WorkspaceView,context?:{auditId?:string;projectId?:string;scope?:WorkspaceRoute['scope']}) {
  if(view==='Projects')return '/app/projects';
  if(view==='Settings')return '/app/settings';
  if(view==='Integrations')return '/app/settings/integrations';
  let base:string;
  if(context?.scope==='project'&&context.projectId)base=`/app/projects/${encodeURIComponent(context.projectId)}`;
  else if(context?.auditId)base=`/app/audits/${encodeURIComponent(context.auditId)}`;
  else if(context?.projectId)base=`/app/projects/${encodeURIComponent(context.projectId)}`;
  else return '/app/projects';
  return viewSlugs[view]?`${base}/${viewSlugs[view]}`:base;
}
export function safeReturnPath(value:unknown){
  if(typeof value!=='string'||!value.startsWith('/app')||value.startsWith('//'))return '/app';
  try{const url=new URL(value,'https://siteradar.invalid');if(url.origin!=='https://siteradar.invalid'||(url.pathname!=='/app'&&!url.pathname.startsWith('/app/')))return '/app';return url.pathname+url.search;}catch{return '/app';}
}
