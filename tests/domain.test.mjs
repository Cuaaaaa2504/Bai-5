import test from 'node:test';
import assert from 'node:assert/strict';
import {coursePayload,categoryPayload,hasCourses,normalizeBase} from '../src/domain.mjs';
const form={title:' Android ',description:'Mô tả',instructor:'An',categoryId:'1',price:'0',duration:'20',thumbnail:'https://example.org/cover.jpg',trailerUrl:'https://example.org/trailer.mp4'};
test('normalizes base and rejects resource URL',()=>{assert.equal(normalizeBase('https://a.mockapi.io/api/v1/'),'https://a.mockapi.io/api/v1');assert.throws(()=>normalizeBase('https://a.mockapi.io/api/v1/courses'));assert.throws(()=>normalizeBase('http://a.mockapi.io'));});
test('course joins string id and permits zero price',()=>{const row=coursePayload(form,[{id:1}]);assert.equal(row.price,0);assert.equal(row.title,'Android');});
test('rejects invalid numbers, missing category and non-MP4',()=>{for(const change of [{price:'-1'},{price:'abc'},{duration:'0'},{title:''},{categoryId:'2'},{trailerUrl:'https://youtube.com/watch?v=1'}])assert.throws(()=>coursePayload({...form,...change},[{id:'1'}]));});
test('category required fields and delete guard',()=>{assert.throws(()=>categoryPayload({name:'',description:'a'}));assert.deepEqual(categoryPayload({name:' Web ',description:' Test '}),{name:'Web',description:'Test'});assert.equal(hasCourses([{categoryId:'1'}],1),true);assert.equal(hasCourses([],1),false);});
