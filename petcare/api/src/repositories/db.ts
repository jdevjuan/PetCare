import {PrismaClient} from '@prisma/client';
export const db = new PrismaClient();
export const publicUser = {id:true,name:true,email:true,phone:true,role:true,createdAt:true};
const includes:any = {pet:{owner:{select:publicUser}},service:{appointments:{select:{id:true}}},appointment:{pet:{include:{owner:{select:publicUser}}},service:true,payment:true},consultation:{pet:{include:{owner:{select:publicUser}}},appointment:true},payment:{appointment:true}};
export const repo = (model:string) => { const table=(db as any)[model]; const include=includes[model]; return {list:(where:any)=>table.findMany({where,include}),get:(id:string)=>table.findUnique({where:{id},include}),create:(data:any)=>table.create({data,include}),update:(id:string,data:any)=>table.update({where:{id},data,include}),remove:(id:string)=>table.delete({where:{id}})}; };
