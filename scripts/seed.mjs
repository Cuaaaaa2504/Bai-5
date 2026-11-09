// Node.js 20+. This script writes to the configured MockAPI project.
const base=(process.env.MOCKAPI_BASE_URL||'').trim().replace(/\/+$/,'');
if(!/^https:\/\/[^\s/]+\.mockapi\.io(?:\/[^\s?#]*)?$/.test(base)) throw new Error('Set MOCKAPI_BASE_URL to your HTTPS MockAPI base URL.');
if(!process.argv.includes('--confirm')) throw new Error('This creates 3 categories and 10 courses. Run npm run seed -- --confirm to approve.');
async function api(path,method='GET',body){const res=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),...(body?{body:JSON.stringify(body)}:{})});const data=await res.json();if(!res.ok)throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);return data;}
const definitions=[{name:'Lập trình Mobile',description:'Android, Flutter, React Native'},{name:'Lập trình Web',description:'Frontend và Backend'},{name:'Trí tuệ nhân tạo',description:'AI, Machine Learning, Deep Learning'}];
const samples=[['Lập trình Android cơ bản',0,'Nguyễn Văn An',500000,30],['Flutter từ cơ bản đến nâng cao',0,'Trần Minh Anh',650000,40],['React Native thực hành',0,'Lê Hoàng Nam',600000,36],['Kotlin cho người mới',0,'Phạm Thu Hà',450000,24],['HTML CSS nền tảng',1,'Đỗ Quang Huy',250000,20],['React xây dựng giao diện',1,'Vũ Ngọc Linh',550000,32],['Node.js REST API',1,'Bùi Tuấn Anh',700000,45],['Python cho AI',2,'Nguyễn Mai Chi',400000,28],['Machine Learning cơ bản',2,'Trần Đức Long',800000,48],['Deep Learning nhập môn',2,'Lê Phương Thảo',900000,50]];
try {
  const existing=await api('/categories'),courses=await api('/courses');
  if(!Array.isArray(existing)||!Array.isArray(courses))throw new Error('Resources must return JSON arrays.');
  const ids=[];
  for(const definition of definitions){const row=existing.find(c=>c.name===definition.name)||await api('/categories','POST',definition);ids.push(String(row.id));}
  let created=0;
  for(let i=0;i<samples.length;i++){const [title,index,instructor,price,duration]=samples[i];if(courses.some(c=>c.title===title))continue;await api('/courses','POST',{title,description:`Khóa học ${title}: kiến thức nền tảng, bài tập thực hành và dự án tổng kết.`,categoryId:ids[index],instructor,price,duration,thumbnail:`https://picsum.photos/seed/course-${i+1}/800/450`,trailerUrl:'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',createdAt:new Date().toISOString()});created++;}
  console.log(`Created ${created} courses. Existing titles were skipped. Sample trailer is a demo video, not course content.`);
}catch(error){console.error(error.message);console.error('Partial writes may have succeeded. Fix the error and rerun; existing sample names/titles will be skipped.');process.exitCode=1;}
