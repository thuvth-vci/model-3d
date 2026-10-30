// 语言切换模块：越南语(vi) / 中文(zh) 简单双语配置
import { ref } from 'vue'

// 当前语言，默认越南语，点击按钮即可切换
export const currentLang = ref('vi')

export function toggleLang () {
    currentLang.value = currentLang.value === 'vi' ? 'zh' : 'vi'
}

const dict = {
    appTitle: { vi: 'Nền tảng song sinh số nhà máy xử lý nước thải', zh: '污水处理厂智能数字孪生平台' },
    // 左侧面板
    powerConsumption: { vi: 'Tình hình tiêu thụ điện', zh: '电耗情况' },
    monthlyPower: { vi: 'Tổng điện tiêu thụ tháng (kw-h)', zh: '月度总电耗（kw-h）' },
    dailyAvgPower: { vi: 'Điện tiêu thụ TB/ngày (kw-h)', zh: '日均电耗（kw-h）' },
    perTonPower: { vi: 'Điện tiêu thụ/tấn nước (kw-h)', zh: '吨水电耗（kw-h）' },
    momRatio: { vi: 'So tháng trước', zh: '环比' },
    yoyRatio: { vi: 'So cùng kỳ', zh: '同比' },
    waterRealtime: { vi: 'Dữ liệu chất lượng nước thời gian thực', zh: '水质实时数据' },
    item: { vi: 'Chỉ tiêu', zh: '项目' },
    influent: { vi: 'Nước vào', zh: '进水' },
    effluent: { vi: 'Nước ra', zh: '出水' },
    todayTrend: { vi: 'Xu hướng chất lượng nước hôm nay', zh: '今日水质趋势' },
    ammonia: { vi: 'Amoni (NH3-N)', zh: '氨氮' },
    // 右侧面板
    sewageHandling: { vi: 'Tình hình xử lý nước thải', zh: '污水处理情况' },
    todayInflow: { vi: 'Lượng nước vào tích lũy hôm nay', zh: '今日累计进水量' },
    todayOutflow: { vi: 'Lượng nước ra tích lũy hôm nay', zh: '今日累计出水量' },
    designScale: { vi: 'Quy mô thiết kế', zh: '计划规模' },
    loadRate: { vi: 'Tỷ lệ tải', zh: '负荷率' },
    deviceRuntime: { vi: 'Thời gian vận hành thiết bị', zh: '设备运行时间' },
    seq: { vi: 'STT', zh: '序号' },
    deviceName: { vi: 'Tên thiết bị', zh: '设备名称' },
    continuousRun: { vi: 'Chạy liên tục', zh: '持续运行' },
    totalRun: { vi: 'Tổng thời gian chạy', zh: '累计运行' },
    inletPumpRoom: { vi: 'Trạm bơm nước vào khu 1......', zh: '进水泵房区间1号......' },
    alarmInfo: { vi: 'Thông tin cảnh báo', zh: '报警信息' },
    criticalAlarm: { vi: 'Cảnh báo quan trọng', zh: '重要报警' },
    normalAlarm: { vi: 'Cảnh báo thông thường', zh: '一般报警' },
    reminderAlarm: { vi: 'Cảnh báo nhắc nhở', zh: '提醒报警' },
    alarmTime: { vi: 'Thời gian cảnh báo', zh: '报警时间' },
    alarmLevel: { vi: 'Mức độ cảnh báo', zh: '报警等级' },
    alarmContent: { vi: 'Nội dung cảnh báo', zh: '报警内容' },
    alarmValue: { vi: 'Giá trị thực tế/Ngưỡng', zh: '实时值阈值' },
    outletPh: { vi: 'pH nước ra', zh: '出水pH' },
    // Menu dưới
    menuHome: { vi: 'Trang chủ', zh: '首页' },
    menuHistory: { vi: 'Dữ liệu lịch sử', zh: '历史数据' },
    menuCraft: { vi: 'Hỗ trợ quy trình', zh: '工艺辅助' },
    menuInspect: { vi: 'Tuần tra', zh: '巡检' },
    // Biểu đồ
    inletCOD: { vi: 'COD nước vào', zh: '进水口COD' },
    outletCOD: { vi: 'COD nước ra', zh: '出水口COD' },
}

// 翻译函数，key不存在时原样返回，方便排查
export function t (key) {
    const entry = dict[key]
    if (!entry) return key
    return entry[currentLang.value] || entry.zh
}
