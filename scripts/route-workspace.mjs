import {readFileSync,writeFileSync} from 'node:fs';
const file='components/workspace.tsx';let s=readFileSync(file,'utf8').replaceAll('\r\n','\n');
function replace(from,to){if(!s.includes(from))throw new Error('Missing route edit anchor: '+from.slice(0,95));s=s.replace(from,to);}
replace('import Link from "next/link";','import Link from "next/link";\nimport {useRouter} from "next/navigation";\nimport {workspaceHref,type WorkspaceRoute,type WorkspaceView} from "@/lib/workspace-routes";\nimport {PageDetails,FindingDetails} from "./resource-details";');
replace('  type AuditConfig,','  type AuditConfig,\n  type Project,');
const typeStart=s.indexOf('type View =');const typeEnd=s.indexOf('const reportNav',typeStart);if(typeStart<0||typeEnd<0)throw Error('View type not found');s=s.slice(0,typeStart)+'type View=WorkspaceView;\nconst EMPTY_AUDITS:Audit[]=[];\nconst EMPTY_SELECTION:string[]=[];\n'+s.slice(typeEnd);
replace('  initialAudits = [],\n  demo = false,','  initialAudits = EMPTY_AUDITS,\n  demo = false,\n  initialAudit,\n  route,\n  savedProjects=[],\n  initialSelected=EMPTY_SELECTION,\n  initialFilters,');
replace('  demo?: boolean;\n}) {','  demo?: boolean;\n  initialAudit?:Audit;\n  route?:WorkspaceRoute;\n  savedProjects?:Project[];\n  initialSelected?:string[];\n  initialFilters?:{category?:string;search?:string};\n}) {');
replace('  const [view, setView] = useState<View>("Overview"),\n    [audit, setAudit] = useState<Audit>(\n      demo ? exampleAudit : (initialAudits[0] ?? emptyAudit),\n    ),',`  const router=useRouter();
  const currentRoute=route??{view:demo?'Overview':'Projects',scope:'workspace'} as WorkspaceRoute;
  const view=currentRoute.view;
  const [audit, setAudit] = useState<Audit>(initialAudit??(demo?exampleAudit:initialAudits[0]??emptyAudit)),`);
replace('    [finding, setFinding] = useState<Finding | null>(null),\n','');
replace('[selected, setSelected] = useState<string[]>([]),','[selected, setSelected] = useState<string[]>(initialSelected),');
replace('[search, setSearch] = useState(""),','[search, setSearch] = useState(initialFilters?.search??""),');
replace('[category, setCategory] = useState("All categories"),','[category, setCategory] = useState(initialFilters?.category??"All categories"),');
const oldStorage=`      const saved = localStorage.getItem(
        "siteradar-last-" + (user?.id ?? "demo"),
      );
      const found = initialAudits.find((a) => a.id === saved);
      if (found) setAudit(found);
`;
replace(oldStorage,'');
replace('  useEffect(() => {\n    if (audit.synthetic',`  useEffect(()=>{if(initialAudit)setAudit(initialAudit);setHistory(initialAudits);},[initialAudit,initialAudits]);
  useEffect(()=>{if(view==='Fix prompt')setSelected(initialSelected);setSearch(initialFilters?.search??'');setCategory(initialFilters?.category??'All categories');setSeverity('All severities');},[view,initialSelected,initialFilters]);
  useEffect(() => {
    if (audit.synthetic`);
