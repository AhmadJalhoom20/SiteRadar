import type {MetadataRoute} from 'next';
import {docs} from '@/lib/docs';
import {absoluteUrl,configuredSiteUrl} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{if(!configuredSiteUrl().public)return [];return ['/','/pricing','/about','/about/ahmadjalhoom','/docs',...docs.map(d=>`/docs/${d.slug}`)].map(path=>({url:absoluteUrl(path),changeFrequency:'monthly',priority:path==='/'?1:path==='/about/ahmadjalhoom'?.8:.7}));}
