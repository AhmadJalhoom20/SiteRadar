import {NextResponse} from 'next/server';
import {currentUser} from '@/server/auth';
export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json({data:await currentUser()},{headers:{'Cache-Control':'private, no-store, max-age=0'}});}
