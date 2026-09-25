import type { Network, PassageInput, Query } from './solver';

/** 示例拓扑：某展馆环状供水管网 */
export const SAMPLE_NETWORK: Network = {
  nodes: [
    '市政供水S1',
    '备用水箱S2',
    '环管N1',
    '环管N2',
    '环管N3',
    '环管N4',
    '展厅A',
    '展厅B',
    '卫生间',
    '咖啡厅',
    '设备间',
  ],
  pipes: [
    { id: 'P1', from: '展厅A', to: '环管N2' },
    { id: 'P2', from: '咖啡厅', to: '环管N3' },
    { id: 'P3', from: '设备间', to: '环管N4' },
  ],
  valvedPipes: [
    { id: 'V01', from: '市政供水S1', to: '环管N1', open: true },
    { id: 'V02', from: '备用水箱S2', to: '环管N4', open: true },
    { id: 'V03', from: '环管N1', to: '环管N2', open: true },
    { id: 'V04', from: '环管N2', to: '环管N3', open: true },
    { id: 'V05', from: '环管N3', to: '环管N4', open: true },
    { id: 'V06', from: '环管N4', to: '环管N1', open: true },
    { id: 'V07', from: '卫生间', to: '环管N3', open: true },
    { id: 'V08', from: '展厅B', to: '环管N1', open: true },
    { id: 'V09', from: '展厅B', to: '环管N4', open: false },
  ],
};

export const SAMPLE_QUERY: Query = {
  supplies: ['市政供水S1', '备用水箱S2'],
  leak: '环管N2',
  outlets: ['展厅B', '咖啡厅', '卫生间'],
};

/** 示例供水能力核验数值：各供水点供给上限（非负整数）。 */
export const SAMPLE_SUPPLY_CAPS: Record<string, number> = {
  市政供水S1: 5,
  备用水箱S2: 3,
};

/** 示例供水能力核验数值：各保供出口需求量（非负整数）。 */
export const SAMPLE_OUTLET_DEMANDS: Record<string, number> = {
  展厅B: 2,
  咖啡厅: 1,
  卫生间: 2,
};

/** 示例重点出口优先配水：展厅B 为重点保供出口，其余为普通。 */
export const SAMPLE_PRIORITY_OUTLETS: string[] = ['展厅B'];

/** 示例阀门状态异常定位：现场观测有水的节点。 */
export const SAMPLE_WET_NODES: string[] = ['咖啡厅', '卫生间'];

/**
 * 示例阀门状态异常定位：现场观测无水的节点。
 * 登记状态中展厅B 经 V08 供水（应为有水），现场却无水 → 可定位为 V08 实际已关。
 */
export const SAMPLE_DRY_NODES: string[] = ['展厅B'];

/**
 * 示例单阀异常观测点规划：候选观测节点。
 * 单翻 V01~V06 时环上分支签名一致（不可区分组），展厅B 可辨 V08、卫生间可辨 V07，
 * 最少观测点 {卫生间、展厅B} 即可区分全部三组。
 */
export const SAMPLE_OBSERVER_CANDIDATES: string[] = [
  '展厅A',
  '展厅B',
  '咖啡厅',
  '卫生间',
  '设备间',
];

/**
 * 示例关阀作业路线：作业通道 JSON（独立于供水管网的步行通道网络）。
 * 环形主通道 T1-T2-T3-T4-T1（各 5 分钟），各出入口经 2 分钟通道连到主环平台；
 * 示例最优关阀方案为关闭 V03、V04，从「仓库入口」出发：
 * 仓库入口→T1（3）→T2（5，关 V03）→T3（5，关 V04）→T2→T1（10）→仓库入口（3），
 * 合计 26 分钟；两个操作顺序同为 26 分钟，按阀门编号序列字典序取 V03 先关。
 */
export const SAMPLE_ROUTE_PASSAGE: PassageInput = {
  waypoints: ['仓库入口', '平台T1', '平台T2', '平台T3', '平台T4', '展厅A入口'],
  passages: [
    { from: '平台T1', to: '平台T2', minutes: 5 },
    { from: '平台T2', to: '平台T3', minutes: 5 },
    { from: '平台T3', to: '平台T4', minutes: 5 },
    { from: '平台T4', to: '平台T1', minutes: 5 },
    { from: '仓库入口', to: '平台T1', minutes: 3 },
    { from: '展厅A入口', to: '平台T2', minutes: 2 },
  ],
  valveWaypoints: {
    V01: '平台T1',
    V02: '平台T4',
    V03: '平台T2',
    V04: '平台T3',
    V05: '平台T3',
    V06: '平台T1',
    V07: '平台T3',
    V08: '平台T1',
    V09: '平台T4',
  },
};

/** 示例关阀作业路线：出发路点。 */
export const SAMPLE_ROUTE_START = '仓库入口';
