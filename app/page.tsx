import { Landing } from "@/components/landing";
import {JsonLd} from '@/components/json-ld';
import {siteEntities} from '@/lib/seo';
export default function Home() {
  return <><JsonLd data={siteEntities()}/><Landing /></>;
}
