"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface OnboardingProps {
  onComplete: () => void;
}

const BG = ['#000','#000','#000','#fff','#fff','#111','#fff','#fff','#fff','#6B5CE7'];
const DOT_ON = ['rgba(255,255,255,.8)','rgba(255,255,255,.8)','rgba(255,255,255,.8)','#111','#111','rgba(255,255,255,.8)','#111','#111','#111','#fff'];
const DOT_OFF = ['rgba(255,255,255,.15)','rgba(255,255,255,.15)','rgba(255,255,255,.15)','#ddd','#ddd','rgba(255,255,255,.15)','#ddd','#ddd','#ddd','rgba(255,255,255,.2)'];
const RIP = ['#000','#000','#000','#fff','#fff','#111','#fff','#fff','#fff','#6B5CE7'];
const DOT_IDX = [2,2,2,3,4,5,6,7,8,8];

// Animation helpers — use animation-fill-mode: both so keyframe controls opacity
const fu = (d: number): React.CSSProperties => ({ animation: `ob-fu .5s ${d}s cubic-bezier(.22,1,.36,1) both` });
const fsl = (d: number): React.CSSProperties => ({ animation: `ob-fsl .5s ${d}s cubic-bezier(.22,1,.36,1) both` });
const fdr = (d: number): React.CSSProperties => ({ animation: `ob-fdr .5s ${d}s cubic-bezier(.22,1,.36,1) both` });
const fzm = (d: number): React.CSSProperties => ({ animation: `ob-fzm .55s ${d}s cubic-bezier(.22,1,.36,1) both` });

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [screen, setScreen] = useState(0);
  const [ripple, setRipple] = useState<{ x: number; y: number; color: string; maxR: number; fading: boolean } | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullText = '숏폼은 열심히 찍는데\n블로그는 그냥\n방치하고 있죠?';

  useEffect(() => {
    if (screen !== 0) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(timer);
        setTimeout(() => setShowCursor(false), 600);
      }
    }, 55);
    return () => clearInterval(timer);
  }, [screen]);

  const go = useCallback((n: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (transitioning || n === screen) return;
    const container = containerRef.current;
    if (!container) return;

    const br = e.currentTarget.getBoundingClientRect();
    const pr = container.getBoundingClientRect();
    const x = br.left - pr.left + br.width / 2;
    const y = br.top - pr.top + br.height / 2;
    const maxR = Math.hypot(Math.max(x, pr.width - x), Math.max(y, pr.height - y)) + 40;

    setRipple({ x, y, color: RIP[n], maxR, fading: false });
    setTransitioning(true);

    setTimeout(() => {
      setScreen(n);
      setTimeout(() => {
        setRipple(prev => prev ? { ...prev, fading: true } : null);
        setTimeout(() => {
          setRipple(null);
          setTransitioning(false);
        }, 200);
      }, 50);
    }, 500);
  }, [screen, transitioning]);

  const handleExit = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onComplete(), 500);
  }, [exiting, onComplete]);

  const dots = (s: number, anim: React.CSSProperties) => (
    <div style={{ ...anim, marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: 7 }, (_, j) => (
          <div key={j} style={{
            height: 4, borderRadius: 2,
            width: j === DOT_IDX[s] ? 20 : 5,
            background: j === DOT_IDX[s] ? DOT_ON[s] : DOT_OFF[s],
            transition: 'all .4s cubic-bezier(.22,1,.36,1)',
          }} />
        ))}
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      // ── S0: Dark — "잠깐만요" ──
      case 0:
        return (
          <>
            {dots(0, fu(0.05))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ ...fu(0.05), fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 500, letterSpacing: '.5px', marginBottom: 18 }}>잠깐만요</p>
              <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.5, letterSpacing: '-0.5px' }}>
                {typed.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
                {showCursor && (
                  <span style={{ display: 'inline-block', width: 2, height: 28, background: '#6B5CE7', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'cursorBlink 1s step-end infinite' }} />
                )}
              </h1>
            </div>
            <div style={{ ...fu(0.45), width: '100%', display: 'flex', justifyContent: 'center', opacity: typed.length >= fullText.length ? 1 : 0, transition: 'opacity 0.4s ease' }}>
              <button className="ob-btn" style={{ background: '#f0ede8', color: '#111', borderRadius: 20 }} onClick={(e) => go(1, e)}>맞아요</button>
            </div>
          </>
        );

      // ── S1: Dark — 서사 ──
      case 1:
        return (
          <>
            {dots(1, fu(0.05))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 48 }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.2)', fontWeight: 500, marginBottom: 32, filter: 'blur(.8px)' }}>맞아요</p>
              <p style={{ ...fu(0.05), fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 500, letterSpacing: '.5px', marginBottom: 14, textTransform: 'uppercase' }}>그렇죠</p>
              <h2 style={{ ...fu(0.15), fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.55, letterSpacing: '-0.4px' }}>
                영상 하나 올릴 때마다<br />블로그에 옮겨 쓰는 게<br />솔직히 너무 귀찮잖아요.
              </h2>
            </div>
            <div style={{ ...fu(0.7), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#f0ede8', color: '#111', borderRadius: 20 }} onClick={(e) => go(2, e)}>너무 맞는 말이에요</button>
            </div>
          </>
        );

      // ── S2: Dark — 브랜드 소개 ──
      case 2:
        return (
          <>
            {dots(2, fu(0.05))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 48 }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.15)', marginBottom: 24, filter: 'blur(.8px)', lineHeight: 1.6 }}>
                영상 하나 올릴 때마다 블로그에 옮겨 쓰는 게 솔직히 너무 귀찮잖아요.
              </p>
              <p style={{ ...fu(0.05), fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 500, letterSpacing: '.5px', marginBottom: 14 }}>그래서 만들었어요</p>
              <h1 style={{ ...fu(0.15), fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 0.95, marginBottom: 16 }}>
                Logos<span style={{ color: '#6B5CE7' }}> AI</span>
              </h1>
              <p style={{ ...fu(0.25), fontSize: 16, color: 'rgba(255,255,255,.5)', fontWeight: 400, lineHeight: 1.7, letterSpacing: '-0.2px' }}>
                숏폼 URL 하나를 붙여넣으면<br />네이버 블로그 글이 완성됩니다.
              </p>
            </div>
            <div style={{ ...fu(0.7), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#f0ede8', color: '#111', borderRadius: 20 }} onClick={(e) => go(3, e)}>어떻게요?</button>
            </div>
          </>
        );

      // ── S3: White — 3단계 설명 ──
      case 3:
        return (
          <>
            {dots(3, fdr(0.05))}
            <div style={{ ...fdr(0.05), marginTop: 8 }}>
              <p style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '.5px', marginBottom: 10 }}>작동 방식</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: '-0.7px' }}>3단계면 끝나요</h2>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
              <div style={{ ...fu(0.05), padding: '22px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'baseline', gap: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ccc', flexShrink: 0, width: 20 }}>01</span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#111', letterSpacing: '-0.4px', marginBottom: 4 }}>URL 붙여넣기</p>
                  <p style={{ fontSize: 13, color: '#aaa', fontWeight: 400, lineHeight: 1.5 }}>YouTube Shorts 또는 Instagram Reels 링크</p>
                </div>
              </div>
              <div style={{ ...fu(0.15), padding: '22px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'baseline', gap: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6B5CE7', flexShrink: 0, width: 20 }}>02</span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#111', letterSpacing: '-0.4px', marginBottom: 4 }}>자동 변환</p>
                  <p style={{ fontSize: 13, color: '#aaa', fontWeight: 400, lineHeight: 1.5 }}>30초 안에 네이버 SEO에 맞는 글로 완성</p>
                </div>
              </div>
              <div style={{ ...fu(0.25), padding: '22px 0', display: 'flex', alignItems: 'baseline', gap: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ccc', flexShrink: 0, width: 20 }}>03</span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#111', letterSpacing: '-0.4px', marginBottom: 4 }}>복사 후 발행</p>
                  <p style={{ fontSize: 13, color: '#aaa', fontWeight: 400, lineHeight: 1.5 }}>네이버 블로그에 붙여넣고 발행 끝</p>
                </div>
              </div>
            </div>
            <div style={{ ...fu(0.7), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#1a1a1a', color: '#fff', borderRadius: 20 }} onClick={(e) => go(4, e)}>계속하기</button>
            </div>
          </>
        );

      // ── S4: White — 네이버 에디터 미리보기 ──
      case 4:
        return (
          <>
            {dots(4, fu(0.05))}
            <div style={{ ...fu(0.05), marginTop: 8 }}>
              <p style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '.5px', marginBottom: 10 }}>완성된 포스트</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: '-0.7px' }}>이렇게 만들어져요</h2>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ ...fzm(0.05), width: '100%', borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
                {/* Naver header */}
                <div style={{ background: '#03C75A', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: '10px 10px 0 0' }}>
                  <svg width="46" height="14" viewBox="0 0 46 14"><text x="0" y="11" fontFamily="Arial" fontWeight="900" fontSize="13" fill="white">NAVER</text></svg>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.75)', fontWeight: 600 }}>블로그</span>
                  <div style={{ marginLeft: 'auto', padding: '4px 10px', background: 'rgba(255,255,255,.2)', borderRadius: 100, fontSize: 10, color: '#fff', fontWeight: 700 }}>발행</div>
                </div>
                {/* Naver body */}
                <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '0 0 10px 10px' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#111', marginBottom: 8, lineHeight: 1.4 }}>
                    헬스장 3개월 만에 몸이 달라진 진짜 이유 (초보 후기)
                  </p>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                    {['#헬스장추천', '#운동루틴', '#헬스초보'].map(tag => (
                      <span key={tag} style={{ padding: '2px 7px', background: '#f0f0f0', borderRadius: 3, fontSize: 10, color: '#555', fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <p style={{ fontSize: 11, color: '#444', lineHeight: 1.7, opacity: 0, animation: 'ob-rowIn .4s .1s both' }}>
                      안녕하세요! 오늘은 헬스장 3개월 다닌 솔직한 후기를 공유할게요.
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111', opacity: 0, animation: 'ob-rowIn .4s .22s both' }}>
                      처음엔 뭐가 뭔지도 몰랐어요
                    </p>
                    <p style={{ fontSize: 11, color: '#444', lineHeight: 1.7, opacity: 0, animation: 'ob-rowIn .4s .34s both' }}>
                      유산소만 하면 된다고 생각했는데 웨이트를 시작하고 나서부터 달라졌어요...
                    </p>
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f5f5f5', display: 'flex', gap: 14 }}>
                    <span style={{ fontSize: 10, color: '#aaa' }}>SEO <strong style={{ color: '#03C75A' }}>94점</strong></span>
                    <span style={{ fontSize: 10, color: '#aaa' }}>생성 <strong style={{ color: '#111' }}>27초</strong></span>
                    <span style={{ fontSize: 10, color: '#aaa' }}>태그 <strong style={{ color: '#111' }}>4개</strong></span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ ...fu(0.7), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#1a1a1a', color: '#fff', borderRadius: 20 }} onClick={(e) => go(5, e)}>계속하기</button>
            </div>
          </>
        );

      // ── S5: Dark — 30초 대형 숫자 ──
      case 5:
        return (
          <>
            {dots(5, fu(0.05))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ ...fu(0.05), fontSize: 13, color: 'rgba(255,255,255,.3)', fontWeight: 500, letterSpacing: '.5px', marginBottom: 20 }}>자동화</p>
              <h2 style={{ ...fu(0.15), fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.7px', lineHeight: 1.4, marginBottom: 16 }}>
                링크만 넣어두면<br />알아서 완성돼요
              </h2>
              <p style={{ ...fu(0.25), fontSize: 15, color: 'rgba(255,255,255,.4)', fontWeight: 400, lineHeight: 1.7, letterSpacing: '-0.2px' }}>
                다른 할 일 하는 동안<br />블로그 글이 자동으로 만들어집니다.
              </p>
              <div style={{ ...fu(0.35), marginTop: 32, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', gap: 32 }}>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>0원</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 3, fontWeight: 400 }}>완전 무료</p>
                </div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>자동</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 3, fontWeight: 400 }}>글 변환</p>
                </div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>SEO</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginTop: 3, fontWeight: 400 }}>검색 최적화</p>
                </div>
              </div>
            </div>
            <div style={{ ...fu(0.8), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#f0ede8', color: '#111', borderRadius: 20 }} onClick={(e) => go(6, e)}>계속하기</button>
            </div>
          </>
        );

      // ── S6: White — 검색 결과 ──
      case 6:
        return (
          <>
            {dots(6, fsl(0.05))}
            <div style={{ ...fsl(0.05), marginTop: 8 }}>
              <p style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '.5px', marginBottom: 10 }}>검색 결과</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: '-0.7px' }}>이렇게 뜨게 됩니다</h2>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
              {/* Search bar */}
              <div style={{ ...fu(0.15), border: '2px solid #e0e0e0', borderRadius: 8, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, background: '#fafafa' }}>
                <svg width="42" height="12" viewBox="0 0 42 12"><text x="0" y="10" fontFamily="Arial" fontWeight="900" fontSize="11" fill="#03C75A">NAVER</text></svg>
                <span style={{ fontSize: 13, color: '#555', flex: 1, fontWeight: 500 }}>헬스장 3개월 후기</span>
                <div style={{ width: 24, height: 24, background: '#03C75A', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </div>
              </div>
              {/* Top result */}
              <div style={{ ...fu(0.25), padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#03C75A', border: '1px solid #03C75A', padding: '1px 5px', borderRadius: 2 }}>블로그</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#03C75A', marginLeft: 'auto' }}>검색 1위</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a73e8', lineHeight: 1.4, marginBottom: 5 }}>
                  헬스장 3개월 만에 몸이 달라진 진짜 이유 (초보 후기)
                </p>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                  안녕하세요! 헬스장 3개월 다닌 솔직한 후기를 공유합니다. 처음엔 운동루틴도...
                </p>
              </div>
              {/* Second result (faded) */}
              <div style={{ ...fu(0.35), padding: '14px 0', opacity: 0.35 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', border: '1px solid #ddd', padding: '1px 5px', borderRadius: 2 }}>블로그</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#aaa', marginBottom: 4 }}>헬스장 다이어트 방법 정리</p>
                <div style={{ height: 8, borderRadius: 3, background: '#f0f0f0', width: '80%' }} />
              </div>
              {/* Stats */}
              <div style={{ ...fu(0.45), padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
                <p style={{ fontSize: 12, color: '#aaa', marginBottom: 8, fontWeight: 500 }}>이 포스트의 예상 성과</p>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: '-0.5px' }}>2,400</p>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>월 예상 방문자</p>
                  </div>
                  <div style={{ width: 1, background: '#f0f0f0' }} />
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: '#6B5CE7', letterSpacing: '-0.5px' }}>94점</p>
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>SEO 점수</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ ...fu(0.8), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#1a1a1a', color: '#fff', borderRadius: 20 }} onClick={(e) => go(7, e)}>계속하기</button>
            </div>
          </>
        );

      // ── S7: White — 무료 ──
      case 7:
        return (
          <>
            {dots(7, fu(0.05))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ ...fu(0.05), fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '.5px', marginBottom: 18 }}>가격</p>
              <h2 style={{ ...fu(0.15), fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: '-0.7px', marginBottom: 32 }}>
                완전 무료예요
              </h2>
              <div style={{ ...fu(0.25), padding: '24px', background: '#fafafa', borderRadius: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 42, fontWeight: 900, color: '#6B5CE7', letterSpacing: '-2px', marginBottom: 8 }}>0원</p>
                <p style={{ fontSize: 14, color: '#999', fontWeight: 400, lineHeight: 1.6 }}>
                  블로그 글 변환, 횟수 제한 없이<br />무료로 사용할 수 있어요.
                </p>
              </div>
              <p style={{ ...fu(0.35), fontSize: 13, color: '#bbb', lineHeight: 1.7, fontWeight: 400 }}>
                대행사에 맡기면 월 50만원 이상인 걸<br />Logos AI에서는 무료로 해결할 수 있어요.
              </p>
            </div>
            <div style={{ ...fu(0.8), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#1a1a1a', color: '#fff', borderRadius: 20 }} onClick={(e) => go(8, e)}>계속하기</button>
            </div>
          </>
        );

      // ── S8: White — 플랫폼 선택 ──
      case 8:
        return (
          <>
            {dots(8, fu(0.05))}
            <div style={{ ...fu(0.05), marginTop: 8 }}>
              <p style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '.5px', marginBottom: 10 }}>설정</p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: '-0.7px' }}>어디서 올리세요?</h2>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              {[
                { id: 'yt', title: 'YouTube Shorts', desc: '유튜브 숏폼 링크', delay: 0.05 },
                { id: 'ig', title: 'Instagram Reels · 피드', desc: '인스타그램 릴스 및 피드 링크', delay: 0.18 },
                { id: 'both', title: '둘 다', desc: 'YouTube + Instagram', delay: 0.3 },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  style={{
                    ...fsl(p.delay),
                    width: '100%', padding: '18px 20px', borderRadius: 12,
                    background: platform === p.id ? 'rgba(107,92,231,.04)' : '#fff',
                    border: `1.5px solid ${platform === p.id ? '#6B5CE7' : '#e8e8e8'}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                    fontFamily: 'inherit', textAlign: 'left', transition: 'all .18s',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 16, color: '#111', letterSpacing: '-0.3px' }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: '#bbb', marginTop: 3, fontWeight: 400 }}>{p.desc}</p>
                  </div>
                  {platform === p.id && (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: '#6B5CE7',
                      color: '#fff', fontSize: 11, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✓</div>
                  )}
                </button>
              ))}
            </div>
            <div style={{ ...fu(0.7), width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <button
                className="ob-btn"
                style={{
                  background: '#1a1a1a', color: '#fff', borderRadius: 20,
                  opacity: platform ? 1 : 0.2,
                  cursor: platform ? 'pointer' : 'default',
                }}
                onClick={(e) => { if (platform) go(9, e); }}
              >시작하기</button>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#bbb', fontFamily: 'inherit', padding: 10, letterSpacing: '-0.2px' }}
                onClick={(e) => go(9, e as unknown as React.MouseEvent<HTMLButtonElement>)}
              >건너뛰기</button>
            </div>
          </>
        );

      // ── S9: Purple — 마지막 CTA ──
      case 9:
        return (
          <>
            {dots(9, fu(0.05))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ ...fu(0.05), fontSize: 13, color: 'rgba(255,255,255,.45)', fontWeight: 500, letterSpacing: '.5px', marginBottom: 20 }}>Logos AI</p>
              <h1 style={{ ...fu(0.15), fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
                이제 찍기만<br />하면 됩니다.
              </h1>
              <p style={{ ...fu(0.25), fontSize: 15, color: 'rgba(255,255,255,.5)', fontWeight: 400, lineHeight: 1.8, letterSpacing: '-0.2px' }}>
                URL을 붙여넣으면<br />네이버 블로그 글이 완성됩니다.<br />복사해서 바로 발행하세요.
              </p>
            </div>
            <div style={{ ...fu(0.7), width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button className="ob-btn" style={{ background: '#f0ede8', color: '#111', borderRadius: 20 }} onClick={handleExit}>
                Logos AI 시작하기
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: BG[screen],
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
        transition: exiting ? 'opacity 0.45s ease, transform 0.45s ease' : undefined,
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {/* Ripple */}
      {ripple && (
        <div style={{
          position: 'absolute',
          width: ripple.maxR * 2,
          height: ripple.maxR * 2,
          left: ripple.x - ripple.maxR,
          top: ripple.y - ripple.maxR,
          borderRadius: '50%',
          background: ripple.color,
          transform: 'scale(0)',
          animation: 'ob-ripple 0.5s cubic-bezier(.36,.07,.19,.97) forwards',
          opacity: ripple.fading ? 0 : 1,
          transition: ripple.fading ? 'opacity 0.2s' : 'none',
          zIndex: 60,
          pointerEvents: 'none',
        }} />
      )}

      {/* Back button */}
      {screen > 0 && (
        <button
          onClick={() => { if (!transitioning) setScreen(s => s - 1); }}
          style={{
            position: 'absolute',
            top: 'calc(14px + env(safe-area-inset-top, 0px))',
            left: 20,
            zIndex: 70,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={[0,1,2,5,9].includes(screen) ? '#fff' : '#111'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Screen */}
      <div
        key={screen}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          padding: 'calc(48px + env(safe-area-inset-top, 0px)) 32px calc(64px + env(safe-area-inset-bottom, 0px))',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {renderScreen()}
      </div>
    </div>
  );
}
