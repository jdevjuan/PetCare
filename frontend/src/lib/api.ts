import type {Appointment, AppointmentStatus, Consultation, Payment, PaymentMethod, Pet, PublicUser, Service} from '../types';
import type {AppointmentInput, ConsultationInput, PetInput, ProfileInput, RegisterInput, ServiceInput} from './validators';
export interface ClientView extends PublicUser {
  petCount: number;
}
export interface PetView extends Pet {
  ownerName: string;
}
export interface AppointmentView extends Appointment {
  pet?: Pet;
  service?: Service;
  owner?: PublicUser;
  payment?: Payment;
}
export interface ConsultationView extends Consultation {
  petName: string;
  ownerName: string;
}
let user:PublicUser|null=null;
let pets:PetView[]=[], services:Service[]=[], appointments:AppointmentView[]=[], consultations:ConsultationView[]=[], clients:ClientView[]=[];
async function request<T>(path:string,method='GET',body?:unknown):Promise<T>{const token=sessionStorage.getItem('petcare-token');const res=await fetch('/api'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});if(!res.ok){const e=await res.json();throw new Error(e.message||'Erro na API');}return res.status===204?undefined as T:res.json();}
export async function load(){services=await request<Service[]>('/services'+(user?.role==='ADMIN'?'?all=true':''));if(!user){pets=[];appointments=[];consultations=[];clients=[];return;}const [p,a,c]=await Promise.all([request<any[]>('/pets'),request<any[]>('/appointments'),request<any[]>('/consultations')]);pets=p.map(x=>({...x,ownerName:x.owner?.name}));appointments=a.map(x=>({...x,owner:x.pet?.owner,payment:x.payment??undefined})).sort((a,b)=>b.date.localeCompare(a.date));consultations=c.map(x=>({...x,petName:x.pet?.name,ownerName:x.pet?.owner?.name})).sort((a,b)=>b.date.localeCompare(a.date));clients=user.role==='ADMIN'?(await request<any[]>('/clients')).map(x=>({...x,petCount:x._count.pets})):[];}
export async function initialize(){if(sessionStorage.getItem('petcare-token')){try{user=await request('/me');}catch{sessionStorage.removeItem('petcare-token');}}await load();}
async function auth(path:string,data:unknown){const result=await request<{user:PublicUser,token:string}>(path,'POST',data);sessionStorage.setItem('petcare-token',result.token);user=result.user;await load();return user;}
export const login=(data:{email:string,password:string})=>auth('/auth/login',data);
export const register=(data:RegisterInput)=>auth('/auth/register',data);
export const getCurrentUser=()=>user;
export const hasUsers=()=>true;
export function logout(){sessionStorage.removeItem('petcare-token');user=null;pets=[];appointments=[];consultations=[];clients=[];services=services.filter(s=>s.active);}
export async function updateProfile(data:ProfileInput){user=await request('/me','PUT',data);return user;}
export const listPets=()=>pets;
export const listServices=(all=false)=>services.filter(s=>all||s.active);
export const listAppointments=()=>appointments;
export const listConsultations=()=>consultations;
export const listClients=()=>clients;
export function getPet(id:string){const pet=pets.find(p=>p.id===id);if(!pet)throw new Error('Animal não encontrado');return pet;}
async function write(path:string,method:string,body?:unknown){await request(path,method,body);await load();}
export const createPet=(data:PetInput,ownerId?:string)=>write('/pets','POST',{...data,ownerId});
export const updatePet=(id:string,data:PetInput)=>write('/pets/'+id,'PUT',data);
export const deletePet=(id:string)=>write('/pets/'+id,'DELETE');
export const createService=(data:ServiceInput)=>write('/services','POST',data);
export const updateService=(id:string,data:ServiceInput)=>write('/services/'+id,'PUT',data);
export async function deleteService(id:string):Promise<'deleted'|'deactivated'>{await write('/services/'+id,'DELETE');return 'deleted';}
export const createAppointment=(data:AppointmentInput)=>write('/appointments','POST',{...data,date:new Date(data.date).toISOString()});
export const setAppointmentStatus=(id:string,status:AppointmentStatus)=>write('/appointments/'+id+'/status','PUT',{status});
export const cancelAppointment=(id:string)=>setAppointmentStatus(id,'CANCELLED');
export const markPaymentPaid=(id:string,paymentMethod:PaymentMethod)=>write('/payments/'+id+'/paid','PUT',{paymentMethod});
export const createConsultation=(data:ConsultationInput)=>write('/consultations','POST',{...data,date:new Date(data.date).toISOString()});
export const deleteConsultation=(id:string)=>write('/consultations/'+id,'DELETE');
export function getClientStats(){return {petCount:pets.length,upcoming:appointments.filter(a=>!['CANCELLED','COMPLETED'].includes(a.status)&&Date.parse(a.date)>=Date.now()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5),recentConsultations:consultations.slice(0,3),userName:user?.name??''};}
export function getAdminStats(){return {clients:clients.length,pets:pets.length,pending:appointments.filter(a=>a.status==='PENDING').length,confirmed:appointments.filter(a=>a.status==='CONFIRMED').length,consultations:consultations.length,topServices:services.map(s=>({name:s.name,count:appointments.filter(a=>a.serviceId===s.id&&a.status!=='CANCELLED').length})).filter(s=>s.count).sort((a,b)=>b.count-a.count).slice(0,5)};}
