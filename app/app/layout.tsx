import type {Metadata} from 'next';
export const metadata:Metadata={title:{default:'Workspace | SiteRadar',template:'%s | SiteRadar'},robots:{index:false,follow:false},referrer:'same-origin',alternates:{canonical:null}};
export default function WorkspaceLayout({children}:{children:React.ReactNode}){return children;}
