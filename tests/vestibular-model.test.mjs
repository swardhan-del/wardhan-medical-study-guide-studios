import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateVestibularInput,compareVestibularInputs,equalInputPair,formatVestibularDifference} from '../src/lib/vestibular-model.ts';
const calc=(tilt,ax=0,az=0)=>calculateVestibularInput({tilt:String(tilt),ax:String(ax),az:String(az)});
const near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-12,`${actual} != ${expected}`);
test('The declared head axes determine both components, with gravity magnitude unchanged by tilt',()=>{
 for(const [tilt,ax,az,x,z] of [[0,0,0,0,-1],[90,0,0,1,0],[-90,0,0,-1,0],[30,0,0,.5,-Math.sqrt(3)/2],[-30,0,0,-.5,-Math.sqrt(3)/2],[0,1,0,-1,-1],[0,0,1,0,-2],[0,-2,-2,2,1],[90,2,2,-1,-2]]){const v=calc(tilt,ax,az);assert(v);near(v.input[0],x);near(v.input[1],z);near(Math.hypot(...v.gravity),1);}
});
test('The same-input pair matches both components despite different physical causes',()=>{
 const pair=equalInputPair();assert.notDeepEqual(pair[0],pair[1]);const a=calculateVestibularInput(pair[0]),b=calculateVestibularInput(pair[1]);assert.equal(compareVestibularInputs(a,b).equal,true);
 const horizontalOnly=calc(0,-.5,0);assert.equal(compareVestibularInputs(a,horizontalOnly).equal,false);near(a.input[0],horizontalOnly.input[0]);assert(Math.abs(a.input[1]-horizontalOnly.input[1])>.1);
});
test('Empty, nonfinite and out-of-range values produce no calculated result',()=>{
 const valid={tilt:'0',ax:'0',az:'0'};for(const [key,value] of [['tilt',''],['tilt',' '],['tilt','NaN'],['tilt','Infinity'],['tilt','91'],['tilt','-91'],['ax','2.01'],['az','-2.01'],['ax','1e999'],['az','not a number']])assert.equal(calculateVestibularInput({...valid,[key]:value}),null,`${key}=${value}`);
});
test('A small nonzero difference is not presented as a zero rounded mismatch',()=>{
 const a=calc(0),b=calc(0,.00001);const comparison=compareVestibularInputs(a,b);assert.equal(comparison.equal,false);assert.notEqual(formatVestibularDifference(comparison.difference),'0.000');assert.equal(formatVestibularDifference(0),'0.000');
});
