export {normalizeBase,isUrl as validUrl} from './domain.mjs';
export async function request(base,path,method='GET',body){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
  try{const res=await fetch(base+path,{method,signal:controller.signal,headers:{Accept:'application/json','Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const raw=await res.text();let data;try{data=raw?JSON.parse(raw):null;}catch{throw new Error('HTTP '+res.status+': API không trả JSON hợp lệ.');}if(!res.ok)throw new Error('HTTP '+res.status+': '+(typeof data==='string'?data:'Thao tác API thất bại.'));return data;}catch(e){if(e.name==='AbortError')throw new Error('Kết nối quá 15 giây. Kiểm tra mạng và thử lại.');throw e;}finally{clearTimeout(timer);}
}
export async function list(base,resource){const data=await request(base,'/'+resource);if(!Array.isArray(data))throw new Error(resource+' phải trả về mảng JSON.');return data.map(row=>{if(!row||typeof row!=='object'||row.id==null)throw new Error(resource+': bản ghi thiếu id.');return {...row,id:String(row.id)};});}
export async function loadAll(base){const [categories,courses]=await Promise.all([list(base,'categories'),list(base,'courses')]);return {categories,courses};}
export async function save(base,resource,id,body){const row=await request(base,'/'+resource+(id?'/'+encodeURIComponent(id):''),id?'PUT':'POST',body);if(!row||typeof row!=='object'||row.id==null)throw new Error('API đã phản hồi nhưng thiếu id. Tải lại danh sách trước khi thử ghi lại.');return {...row,id:String(row.id)};}
export const remove=(base,resource,id)=>request(base,'/'+resource+'/'+encodeURIComponent(id),'DELETE');
