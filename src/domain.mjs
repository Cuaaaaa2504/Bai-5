export const text=value=>String(value??'').trim();
export function isUrl(value){try{const u=new URL(text(value));return ['https:','http:'].includes(u.protocol)&&!!u.hostname;}catch{return false;}}
export function normalizeBase(value){const base=text(value).replace(/\/+$/,'');let u;try{u=new URL(base);}catch{throw new Error('Base URL không hợp lệ.');}if(u.protocol!=='https:'||!u.hostname.endsWith('.mockapi.io')||u.username||u.password||u.search||u.hash||/\/(courses|categories)$/.test(u.pathname))throw new Error('Nhập HTTPS Base URL MockAPI, không gồm tên resource, token hoặc query.');return base;}
export function coursePayload(form,categories){
  const body={};for(const key of ['title','description','instructor','categoryId','thumbnail','trailerUrl'])body[key]=text(form[key]);
  if(Object.values(body).some(v=>!v)||!text(form.price)||!text(form.duration))throw new Error('Vui lòng điền tất cả trường bắt buộc.');
  body.price=Number(form.price);body.duration=Number(form.duration);
  if(!Number.isFinite(body.price)||body.price<0)throw new Error('Học phí phải là số không âm.');
  if(!Number.isFinite(body.duration)||body.duration<=0)throw new Error('Thời lượng phải lớn hơn 0.');
  if(!categories.some(c=>String(c.id)===body.categoryId))throw new Error('Danh mục không tồn tại. Tải lại danh mục.');
  if(!isUrl(body.thumbnail)||!isUrl(body.trailerUrl)||!(/\.mp4(?:[?#].*)?$/i.test(body.trailerUrl)))throw new Error('Ảnh phải có URL hợp lệ; trailer phải là URL MP4 trực tiếp.');
  return body;
}
export function categoryPayload(form){const name=text(form.name),description=text(form.description);if(!name||!description)throw new Error('Nhập tên và mô tả danh mục.');return {name,description};}
export const hasCourses=(rows,id)=>rows.some(row=>String(row.categoryId)===String(id));
