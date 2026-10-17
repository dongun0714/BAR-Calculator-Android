'use strict';
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString('ko-KR');
let result = null;

function calculate() {
  const raw = ['sheets', 's2', 's3'].map(id => $(id).value);
  const vals = raw.map(Number);
  const valid = raw.every(s => s.trim() !== '') && vals.every(n => Number.isSafeInteger(n) && n >= 0)
    && vals[1] + vals[2] > 0 && Number.isSafeInteger(vals[1] + vals[2]);
  $('error').hidden = valid;
  if (!valid) {
    $('error').textContent = '전체 시트, S2, S3에 0 이상의 정수를 입력하고 S2 + S3은 1 이상이어야 합니다.';
    result = null;
    return;
  }
  const [N, a, b] = vals;
  const L = a + b, P = 2 * a + 3 * b;
  if (!Number.isSafeInteger(P)) { $('error').textContent = '숫자가 너무 큽니다. 더 작은 값을 입력하세요.'; $('error').hidden = false; result = null; return; }
  const B = Math.floor(N / P), s2 = a * B, s3 = b * B;
  const u2 = 2 * s2, u3 = 3 * s3, used = u2 + u3;
  const remaining = N - used, layers = L * B;
  if (![s2,s3,u2,u3,used,layers].every(Number.isSafeInteger)) { $('error').textContent = '계산 범위가 너무 큽니다.'; $('error').hidden = false; result = null; return; }
  const pct = N === 0 ? 0 : used / N * 100;
  result = {N,a,b,L,P,B,s2,s3,u2,u3,used,remaining,layers,pct};
  $('layers').value = L;
  $('bars').innerHTML = `${fmt(B)} <em>BAR</em>`;
  $('perbar-label').textContent = `1BAR = ${fmt(P)}시트`;
  $('totalS2').textContent = fmt(s2);
  $('totalS3').textContent = fmt(s3);
  $('s2used').textContent = `${fmt(u2)}시트 사용`;
  $('s3used').textContent = `${fmt(u3)}시트 사용`;
  $('perBar').textContent = fmt(P);
  $('totalLayers').textContent = fmt(layers);
  $('all').textContent = `${fmt(N)}개`;
  $('used').textContent = `${fmt(used)}개`;
  $('remaining').textContent = `${fmt(remaining)}개`;
  $('pct').textContent = `${pct.toFixed(1)}%`;
  $('progress').style.width = `${pct}%`;
  $('verified').textContent = N === u2 + u3 + remaining ? '검산 완료' : '검산 오류';
}

$('reset').addEventListener('click', () => { $('sheets').value = '1500'; $('s2').value = '10'; $('s3').value = '53'; $('toast').textContent = ''; calculate(); });
$('copy').addEventListener('click', async () => {
  if (!result) { $('toast').textContent = '입력값을 확인하세요.'; return; }
  const r = result;
  const content = [
    'BAR 생산 계산 결과',
    `전체 시트: ${fmt(r.N)}개`,
    `1BAR 구성: ${fmt(r.L)}층 (S2 ${fmt(r.a)}개, S3 ${fmt(r.b)}개)`,
    `1BAR 필요 시트: ${fmt(r.P)}개`,
    `완성 BAR: ${fmt(r.B)}개`,
    `S2 총생산량: ${fmt(r.s2)}개 (사용 시트 ${fmt(r.u2)}개)`,
    `S3 총생산량: ${fmt(r.s3)}개 (사용 시트 ${fmt(r.u3)}개)`,
    `총 완성 층수: ${fmt(r.layers)}층`,
    `총 사용 시트: ${fmt(r.used)}개`,
    `잔여 시트: ${fmt(r.remaining)}개`,
    `시트 사용률: ${r.pct.toFixed(1)}%`
  ].join('\n');
  try { if (window.Android && window.Android.copyText) { window.Android.copyText(content); } else { await navigator.clipboard.writeText(content); } $('toast').textContent = '계산 결과를 복사했습니다.'; }
  catch (_) { $('toast').textContent = '클립보드 접근이 제한되었습니다.'; }
});
['sheets','s2','s3'].forEach(id => $(id).addEventListener('input', calculate));
calculate();
