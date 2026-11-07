import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState, reduce, moods} from '../dist/state.js';
test('all 25 mood combinations remain independent through Help and Resume',()=>{
 for(const before of [null,...moods])for(const after of [null,...moods]){
  let s={...initialState(),view:'post',before,after};
  s=reduce(s,{type:'HELP'});s=reduce(s,{type:'DOWNLOAD'});s=reduce(s,{type:'CLOSE'});s=reduce(s,{type:'BACK'});
  assert.equal(s.view,'post');assert.equal(s.before,before);assert.equal(s.after,after);
  s=reduce(s,{type:'CANCEL'});s=reduce(s,{type:'CLOSE'});
  assert.equal(s.before,before);assert.equal(s.after,after);assert.equal(s.modal,null);
 }
});
test('Skip clears only the optional mood being skipped',()=>{
 let s={...initialState(),view:'pre',before:'sad',after:'calm'};
 s=reduce(s,{type:'SKIP'});assert.equal(s.before,null);assert.equal(s.after,'calm');assert.equal(s.view,'notice');
 s={...s,view:'post',before:'tired'};s=reduce(s,{type:'SKIP'});assert.equal(s.before,'tired');assert.equal(s.after,null);assert.equal(s.view,'completion');
 s={...s,view:'feel',before:'sad',after:'calm'};s=reduce(s,{type:'SKIP'});assert.equal(s.before,'sad');assert.equal(s.after,'calm');
});
test('Exit and Restart clear both moods and invalidate old browser history',()=>{
 for(const type of ['EXIT','RESTART']){
  let s={...initialState(),view:'completion',before:'tired',after:'calm'};
  s=reduce(s,{type});assert.equal(s.view,'welcome');assert.equal(s.before,null);assert.equal(s.after,null);
  s=reduce(s,{type:'HISTORY',view:'completion',epoch:0});assert.equal(s.view,'welcome');
 }
});
test('Next without selection completes the entire user-paced journey',()=>{
 let s=initialState();for(let i=0;i<7;i++)s=reduce(s,{type:'NEXT'});
 assert.equal(s.view,'completion');assert.equal(s.before,null);assert.equal(s.after,null);
});
test('Help returns to Welcome and Completion as well as activity screens',()=>{
 for(const origin of ['welcome','pre','notice','feel','listen','awareness','post','completion']){
  let s={...initialState(),view:origin,before:'sad'};s=reduce(s,{type:'HELP'});s=reduce(s,{type:'BACK'});
  assert.equal(s.view,origin);assert.equal(s.before,'sad');
 }
});
test('tapping a selected mood again clears only that check-in value',()=>{
 for(const view of ['pre','post'])for(const mood of moods){
  const slot=view==='pre'?'before':'after';
  const other=view==='pre'?'after':'before';
  let s={...initialState(),view,[other]:'sad'};
  s=reduce(s,{type:'TOGGLE_MOOD',mood});assert.equal(s[slot],mood);
  s=reduce(s,{type:'TOGGLE_MOOD',mood});assert.equal(s[slot],null);assert.equal(s[other],'sad');
  s=reduce(s,{type:'NEXT'});assert.equal(s[slot],null);
 }
});
test('choosing another card switches selection without clearing the other slot',()=>{
 let s={...initialState(),view:'pre',before:'calm',after:'tired'};
 s=reduce(s,{type:'TOGGLE_MOOD',mood:'anxious'});
 assert.equal(s.before,'anxious');assert.equal(s.after,'tired');
});