const ns=s.indexOf('  function navigate(next: View) {');const ne=s.indexOf('  function created(a: Audit)',ns);if(ns<0||ne<0)throw Error('Navigation block missing');
s=s.slice(0,ns)+`  function hrefFor(next:View,options?:{selectedIds?:string[];category?:string;search?:string}){
    let href=workspaceHref(next,{auditId:audit.id==='empty'?undefined:audit.id,projectId:audit.projectId,scope:currentRoute.scope});
    if(demo){const slug=next==='Overview'?'':next==='Projects'?'projects':next==='Integrations'?'settings/integrations':next==='Settings'?'settings':({Issues:'issues',Pages:'pages',Performance:'performance',Keywords:'keywords',Competitors:'competitors','Fix prompt':'fix-prompt','Audit history':'audits'} as Partial<Record<View,string>>)[next];href='/demo'+(slug?'/'+slug:'');}
    const query=new URLSearchParams();const ids=options?.selectedIds??selected;
    if(next==='Fix prompt'&&ids.length)query.set('issues',ids.join(','));
    if(options?.category)query.set('category',options.category);
    if(options?.search)query.set('search',options.search);
    return href+(query.size?'?'+query.toString():'');
  }
  function navigate(next:View,options?:{selectedIds?:string[];category?:string;search?:string}){setMobileOpen(false);setProjectOpen(false);router.push(hrefFor(next,options));}
  function chooseAudit(a:Audit,scope:'audit'|'project'='audit'){setProjectOpen(false);setMobileOpen(false);setSelected([]);router.push(demo?'/demo':workspaceHref('Overview',{auditId:a.id,projectId:a.projectId,scope}));}
  function openFinding(f:Finding){router.push(hrefFor('Issues')+'/'+encodeURIComponent(f.id));}
`+s.slice(ne);
replace('  function created(a: Audit) {\n    chooseAudit(a);','  function created(a: Audit) {\n    setAudit(a);\n    chooseAudit(a);');
replace('  if (audit.id === "empty")','  const findingDetail=currentRoute.view===\'Issues\'&&currentRoute.detailId?audit.findings.find(f=>f.id===currentRoute.detailId):undefined;\n  const pageDetail=currentRoute.view===\'Pages\'&&currentRoute.detailId?audit.pages.find(p=>p.id===currentRoute.detailId):undefined;\n  if (audit.id === "empty"&&view!=="Settings"&&view!=="Integrations")');
replace('                Read the getting-started guide\n              </Link>','                Read the getting-started guide\n              </Link> · <Link href="/app/settings/integrations">Set up integrations</Link>');
replace('          className="nav-item"\n          onClick={() => {\n            navigate("Projects");\n          }}','          className={`nav-item ${view===\'Projects\'?\'active\':\'\'}`}\n          onClick={() => navigate("Projects")}');
replace('            {projects.map((a) => (\n              <button key={a.id} onClick={() => chooseAudit(a)}>','            {projects.map((a) => (\n              <Link className="project-choice" key={a.id} href={demo?\'/demo\':workspaceHref(\'Overview\',{projectId:a.projectId,auditId:a.id,scope:\'project\'})}>');
replace('                  </small>\n                </span>\n              </button>\n            ))}','                  </small>\n                </span>\n              </Link>\n            ))}');
replace('                  <button key={a.id} onClick={() => chooseAudit(a)}>','                  <Link className="project-choice" key={a.id} href={demo?\'/demo\':workspaceHref(\'Overview\',{projectId:a.projectId,auditId:a.id,scope:\'project\'})}>');
replace('                    <ArrowRight size={20} />\n                  </button>','                    <ArrowRight size={20} />\n                  </Link>');
replace('                    <button key={a.id} onClick={() => chooseAudit(a)}>','                    <Link className="history-choice" key={a.id} href={demo?\'/demo\':workspaceHref(\'Overview\',{auditId:a.id,scope:\'audit\'})}>');
replace('                      <ArrowRight size={17} />\n                    </button>\n                  ))}','                      <ArrowRight size={17} />\n                    </Link>\n                  ))}');
replace('              <button\n                className="example-history"\n                onClick={() => chooseAudit(exampleAudit)}\n              >','              <Link className="example-history" href="/demo">');
replace('                <span>Explore the Form & Field example report</span>\n                <ArrowRight size={15} />\n              </button>','                <span>Explore the Form & Field example report</span>\n                <ArrowRight size={15} />\n              </Link>');
// Route links stay native anchors so open-in-new-tab, back, and bookmarks work.
replace('            <button\n              key={name}\n              className={`nav-item ${view === name ? "active" : ""}`}\n              onClick={() => navigate(name)}','            <Link\n              key={name}\n              className={`nav-item ${view === name ? "active" : ""}`}\n              href={hrefFor(name)} aria-current={view===name?\'page\':undefined}');
replace('              )}\n            </button>\n          ))}\n          <div className="nav-separator"','              )}\n            </Link>\n          ))}\n          <div className="nav-separator"');
s=s.replaceAll('onClick={() => setFinding(f)}','onClick={() => openFinding(f)}');
replace('          {view === "Issues" && (','          {findingDetail&&<FindingDetails audit={audit} finding={findingDetail} backHref={hrefFor(\'Issues\')} pagesHref={hrefFor(\'Pages\')} onAdd={()=>navigate(\'Fix prompt\',{selectedIds:[...new Set([...selected,findingDetail.id])]})}/>}\n          {pageDetail&&<PageDetails audit={audit} page={pageDetail} backHref={hrefFor(\'Pages\')} issuesHref={hrefFor(\'Issues\')}/>}\n          {view === "Issues" && !findingDetail && (');
replace('          {view === "Pages" && (','          {view === "Pages" && !pageDetail && (');
replace('                    setSelected(filtered.map((f) => f.id));\n                    navigate("Fix prompt");','                    navigate("Fix prompt",{selectedIds:filtered.map(f=>f.id)});');
replace('                        navigate("Issues");\n                        setCategory(s.category);','                        if(s.category===\'Performance\')navigate(\'Performance\');else navigate("Issues",{category:s.category});');
replace('                          <strong>{p.title || "Untitled page"}</strong>','                          <Link className="page-detail-link" href={hrefFor(\'Pages\')+\'/\'+encodeURIComponent(p.id??\'unknown\')}><strong>{p.title || "Untitled page"}</strong></Link>');
replace('                                navigate("Issues");\n                                setSearch(p.url);','                                navigate("Issues",{search:p.url});');
const ds=s.indexOf('      <Dialog.Root\n        open={!!finding}');const de=s.indexOf('      <Dialog.Root open={helpOpen}',ds);if(ds<0||de<0)throw Error('Finding dialog block not found');s=s.slice(0,ds)+s.slice(de);
replace('              {!demo && (','              {!demo && audit.id!==\'empty\' && (');
replace('                  onClick={() => setExportOpen(!exportOpen)}','                  onClick={() => setExportOpen(!exportOpen)} disabled={audit.id===\'empty\'}');
replace('          <div className="project-strip">','          {audit.id!==\'empty\'&&<div className="project-strip">');
replace('          </div>\n          {audit.synthetic ? (','          </div>}\n          {audit.id!==\'empty\'&&(audit.synthetic ? (');
replace('          {(active ||','          {(active ||');
// Close the report context condition immediately before the scan progress section.
replace('          )}\n          {(active ||','          ))}\n          {(active ||');
writeFileSync(file,s);
