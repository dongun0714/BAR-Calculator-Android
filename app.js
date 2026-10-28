"use strict";
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('ko-KR');
let result = null;
const setNum = (id, n) => { $(id).textContent = fmt(n); };
function calculate() {
  const raw = ['sheets','s2','s3','el3'].map(id => $(id).value.trim());
  const values = raw.map(Number);
  const valid = raw.every(v => v !== '') && values.every(v => Number.isSafeInteger(v) && v >= 0) && (values[1] + values[2] + values[3] > 0);
  $('error').hidden = valid;
  if (!valid) { $('error').textContent = '0 이상의 정수 · 구성 합계 1 이상'; result = null; return; }
  const [N,a,b,c] = values;
  const L=a+b+c,P=2*a+3*b+3*c;
  if (![L,P].every(Number.isSafeInteger)) { $('error').textContent='숫자가 너무 큽니다'; $('error').hidden=false;result=null;return; }
  const B=Math.floor(N/P),s2=a*B,s3=b*B,el3=c*B,u2=s2*2,u3=s3*3,ue3=el3*3,used=u2+u3+ue3,remaining=N-used,layers=L*B;
  if (![s2,s3,el3,u2,u3,ue3,used,remaining,layers].every(Number.isSafeInteger)) { $('error').textContent='숫자가 너무 큽니다';$('error').hidden=false;result=null;return; }
  const pct=N?used/N*100:0;
  result={N,a,b,c,L,P,B,s2,s3,el3,u2,u3,ue3,used,remaining,layers,pct};
  [['layers',L],['bars',B],['perBar',P],['totalS2',s2],['totalS3',s3],['totalEL3',el3],['s2used',u2],['s3used',u3],['el3used',ue3],['totalLayers',layers]].forEach(([id,v])=>setNum(id,v));
  $('all').textContent=`${fmt(N)} 개`; $('used').textContent=`${fmt(used)} 개`; $('remaining').textContent=`${fmt(remaining)} 개`;
  $('pct').textContent=`${pct.toFixed(1)}%`; $('progress').style.width=`${pct}%`; $('progressbar').setAttribute('aria-valuenow',pct.toFixed(1));
  $('verified').textContent=(N===used+remaining)?'검산 완료':'검산 오류';
}
$('reset').addEventListener('click',()=>{[['sheets','1500'],['s2','10'],['s3','53'],['el3','0']].forEach(([id,v])=>$(id).value=v);$('toast').textContent='';calculate();});
$('copy').addEventListener('click',async()=>{
 if(!result){$('toast').textContent='입력값 확인';return;}
 const r=result;
 const content=[`BAR 생산 계산 결과`,`전체 시트: ${fmt(r.N)}개`,`1BAR: ${fmt(r.L)}층 / ${fmt(r.P)}시트`,`구성: S2 ${fmt(r.a)}, S3 ${fmt(r.b)}, EL3 ${fmt(r.c)}`,`완성 BAR: ${fmt(r.B)}개`,`S2: ${fmt(r.s2)}개 / 사용 ${fmt(r.u2)}시트`,`S3: ${fmt(r.s3)}개 / 사용 ${fmt(r.u3)}시트`,`EL3: ${fmt(r.el3)}개 / 사용 ${fmt(r.ue3)}시트`,`총 층수: ${fmt(r.layers)}층`,`사용: ${fmt(r.used)}시트`,`잔여: ${fmt(r.remaining)}시트`,`사용률: ${r.pct.toFixed(1)}%`].join('\n');
 try { if(window.Android && window.Android.copyText) window.Android.copyText(content);else await navigator.clipboard.writeText(content);$('toast').textContent='복사 완료';}catch(e){$('toast').textContent='복사 실패';}
});
['sheets','s2','s3','el3'].forEach(id=>$(id).addEventListener('input',()=>{$('toast').textContent='';calculate();}));
calculate();