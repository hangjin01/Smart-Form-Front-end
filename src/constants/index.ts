import { Crop, LogEntry, WelfarePost } from '../types';

export const INITIAL_CROP_TYPES: Crop[] = [
    {
        id: 'strawberry',
        name: '딸기',
        variety: '설향',
        optimalTemp: '20~25',
        optimalHumidity: '60~70',
        optimalSoil: '50~60',
        optimalCo2: '600~800',
        optimalLux: '20k~30k'
    },
    {
        id: 'tomato',
        name: '토마토',
        variety: '완숙',
        optimalTemp: '22~27',
        optimalHumidity: '65~75',
        optimalSoil: '60~70',
        optimalCo2: '700~900',
        optimalLux: '30k~50k'
    },
    {
        id: 'paprika',
        name: '파프리카',
        variety: '레드',
        optimalTemp: '20~25',
        optimalHumidity: '60~80',
        optimalSoil: '55~65',
        optimalCo2: '500~700',
        optimalLux: '25k~35k'
    }
];

export const WELFARE_NEWS = [
    { id: 1, type: '지원금', title: '2024년 스마트팜 ICT 융복합 확산사업 공고', dDay: 'D-5', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 2, type: '교육', title: '청년농업인 경영실습 임대농장 모집', dDay: 'D-12', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { id: 3, type: '복지', title: '농업인 국민연금 보험료 최대 50% 지원', dDay: '상시', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 4, type: '금융', title: '농어촌진흥기금 저금리(1%) 융자 신청', dDay: '마감임박', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
];

export const ALL_WELFARE_POSTS: WelfarePost[] = [
    ...WELFARE_NEWS,
    { id: 5, type: '교육', title: '2024년 미래농업대학 신입생 모집 요강', dDay: 'D-20', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', date: '2024.03.15', desc: '미래 농업을 선도할 전문 인력 양성을 위한 2024년도 신입생을 모집합니다. 전액 국비 지원 및 기숙사 제공.' },
    { id: 6, type: '지원금', title: '친환경 비료 지원 사업 추가 신청 안내', dDay: 'D-7', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', date: '2024.03.10', desc: '지속 가능한 농업 환경 조성을 위해 유기질 비료 및 토양 개량제 구입비를 지원합니다.' },
    { id: 7, type: '복지', title: '여성농업인 행복바우처 신청 접수', dDay: 'D-15', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', date: '2024.03.05', desc: '여성 농업인의 삶의 질 향상을 위한 문화/복지 활동 비용을 지원합니다. (연간 20만원 상당)' },
    { id: 8, type: '기술', title: '스마트팜 데이터 활용 컨설팅 참여 농가 모집', dDay: 'D-30', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', date: '2024.03.01', desc: '데이터 기반의 정밀 농업 실현을 위해 전문가가 직접 방문하여 생육 데이터 분석 및 환경 제어 컨설팅을 제공합니다.' },
    { id: 9, type: '금융', title: '귀농 창업 및 주택 구입 지원 사업', dDay: '상시', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', date: '2024.02.20', desc: '귀농인의 안정적인 농촌 정착을 위해 창업 자금(최대 3억원) 및 주택 구입 자금(최대 7,500만원)을 융자 지원합니다.' },
];

export const MOCK_SYSTEM_LOGS: LogEntry[] = [
    { id: 101, type: 'control', message: '자동 측창 닫힘 (외부 온도 저하)', timestamp: '오후 8:45:12', status: 'success' },
    { id: 102, type: 'ai', message: 'AI 생육 분석 리포트 생성 완료', timestamp: '오후 8:30:00', status: 'info' },
    { id: 103, type: 'sensor', message: 'CO2 농도 정상 범위 도달', timestamp: '오후 8:15:22', status: 'success' },
    { id: 104, type: 'control', message: '순환 환기팬 작동 시작', timestamp: '오후 8:10:05', status: 'success' },
    { id: 105, type: 'warning', message: '외부 습도 85% 초과 경고', timestamp: '오후 8:05:00', status: 'warning' },
    { id: 106, type: 'system', message: '클라우드 데이터 동기화 완료', timestamp: '오후 8:00:00', status: 'info' },
    { id: 107, type: 'control', message: '스마트 관수 시스템 대기 모드 전환', timestamp: '오후 7:45:30', status: 'success' },
    { id: 108, type: 'user', message: '사용자(JD) 접속 확인', timestamp: '오후 7:30:15', status: 'info' },
    { id: 109, type: 'sensor', message: '일조량 부족 감지 (LED 자동 점등)', timestamp: '오후 7:15:00', status: 'warning' },
    { id: 110, type: 'control', message: '생장 LED 켜짐', timestamp: '오후 7:15:01', status: 'success' },
    { id: 111, type: 'system', message: '시스템 부팅 완료', timestamp: '오후 7:00:00', status: 'info' },
];

export const DEFAULT_PROMPT_TEMPLATE = `
당신은 스마트팜 AI 농업 컨설턴트입니다. 아래 센서 데이터를 분석하고 현재 작물 상태와 개선 방안을 제안해주세요.

작물: {{crop}}
환경 데이터:
- 온도: {{temp}}°C
- 습도: {{humidity}}%
- 토양 수분: {{soil}}%
- CO2: {{co2}}ppm
- 일조량: {{lux}}lux

현재 작동 중인 장치: {{devices}}

분석 결과와 조언을 간단명료하게 작성해주세요.
`.trim();
