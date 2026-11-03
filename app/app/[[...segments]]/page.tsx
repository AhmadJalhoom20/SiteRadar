import { notFound,redirect } from 'next/navigation';
import { currentUser } from '@/server/auth';
import { getAudit,getProject,listAudits,listProjects } from '@/server/db';
import { parseWorkspaceRoute } from '@/lib/workspace-routes';
import { Workspace } from '@/components/workspace';
type Props={params:Promise<{segments?:string[]}>};
export async function generateMetadata({params}:Props){const route=parseWorkspaceRoute((await params).segments??[]);return {title:route?.view??'Page not found'};}
export default async function WorkspacePage({params}:Props){
  const segments=(await params).segments??[];const route=parseWorkspaceRoute(segments);if(!route)notFound();
  const user=await currentUser();if(!user)redirect(`/sign-in?next=${encodeURIComponent('/app/'+segments.map(encodeURIComponent).join('/'))}`);
  if(!segments.length)redirect('/app/projects');
  const history=listAudits(user.id);let selected;
  if(route.scope==='audit'){
    selected=getAudit(route.resourceId!);if(!selected||selected.ownerId!==user.id)notFound();
  }else if(route.scope==='project'){
    const project=getProject(route.resourceId!,user.id);if(!project)notFound();
    selected=history.find(a=>a.projectId===project.id);if(!selected)notFound();
  }else selected=history[0];
  if(route.detailId&&route.view==='Pages'&&!selected?.pages.some(p=>p.id===route.detailId))notFound();
  if(route.detailId&&route.view==='Issues'&&!selected?.findings.some(f=>f.id===route.detailId))notFound();
  return <Workspace user={user} initialAudits={history} initialAudit={selected} route={route} savedProjects={listProjects(user.id)}/>;
}
