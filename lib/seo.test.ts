import {describe,it,expect} from 'vitest';
import {configuredSiteUrl} from './site';
import {serializeJsonLd,siteEntities} from './seo';
describe('indexing and founder identity',()=>{
 it('requires a real HTTPS domain before indexing is enabled',()=>{expect(configuredSiteUrl('').public).toBe(false);expect(configuredSiteUrl('https://siteradar.example').public).toBe(true);expect(()=>configuredSiteUrl('http://public.example')).toThrow();expect(()=>configuredSiteUrl('https://public.example/path')).toThrow();});
 it('connects the real founder to the application without inventing social profiles',()=>{const graph=siteEntities()['@graph'];const person=graph.find(n=>n['@type']==='Person');const app=graph.find(n=>n['@type']==='SoftwareApplication');expect(person?.name).toBe('AhmadJalhoom');expect(app?.creator?.['@id']).toBe(person?.['@id']);expect(JSON.stringify(graph)).not.toContain('linkedin.com');expect(serializeJsonLd({text:'</script><script>'})).not.toContain('<');});
});
