import type {MetadataRoute} from 'next';
import {configuredSiteUrl} from '@/lib/site';
export default function robots():MetadataRoute.Robots{const config=configuredSiteUrl();if(!config.public)return {rules:{userAgent:'*',disallow:'/'}};return {rules:{userAgent:'*',allow:'/',disallow:['/app','/api','/sign-in','/sign-up','/demo']},sitemap:`${config.url}/sitemap.xml`,host:config.url};}
