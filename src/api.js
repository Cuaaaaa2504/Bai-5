export function normalizeBase(value) {
  const base = value.trim().replace(/\/+$/, '');
  if (!/^https:\/\/[^\s/]+\.mockapi\.io(?:\/[^\s?#]*)?$/.test(base)) throw new Error('Nhập HTTPS Base URL MockAPI, không gồm /courses hoặc /categories.');
  if (/\/(courses|categories)$/.test(base)) throw new Error('Base URL không gồm tên resource.');
  return base;
}
export async function request(base, path, method = 'GET', body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(base + path, {method, signal: controller.signal, headers: {'Content-Type':'application/json'}, ...(body === undefined ? {} : {body:JSON.stringify(body)})});
    const text = await response.text();
    let data; try { data = text ? JSON.parse(text) : null; } catch { throw new Error('API không trả về JSON hợp lệ.'); }
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${typeof data === 'string' ? data : 'Thao tác API thất bại'}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Hết thời gian kết nối. Vui lòng thử lại.');
    throw error;
  } finally { clearTimeout(timer); }
}
export async function loadAll(base) {
  const [categories, courses] = await Promise.all([request(base, '/categories'), request(base, '/courses')]);
  if (!Array.isArray(categories) || !Array.isArray(courses)) throw new Error('Resource phải trả về mảng JSON. Kiểm tra Base URL.');
  return {categories, courses};
}
export const validUrl = value => /^https?:\/\/[^\s]+$/i.test(value.trim());
