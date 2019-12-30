import Main from '@/views/main.vue';

const appRouter = [
    {
        path: '/staffsalesorder',
        icon: 'pricetags',
        name: 'staffsalesorder',
        title: '内购管理',
        component: Main,
        children: [
            {
                path: 'list',
                title: '内购申请',
                name: 'staffsalesorder_list',
                component: () =>
                    import ('@/views/staff-sales-order/list.vue'),
                hidden: false
            },
            {
                path: 'add',
                title: '新增内购申请',
                name: 'staffsalesorder_add',
                component: () =>
                    import ('@/views/staff-sales-order/add.vue'),
                hidden: true
            },
            {
                path: 'detail/:orderId',
                title: '查看内购申请',
                name: 'staffsalesorder_detail',
                component: () =>
                    import ('@/views/staff-sales-order/detail.vue'),
                hidden: true
            },
            {
                path: 'check',
                title: '内购审核',
                name: 'staffsalesorder_check',
                component: () =>
                    import ('@/views/staff-sales-order/check.vue'),
                hidden: false
            },
            {
                path: 'report',
                title: '内购申请记录',
                name: 'staffsalesorder_report',
                component: () =>
                    import ('@/views/staff-sales-order/report.vue'),
                hidden: false
            },
            {
                path: 'return_report/:orderId',
                title: '内购退货报表',
                name: 'staffsalesorder_return_report',
                component: () =>
                    import ('@/views/staff-sales-order/return_report.vue'),
                hidden: true
            },
            {
                path: 'return/:orderId',
                title: '内购退货申请详情',
                name: 'staffsalesorder_return',
                component: () =>
                    import ('@/views/staff-sales-order/template/return.vue'),
                hidden: true
            },
            {
                path: 'inReturn',
                title: '内购退货',
                name: 'inReturn',
                component: () =>
                    import ('@/views/staff-sales-order/template/inReturn.vue'),
                hidden: false
            },
            {
                path: 'inReturnDetail',
                title: '内购退货详情',
                name: 'inReturnDetail',
                component: () =>
                    import ('@/views/staff-sales-order/template/inReturnDetail.vue'),
                hidden: true
            }
        ]
    },
    {
        path: '/data',
        icon: 'pricetags',
        name: 'data',
        title: '人力资源',
        component: Main,
        children: [
            {
                path: 'department',
                title: '部门管理',
                name: 'department',
                component: () =>
                    import ('@/views/system/department/department.vue'),
                hidden: false
            },
            {
                path: 'post',
                title: '岗位管理',
                name: 'post',
                component: () =>
                    import ('@/views/system/post/post.vue'),
                hidden: false
            },
            {
                path: 'employee',
                title: '员工档案',
                name: 'employee',
                component: () =>
                    import ('@/views/system/employee/list.vue'),
                hidden: false
            },
            {
                path: 'performance-parameter',
                title: '绩效参数',
                name: 'performance-parameter',
                component: () =>
                    import ('@/views/system/performance-examine/performance-parameter.vue'),
                hidden: false
            },
            {
                path: 'performance-examine',
                title: '战友成长记录',
                name: 'performance-examine',
                component: () =>
                    import ('@/views/system/performance-examine/list.vue'),
                hidden: false
            },
            {
                path: 'performance-examine-detail/:id',
                title: '战友成长记录详情',
                name: 'performance-examine-detail',
                component: () =>
                    import ('@/views/system/performance-examine/detail.vue'),
                hidden: true
            },
            {
                path: 'performance-target',
                title: '考核指标',
                name: 'performance-target',
                component: () =>
                    import ('@/views/system/performance-examine/target.vue'),
                hidden: false
            },
            {
                path: 'department-review',
                title: '部门考核',
                name: 'department-review',
                component: () =>
                    import ('@/views/system/performance-examine/department-review.vue'),
                hidden: false
            },
            {
                path: 'department-review-detail/:reviewId',
                title: '部门考核详情',
                name: 'department-review-detail',
                component: () =>
                    import ('@/views/system/performance-examine/department-review-detail.vue'),
                hidden: true
            },
            {
                path: 'employee-review',
                title: '员工考核',
                name: 'employee-review',
                component: () =>
                    import ('@/views/system/performance-examine/employee-review.vue'),
                hidden: false
            },
            {
                path: 'employee-review-detail/:reviewId',
                title: '个人考核详情',
                name: 'employee-review-detail',
                component: () =>
                    import ('@/views/system/performance-examine/employee-review-detail.vue'),
                hidden: true
            },
            {
                path: 'review-list',
                title: '成绩明细',
                name: 'review-list',
                component: () =>
                    import ('@/views/system/performance-examine/review-list.vue'),
                hidden: false
            },
            {
                path: 'summary-results',
                title: '成绩汇总',
                name: 'summary-results',
                component: () =>
                    import ('@/views/system/performance-examine/summary-results.vue'),
                hidden: false
            },
        ]
    },
    {
        path: '/staffsamplecoat',
        icon: 'person-add',
        name: 'staffsamplecoat',
        title: '内部样衣',
        component: Main,
        children: [
            {
                path: 'list',
                title: '内部样衣申请',
                name: 'staffsamplecoat_list',
                component: () =>
                    import ('@/views/staff-sample-coat/list.vue'),
                hidden: false
            },
            {
                path: 'add',
                title: '新增样衣',
                name: 'staffsamplecoat_add',
                component: () =>
                    import ('@/views/staff-sample-coat/add.vue'),
                hidden: true
            },
            {
                path: 'detail/:orderId',
                title: '查看内部样衣',
                name: 'staffsamplecoat_detail',
                component: () =>
                    import ('@/views/staff-sample-coat/detail.vue'),
                hidden: true
            },
            {
                path: 'check',
                title: '内部样衣审核',
                name: 'staffsamplecoat_check',
                component: () =>
                    import ('@/views/staff-sample-coat/check.vue'),
                hidden: false
            },
            {
                path: 'edit/:orderId',
                title: '编辑内部样衣',
                name: 'staffsamplecoat_edit',
                component: () =>
                    import ('@/views/staff-sample-coat/edit.vue'),
                hidden: true
            },
            {
                path: 'report',
                title: '申请记录',
                name: 'staffsamplecoat_report',
                component: () =>
                    import ('@/views/staff-sample-coat/report.vue'),
                hidden: false
            },
        ]
    },
    {
        path: '/factorysamplecoat',
        icon: 'person-add',
        name: 'factorysamplecoat',
        title: '工厂样衣',
        component: Main,
        children: [
            {
                path: 'list',
                title: '工厂样衣申请',
                name: 'factorysamplecoat_list',
                component: () =>
                    import ('@/views/factory-sample-coat/list.vue'),
                hidden: false
            },
            {
                path: 'add',
                title: '新增工厂样衣',
                name: 'factorysamplecoat_add',
                component: () =>
                    import ('@/views/factory-sample-coat/add.vue'),
                hidden: true
            },
            {
                path: 'detail/:orderId',
                title: '工厂样衣详细',
                name: 'factorysamplecoat_detail',
                component: () =>
                    import ('@/views/factory-sample-coat/detail.vue'),
                hidden: true
            },
            {
                path: 'report',
                title: '领购记录',
                name: 'factorysamplecoat_report',
                component: () =>
                    import ('@/views/factory-sample-coat/report.vue'),
                hidden: false
            }
        ]
    },
    {
        path: '/agencysalesorder',
        icon: 'person-add',
        name: 'agencysalesorder',
        title: '代销管理',
        component: Main,
        children: [
            {
                path: 'list',
                title: '代销下单',
                name: 'agencysalesorder_list',
                component: () =>
                    import ('@/views/agency-sales-order/list.vue'),
                hidden: false
            },
            {
                path: 'add',
                title: '新增代销下单',
                name: 'agencysalesorder_add',
                component: () =>
                    import ('@/views/agency-sales-order/add.vue'),
                hidden: true
            },
            {
                path: 'detail/:orderId',
                title: '代销下单详细',
                name: 'agencysalesorder_detail',
                component: () =>
                    import ('@/views/agency-sales-order/detail.vue'),
                hidden: true
            },
            {
                path: 'agencysalesorder_report',
                title: '代销统计',
                name: 'agencysalesorder_report',
                component: () =>
                    import ('@/views/agency-sales-order/report.vue'),
                hidden: false
            },
            {
                path: 'return/:orderId',
                title: '代销退货',
                name: 'agencysalesorder_return',
                component: () =>
                    import ('@/views/staff-sales-order/template/return.vue'),
                hidden: true
            },
            {
                path: 'return_report',
                title: '代销退货报表',
                name: 'agencysalesorder_report2',
                component: () =>
                    import ('@/views/agency-sales-order/return_report.vue'),
                hidden: true
            },
        ]
    },
    {
        path: '/wmskpi',
        icon: 'person-add',
        name: 'wmskpi',
        title: '物流绩效',
        component: Main,
        children: [
            {
                path: 'Logistics_mgmt_kpi',
                title: '管理KPI-中心',
                name: 'Logistics_mgmt_kpi',
                component: () =>
                    import ('@/views/wms-kpi/Logistics_mgmt_kpi.vue'),
                hidden: false
            },
            {
                path: 'basiclevel_mgmt',
                title: '基层KPI-维护',
                name: 'basiclevel_mgmt',
                component: () =>
                    import ('@/views/wms-kpi/basiclevel_mgmt.vue'),
                hidden: false
            },
            {
                path: 'basiclevel_report',
                title: '基层KPI-管理',
                name: 'basiclevel_report',
                component: () =>
                    import ('@/views/wms-kpi/basiclevel_report.vue'),
                hidden: false
            },
            {
                path: 'stockout_error_list',
                title: '发货出错管理',
                name: 'stockout_error_list',
                component: () =>
                    import ('@/views/wms-kpi/stockout_error_list.vue'),
                hidden: false
            },
            {
                path: 'inventory_error_list',
                title: '库位出错管理',
                name: 'inventory_error_list',
                component: () =>
                    import ('@/views/wms-kpi/inventory_error_list.vue'),
                hidden: false
            }
        ]
    },
    {
        path: '/shopoperation',
        icon: 'person-add',
        name: 'shopoperation',
        title: '店铺运营',
        component: Main,
        children: [
            {
                path: 'quickrepeatorder_salesPlan',
                title: '销售运营计划',
                name: 'quickrepeatorder_salesPlan',
                component: () =>
                    import ('@/views/quick-repeat-order/salesPlan.vue'),
                hidden: false
            },
            {
                path: 'quickrepeatorder_salesPlanEdit',
                title: '活动明细',
                name: 'quickrepeatorder_salesPlanEdit',
                component: () =>
                    import ('@/views/quick-repeat-order/salesPlanEdit.vue'),
                hidden: true
            },
            {
                path: 'quickrepeatorder_orderBudget',
                title: '采购预算',
                name: 'quickrepeatorder_orderBudget',
                component: () =>
                    import ('@/views/quick-repeat-order/orderBudget.vue'),
                hidden: false
            },
            {
                path: 'quickrepeatorder_brand',
                title: '品牌权限',
                name: 'quickrepeatorder_brand',
                component: () =>
                    import ('@/views/quick-repeat-order/brandJurisdiction.vue'),
                hidden: false
            },
            {
                path: 'quickrepeatorder_warn',
                title: '返单预警',
                name: 'quickrepeatorder_warn',
                component: () =>
                    import ('@/views/quick-repeat-order/warn.vue'),
                hidden: false
            },
            {
                path: 'quickrepeatorder_add',
                title: '快捷返单',
                name: 'quickrepeatorder_add',
                component: () =>
                    import ('@/views/quick-repeat-order/add.vue'),
                hidden: false
            },
            {
                path: 'quickrepeatorder_add_bylink',
                title: '快捷返单',
                name: 'quickrepeatorder_add_bylink',
                component: () =>
                    import ('@/views/quick-repeat-order/add_bylink.vue'),
                hidden: true
            },
            {
                path: 'quickrepeatorder_edit/:orderId',
                title: '编辑快捷返单',
                name: 'quickrepeatorder_edit',
                component: () =>
                    import ('@/views/quick-repeat-order/edit.vue'),
                hidden: true
            },
            {
                path: 'quickrepeatorder_list',
                title: '返单记录',
                name: 'quickrepeatorder_list',
                component: () =>
                    import ('@/views/quick-repeat-order/list.vue'),
                hidden: false
            },
            {
                path: 'quickrepeatorder_detail/:orderId',
                title: '快捷返单详细',
                name: 'quickrepeatorder_detail',
                component: () =>
                    import ('@/views/quick-repeat-order/detail.vue'),
                hidden: true
            },
            {
                path: 'quickrepeatorder_report/:orderId',
                title: '返单报表',
                name: 'quickrepeatorder_report',
                component: () =>
                    import ('@/views/quick-repeat-order/report.vue'),
                hidden: true
            },
            {
                path: 'quickrepeatorder_statistical',
                title: '返单统计',
                name: 'quickrepeatorder_statistical',
                component: () =>
                    import ('@/views/quick-repeat-order/statistical.vue'),
                hidden: false
            },
            {
                path: 'presale_parameters',
                title: '预售设置',
                name: 'presale_parameters',
                component: () =>
                    import ('@/views/presale-management/presale-parameters/list.vue'),
                hidden: true
            },
            {
                path: 'presale_parameters_add',
                title: '新增预售参数',
                name: 'presale_parameters_add',
                component: () =>
                    import ('@/views/presale-management/presale-parameters/add.vue'),
                hidden: true
            },
            {
                path: 'presale_parameters_edit/:Id',
                title: '编辑预售参数',
                name: 'presale_parameters_edit',
                component: () =>
                    import ('@/views/presale-management/presale-parameters/edit.vue'),
                hidden: true
            },
            {
                path: 'presale_parameters_detail/:Id',
                title: '预售参数详情',
                name: 'presale_parameters_detail',
                component: () =>
                    import ('@/views/presale-management/presale-parameters/detail.vue'),
                hidden: true
            },
            {
                path: 'presale_pool_list',
                title: '预售池',
                name: 'presale_pool_list',
                component: () =>
                    import ('@/views/presale-management/presale-pool/list.vue'),
                hidden: false
            },
            {
                path: 'presale_pool_add/:goodsNo/:brandId?/:orderNo?',
                title: '提交预售池',
                name: 'presale_pool_add',
                component: () =>
                    import ('@/views/presale-management/presale-pool/add.vue'),
                hidden: true
            },
            {
                path: 'presale_pool_detail/:goodsNo/:brandId?/:orderNo?',
                title: '预售池明细',
                name: 'presale_pool_detail',
                component: () =>
                    import ('@/views/presale-management/presale-pool/detail.vue'),
                hidden: true
            },
            {
                path: 'presale_strategy_list',
                title: '预售策略',
                name: 'presale_strategy_list',
                component: () =>
                    import ('@/views/presale-management/presale-strategy/list.vue'),
                hidden: false
            },
            {
                path: 'presale_strategy_modify/:orderCode',
                title: '修改预售策略',
                name: 'presale_strategy_modify',
                component: () =>
                    import ('@/views/presale-management/presale-strategy/modify.vue'),
                hidden: true
            },
            {
                path: 'presale_strategy_detail/:orderCode',
                title: '预售策略明细',
                name: 'presale_strategy_detail',
                component: () =>
                    import ('@/views/presale-management/presale-strategy/detail.vue'),
                hidden: true
            },
            {
                path: 'production_order_list',
                title: '生产单跟进',
                name: 'production_order_list',
                component: () =>
                    import ('@/views/presale-management/production_order/list.vue'),
                hidden: true
            },
            {
                path: 'production_order_detail/:orderId',
                title: '生产单明细',
                name: 'production_order_detail',
                component: () =>
                    import ('@/views/presale-management/production_order/detail.vue'),
                hidden: true
            },
            {
                path: 'production_order_log',
                title: '生产单日志',
                name: 'production_order_log',
                component: () =>
                    import ('@/views/presale-management/production_order/log.vue'),
                hidden: true
            },
        ]
    },
    {
        path: '/salesManagement',
        icon: 'person-add',
        name: 'salesManagement',
        title: '订单管理',
        component: Main,
        children: [
            {
                path: 'returnReason',
                title: '退货原因',
                name: 'returnReason',
                component: () =>
                    import ('@/views/sales-management/sales-order/returnReason.vue'),
                hidden: false
            },
            {
                path: 'returnAudit',
                title: '退货审核',
                name: 'returnAudit',
                component: () =>
                    import ('@/views/sales-management/sales-order/returnAudit.vue'),
                hidden: false
            },
            {
                path: 'testGetorGive',
                title: '测试收货发货',
                name: 'testGetorGive',
                component: () =>
                    import ('@/views/sales-management/sales-order/experience.vue'),
                hidden: false
            },
            {
                path: 'auditDetail',
                title: '审核明细',
                name: 'auditDetail',
                component: () =>
                    import ('@/views/sales-management/sales-order/auditDetail.vue'),
                hidden: true
            },
            {
                path: 'salesOrder',
                title: '爱库存订单',
                name: 'salesorder_list',
                component: () =>
                    import ('@/views/sales-management/sales-order/list.vue'),
                hidden: false
            },
            {
                path: 'salesorder_report',
                title: '爱库存销售统计',
                name: 'salesorder_report',
                component: () =>
                    import ('@/views/sales-management/sales-order/report.vue'),
                hidden: false
            },
            {
                path: 'haoyiku_list',
                title: '好衣库订单',
                name: 'haoyiku_list',
                component: () =>
                    import ('@/views/sales-management/haoyiku/list.vue'),
                hidden: false
            },
            {
                path: 'haoyiku_detail/:orderId',
                title: '好衣库订单详情',
                name: 'haoyiku_detail',
                component: () =>
                    import ('@/views/sales-management/haoyiku/detail.vue'),
                hidden: true
            },
            {
                path: 'haoyiku_detail_report',
                title: '好衣库销售统计',
                name: 'haoyiku_report',
                component: () =>
                    import ('@/views/sales-management/haoyiku/report.vue'),
                hidden: false
            },
            {
                path: 'bbc_list',
                title: '宝贝仓订单',
                name: 'bbc_list',
                component: () =>
                    import ('@/views/sales-management/bbc/list.vue'),
                hidden: false
            },
            {
                path: 'bbc_detail/:orderId',
                title: '宝贝仓订单详情',
                name: 'bbc_detail',
                component: () =>
                    import ('@/views/sales-management/bbc/detail.vue'),
                hidden: true
            },
            {
                path: 'bbc_detail_report',
                title: '宝贝仓销售统计',
                name: 'bbc_report',
                component: () =>
                    import ('@/views/sales-management/bbc/report.vue'),
                hidden: false
            },
            {
                path: 'suning_list',
                title: '苏宁特卖订单',
                name: 'suning_list',
                component: () =>
                    import ('@/views/sales-management/suning/list.vue'),
                hidden: false
            },
            {
                path: 'suning_detail/:orderId',
                title: '苏宁特卖订单详情',
                name: 'suning_detail',
                component: () =>
                    import ('@/views/sales-management/suning/detail.vue'),
                hidden: true
            },
            {
                path: 'suning_detail_report',
                title: '苏宁特卖销售统计',
                name: 'suning_report',
                component: () =>
                    import ('@/views/sales-management/suning/report.vue'),
                hidden: false
            },
            {
                path: 'sportjx_list',
                title: '头号买手订单',
                name: 'sportjx_list',
                component: () =>
                    import ('@/views/sales-management/sportjx/list.vue'),
                hidden: false
            },
            {
                path: 'sportjx_detail/:orderId',
                title: '头号买手订单详情',
                name: 'sportjx_detail',
                component: () =>
                    import ('@/views/sales-management/sportjx/detail.vue'),
                hidden: true
            },
            {
                path: 'sportjx_detail_report',
                title: '头号买手销售统计',
                name: 'sportjx_report',
                component: () =>
                    import ('@/views/sales-management/sportjx/report.vue'),
                hidden: false
            },
            {
                path: 'dalingjia_list',
                title: '达令家订单',
                name: 'dalingjia_list',
                component: () =>
                    import ('@/views/sales-management/dalingjia/list.vue'),
                hidden: false
            },
            {
                path: 'dalingjia_detail/:orderId',
                title: '达令家订单详情',
                name: 'dalingjia_detail',
                component: () =>
                    import ('@/views/sales-management/dalingjia/detail.vue'),
                hidden: true
            },
            {
                path: 'dalingjia_detail_report',
                title: '达令家销售统计',
                name: 'dalingjia_report',
                component: () =>
                    import ('@/views/sales-management/dalingjia/report.vue'),
                hidden: false
            },
            {
                path: 'xiaoxiaobao_list',
                title: '小小包订单',
                name: 'xiaoxiaobao_list',
                component: () =>
                    import ('@/views/sales-management/xiaoxiaobao/list.vue'),
                hidden: false
            },
            {
                path: 'xiaoxiaobao_detail/:orderId',
                title: '小小包订单详情',
                name: 'xiaoxiaobao_detail',
                component: () =>
                    import ('@/views/sales-management/xiaoxiaobao/detail.vue'),
                hidden: true
            },
            {
                path: 'xiaoxiaobao_detail_report',
                title: '小小包销售统计',
                name: 'xiaoxiaobao_report',
                component: () =>
                    import ('@/views/sales-management/xiaoxiaobao/report.vue'),
                hidden: false
            },
            {
                path: 'wykl_list',
                title: '网易考拉订单',
                name: 'wykl_list',
                component: () =>
                    import ('@/views/sales-management/wykl/list.vue'),
                hidden: false
            },
            {
                path: 'wykl_detail/:orderId',
                title: '网易考拉订单详情',
                name: 'wykl_detail',
                component: () =>
                    import ('@/views/sales-management/wykl/detail.vue'),
                hidden: true
            },
            {
                path: 'wykl_detail_report',
                title: '网易考拉销售统计',
                name: 'wykl_report',
                component: () =>
                    import ('@/views/sales-management/wykl/report.vue'),
                hidden: false
            },
        ]
    },
    {
        path: '/rpt',
        icon: 'person-add',
        name: 'report',
        title: '报表管理',
        component: Main,
        children: [
            {
                path: 'finance_base',
                title: '基础报表',
                name: 'finance_base',
                component: () =>
                    import ('@/views/report/financeBase.vue'),
                hidden: false
            },
            {
                path: 'finance_mgmt',
                title: '管理报表',
                name: 'finance_mgmt',
                component: () =>
                    import ('@/views/report/financeMgmt.vue'),
                hidden: false
            },
            {
                path: 'business_analysis',
                title: '经营分析',
                name: 'business_analysis',
                component: () =>
                    import ('@/views/report/business_analysis.vue'),
                hidden: false
            },
            {
                path: 'warehouseGL',
                title: '物流报表-瓜沥仓',
                name: 'warehouseGL',
                component: () =>
                    import ('@/views/report/warehouse-GL.vue'),
                hidden: false
            },
            {
                path: 'warehouseYL',
                title: '物流报表-宇隆仓',
                name: 'warehouseYL',
                component: () =>
                    import ('@/views/report/warehouse-YL.vue'),
                hidden: false
            },
            {
                path: 'scc_receipt',
                title: '收货相关',
                name: 'scc_receipt',
                component: () =>
                    import ('@/views/report/scc_receipt.vue'),
                hidden: false
            },
            {
                path: 'rpt_print',
                name: 'rpt_print',
                hidden: true,
                title: '报表查看',
                component: () =>
                    import ('@/views/report/template/report_detail.vue')
            },
            {
                path: 'salesReport',
                name: 'salesReport',
                hidden: true,
                title: '销售相关',
                component: () =>
                    import ('@/views/report/salesReport.vue')
            },
            {
                path: 'inventoryStock',
                name: 'inventoryStock',
                hidden: true,
                title: '库存相关',
                component: () =>
                    import ('@/views/report/inventoryStock.vue')
            },
        ]
    },
    {
        path: '/system',
        icon: 'settings',
        name: 'system',
        title: '系统管理',
        component: Main,
        children: [
            {
                path: 'user_list',
                title: '用户管理',
                name: 'user_list',
                component: () =>
                    import ('@/views/system/user/list.vue'),
                hidden: false
            },
            {
                path: 'role_list',
                title: '角色管理',
                name: 'role_list',
                component: () =>
                    import ('@/views/system/role/list.vue'),
                hidden: false
            },
            {
                path: 'power_list',
                title: '权限管理',
                name: 'power_list',
                component: () =>
                    import ('@/views/system/power/list.vue'),
                hidden: false
            },
            {
                path: 'resource_list',
                title: '资源管理',
                name: 'resource_list',
                component: () =>
                    import ('@/views/system/resource/list.vue'),
                hidden: false
            },
            {
                path: 'controller_list',
                title: '功能管理',
                name: 'controller_list',
                component: () =>
                    import ('@/views/system/controller/controller.vue'),
                hidden: false
            },
            {
                path: 'alipay_list',
                title: '支付日志',
                name: 'alipay_list',
                component: () =>
                    import ('@/views/system/alipay/list.vue'),
                hidden: false
            },
            {
                path: 'config_report',
                title: '报表管理',
                name: 'config_report',
                component: () =>
                    import ('@/views/system/report/configuration.vue'),
                hidden: false
            },
            {
                path: 'operation_log',
                title: '操作日志',
                name: 'operation_log',
                component: () =>
                    import ('@/views/system/operation-log/list.vue'),
                hidden: false
            },
            {
                path: 'login_log',
                title: '登陆日志',
                name: 'login_log',
                component: () =>
                    import ('@/views/system/login-log/list.vue'),
                hidden: false
            }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [{
            path: 'index',
            title: '错误页面1',
            name: 'errorpage_index',
            component: () =>
                import ('@/views/error-page/error-page.vue'),
            hidden: false,
            children: [{
                path: 'index2',
                title: '错误页面2',
                name: 'errorpage_index2',
                component: () =>
                    import ('@/views/error-page/error-page.vue'),
                hidden: false
            }, {
                path: 'index3',
                title: '错误页面3',
                name: 'errorpage_index3',
                component: () =>
                    import ('@/views/error-page/error-page.vue'),
                hidden: false
            }]
        }]
    },
    {
        path: '/logistics',
        icon: 'person-add',
        name: 'logistics',
        title: '物流管理',
        component: Main,
        children: [
            {
                path: 'logisticsGL',
                title: '瓜沥吞吐量月报表',
                name: 'logisticsGL',
                component: () =>
                    import ('@/views/logistic-management/logisticsGL.vue'),
                hidden: false
            },
            {
                path: 'logisticsYL',
                title: '宇隆吞吐量月报表',
                name: 'logisticsYL',
                component: () =>
                    import ('@/views/logistic-management/logisticsYL.vue'),
                hidden: false
            },
            {
                path: 'deliveryArea',
                title: '运费地区对照表',
                name: 'deliveryArea',
                component: () =>
                    import ('@/views/logistic-management/deliveryArea.vue'),
                hidden: false
            }
        ]
    },
    {
        path: '/finance_management',
        icon: 'finance',
        name: 'finance_management',
        title: '财务管理',
        component: Main,
        children: [
            {
                path: 'balance_jd_platform',
                icon: 'finance',
                title: '京东平台对账',
                name: 'balance_jd_platform',
                component: () =>
                    import ('@/views/finance-management/balance-account/jd-platform.vue'),
                hidden: false
            },
            {
                path: 'balance_jd_oms',
                icon: 'finance',
                title: '京东-OMS订单对账',
                name: 'balance_jd_oms',
                component: () =>
                    import ('@/views/finance-management/balance-account/jd-oms.vue'),
                hidden: false
            },
            {
                path: 'balance_sm_platform',
                icon: 'finance',
                title: '分期乐平台对账',
                name: 'balance_sm_platform',
                component: () =>
                    import ('@/views/finance-management/balance-account/sm-platform.vue'),
                hidden: false
            },
            {
                path: 'balance_sm_oms',
                icon: 'finance',
                title: '分期乐-OMS订单对账',
                name: 'balance_sm_oms',
                component: () =>
                    import ('@/views/finance-management/balance-account/sm-oms.vue'),
                hidden: false
            },
            {
                path: 'balance_beibei_oms',
                icon: 'finance',
                title: '贝店对账',
                name: 'balance_beibei_oms',
                component: () =>
                    import ('@/views/finance-management/balance-account/beibei-oms.vue'),
                hidden: false
            },
            {
                path: 'balance_xiaohongshu_oms',
                icon: 'finance',
                title: '小红书对账',
                name: 'balance_xiaohongshu_oms',
                component: () =>
                    import ('@/views/finance-management/balance-account/xiaohongshu-oms.vue'),
                hidden: false
            },
            {
                path: 'balance_neigou',
                icon: 'finance',
                title: '内购对账',
                name: 'balance_neigou',
                component: () =>
                    import ('@/views/finance-management/balance-account/neigou.vue'),
                hidden: false
            },
            {
                path: 'balance_pinduoduo',
                icon: 'finance',
                title: '拼多多对账',
                name: 'balance_pinduoduo',
                component: () =>
                    import ('@/views/finance-management/balance-account/pinduoduo.vue'),
                hidden: false
            },
            {
                path: 'balance_davdian',
                icon: 'davdian',
                title: '大V店对账',
                name: 'balance_davdian',
                component: () =>
                    import ('@/views/finance-management/balance-account/davdian.vue'),
                hidden: false
            },
            {
                path:'cost_overview',
                icon:'finance',
                title:'费用总览',
                name:'cost_overview',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/cost-overview.vue'),
                hidden: false
            },
            {
                path:'operation_dashboard',
                icon:'finance',
                title:'经营看板',
                name:'operation_dashboard',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/operation-dashboard.vue'),
                hidden: false
            },
            {
                path:'variable_cost',
                icon:'finance',
                title:'变动费用',
                name:'variable_cost',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/variable-cost.vue'),
                hidden: false
            },
            {
                path:'operation_analysis_tmall',
                icon:'finance',
                title:'天猫及小平台',
                name:'operation_analysis_tmall',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/operation-analysis-tmall.vue'),
                hidden: false
            }, 
            {
                path:'operation_analysis_vip',
                icon:'finance',
                title:'唯品会经营分析',
                name:'operation_analysis_vip',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/operation-analysis-vip.vue'),
                hidden: false
            },
            {
                path:'moving_sale_analysis',
                icon:'finance',
                title:'动销分析',
                name:'moving_sale_analysis',
                component:()=>
                    import ('@/views/finance-management/moving-sale-analysis/index.vue'),
                hidden: false
            },
            {
                path:'alipay_bill',
                icon:'finance',
                title:'支付宝账单',
                name:'alipay_bill',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/alipay_bill.vue'),
                hidden: false
            },
            {
                path:'daily_consumpe',
                icon:'finance',
                title:'目标日消耗',
                name:'daily_consumpe',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/daily_consumpe.vue'),
                hidden: false
            },
            {
                path:'operation_dashboard_renovate',
                icon:'finance',
                title:'看板更新',
                name:'operation_dashboard_renovate',
                component:()=>
                    import ('@/views/finance-management/profit-loss-statement/operation_dashboard_renovate.vue'),
                hidden: false
            },
            {
                path:'budget-complete',
                icon:'finance',
                title:'预算完成率',
                name:'budget-complete',
                component:()=>
                    import ('@/views/finance-management/budget-complete/index.vue'),
                hidden: false
            },
            {
                path:'final_account_service_fee',
                icon:'finance',
                title:'损益决算-劳务费',
                name:'final_account_service_fee',
                component:()=>
                    import ('@/views/finance-management/profit-loss-final-account/final-account-service-fee.vue'),
                hidden: false
            },
            {
                path:'final_account_dashboard',
                icon:'finance',
                title:'损益决算看板',
                name:'final_account_dashboard',
                component:()=>
                    import ('@/views/finance-management/profit-loss-final-account/final-account-dashboard.vue'),
                hidden: false
            },
            {
                path:'final_account_variable',
                icon:'finance',
                title:'决算变动项',
                name:'final_account_variable',
                component:()=>
                    import ('@/views/finance-management/profit-loss-final-account/final-account-variable.vue'),
                hidden: false
            },
            {
                path:'balance_account_supplier_list',
                icon:'finance',
                title:'供应商',
                name:'balance_account_supplier_list',
                component:()=>
                    import ('@/views/finance-management/supplier-balance-account/supplier.vue'),
                hidden: false
            },
            {
                path:'balance_account_goods_delay',
                icon:'finance',
                title:'大货延期',
                name:'balance_account_goods_delay',
                component:()=>
                    import ('@/views/finance-management/supplier-balance-account/goods-delay.vue'),
                hidden: false
            },
            {
                path:'balance_account_report',
                icon:'finance',
                title:'往来对账报表',
                name:'balance_account_report',
                component:()=>
                    import ('@/views/finance-management/supplier-balance-account/report.vue'),
                hidden: false
            },
            {
                path:'balance_account_rework',
                icon:'finance',
                title:'返修对账报表',
                name:'balance_account_rework',
                component:()=>
                    import ('@/views/finance-management/supplier-balance-account/rework.vue'),
                hidden: false
            }
        ]
    },
    {
        path: '/operational',
        icon: 'import',
        name: 'operational',
        title: '店铺运营',
        component: Main,
        children:[
            {
                path: 'yunjinetList',
                title: '平台供货价',
                name: 'yunjinetList',
                component: () =>
                    import ('@/views/data-import/operational/yunjinetList.vue'),
                hidden: false
            },
            {
                path: 'good_external_info',
                title: '商品外部信息',
                name: 'good_external_info',
                component: () =>
                    import ('@/views/data-import/operational/good_external_info.vue'),
                hidden: false
            },
            {
                path: 'profit_loss',
                title: '损益维护',
                name: 'profit_loss',
                component: () =>
                    import ('@/views/data-import/operational/profit_loss.vue'),
                hidden: false
            },
            {
                path: 'vip_forecast_parameter',
                title: 'VIP参数维护',
                name: 'vip_forecast_parameter',
                component: () =>
                    import ('@/views/data-import/operational/vip-forecast-parameter.vue'),
                hidden: true
            },
            {
                path: 'refund_rate',
                title: '退货率',
                name: 'refund_rate',
                component: () =>
                    import ('@/views/data-import/operational/refund-rate.vue'),
                hidden: true
            },
            {
                path: 'sale_target',
                title: '季节销售指标',
                name: 'sale_target',
                component: () =>
                    import ('@/views/data-import/operational/sale-target.vue'),
                hidden: true
            },
        ]
    },
    {
        path: '/finance',
        icon: 'import',
        name: 'finance',
        title: '财务管理',
        component: Main,
        children:[
            {
                path: 'parameter',
                title: '参数维护',
                name: 'parameter',
                component: () =>
                    import ('@/views/data-import/finance/parameter/parameter.vue'),
                hidden: false
            },
            {
                path: 'Daily',
                title: '日报项维护',
                name: 'Daily',
                component: () =>
                    import ('@/views/data-import/finance/Daily.vue'),
                hidden: false
            },
            {
                path: 'cost_detail',
                title: '费用明细',
                name: 'cost_detail',
                component: () =>
                    import ('@/views/data-import/finance/cost_detail.vue'),
                hidden: false
            },
            {
                path: 'across_logistics',
                title: '唯品会物流费用',
                name: 'across_logistics',
                component: () =>
                    import ('@/views/data-import/finance/across_logistics.vue'),
                hidden: false
            },
            {
                path: 'across_logistics_report',
                title: '唯品会物流费用报表',
                name: 'across_logistics_report',
                component: () =>
                    import ('@/views/data-import/finance/across_logistics_report.vue'),
                hidden: true
            },
            {
                path: 'across_logistics_summary',
                title: '唯品会物流费用汇总',
                name: 'across_logistics_summary',
                component: () =>
                    import ('@/views/data-import/finance/across_logistics_summary.vue'),
                hidden: true
            }
        ]
    },
    {
        path:'/base',
        icon:'',
        name:'oa',
        title:'基础资料',
        component:Main,
        children:[
            {
                path: 'properties_file',
                title: '标签分类管理',
                name: 'properties_file',
                component: () =>
                    import ('@/views/system/product_plan/properties_file/list.vue'),
                hidden: false
            },
            {
                path: 'label_management',
                title: '标签管理',
                name: 'label_management',
                component: () =>
                    import ('@/views/system/product_plan/label_management/list.vue'),
                hidden: false
            },
        ]
    },
    {
        path: '/operation-management',
        icon: 'person-add',
        name: 'operation-management',
        title: '店铺运营',
        component: Main,
        children: [
            {
                path: 'vip_stock',
                title: '唯品会库存',
                name: 'vip_stock',
                component: () =>
                    import ('@/views/operation-management/vip/stock.vue'),
                hidden: false
            },
            {
                path: 'shortage_warning',
                title: '缺货预警',
                name: 'shortage_warning',
                component: () =>
                    import ('@/views/operation-management/vip/warn.vue'),
                hidden: false
            },
            { 
                path: 'vip_goods',
                title: '唯品会商品',
                name: 'vip_goods',
                component: () =>
                    import ('@/views/operation-management/vip/goods.vue'),
                hidden: false
            }
        ]
    },
    {
        path: '/bussiness-plan',
        icon: 'person-add',
        name: 'bussiness',
        title: '商企企划',
        component: Main,
        children: [
            {
                path: 'parameters',
                title: '企划参数',
                name: 'parameters',
                component: () =>
                    import ('@/views/bussiness-plan/parameters.vue'),
                hidden: false
            },
            {
                path: 'brand',
                title: '品牌企划跟进',
                name: 'brand',
                component: () =>
                    import ('@/views/bussiness-plan/brand.vue'),
                hidden: false
            },
            {
                path: 'commodity',
                title: '商品企划跟进',
                name: 'commodity',
                component: () =>
                    import ('@/views/bussiness-plan/commodity.vue'),
                hidden: false
            },
            {
                path: 'category',
                title: '品类企划跟进',
                name: 'category',
                component: () =>
                    import ('@/views/bussiness-plan/category.vue'),
                hidden: false
            },
            {
                path: 'question',
                title: '问题核查',
                name: 'question',
                component: () =>
                    import ('@/views/bussiness-plan/question.vue'),
            },
            {
                path: 'staffing',
                title: '人员配置',
                name: 'staffing',
                component: () =>
                    import ('@/views/bussiness-plan/staffing.vue'),
                hidden: false
            },
            {
                path: 'add',
                title: '新增',
                name: 'add',
                component: () =>
                    import ('@/views/bussiness-plan/add.vue'),
                hidden: false
            },
            {
                path: 'database',
                title: '货品资料库',
                name: 'database',
                component: () =>
                    import ('@/views/bussiness-plan/database.vue'),
                hidden: false
            }
        ]
    },
    {
        path : '/upnew',
        icon : 'person-add',
        name : 'upnew',
        title: '上新管理',
        component: Main,
        children: [
            {
                path: 'time',
                title: '任务时效配置',
                name: 'time',
                component: () =>
                    import ('@/views/upnew/taskseting/time.vue'),
                hidden: false
            },
            {
                path: 'work',
                title: '工作量配置',
                name: 'work',
                component: () =>
                    import ('@/views/upnew/taskseting/work.vue'),
                hidden: false
            },
            {
                path: 'staff',
                title: '人员配置',
                name: 'staff',
                component: () =>
                    import ('@/views/upnew/taskseting/staff.vue'),
                hidden: false
            },
            {
                path : 'designer',
                title: '设计师绑定企划配置',
                name : 'designer',
                component: () =>
                    import ('@/views/upnew/taskseting/designer.vue'),
                hidden: false
            },{
                path : 'list',
                title: '品类属性模板配置',
                name : 'list',
                component: () =>
                    import ('@/views/upnew/list.vue'),
                hidden: false
            },
            {
                path : 'photoSample',
                title: '拍照样领取管理',
                name : 'photoSample',
                component: () =>
                    import ('@/views/upnew/taskmanage/photoSample.vue'),
                hidden: false
            },
            {
                path : 'photoList',
                title: '拍摄报表管理',
                name : 'photoList',
                component: () =>
                    import ('@/views/upnew/taskmanage/photoList.vue'),
                hidden: false
            },
            {
                path : 'photodetailList/:orderId',
                title: '拍摄报表列表',
                name : 'photodetailList',
                component: () =>
                    import ('@/views/upnew/taskmanage/photodetailList.vue'),
                hidden: true
            },
            {
                path : 'psfarwlb',
                title: '拍摄方案任务列表',
                name : 'psfarwlb',
                component: () =>
                    import ('@/views/upnew/taskmanage/psfarwlb.vue'),
                hidden: true
            },
            {
                path : 'psfaxq',
                title: '拍摄方案详情',
                name : 'psfaxq',
                component: () =>
                    import ('@/views/upnew/taskmanage/psfaxq.vue'),
                hidden: true
            },
            {
                path : 'psfawc',
                title: '拍摄方案完成页',
                name : 'psfawc',
                component: () =>
                    import ('@/views/upnew/taskmanage/psfawc.vue'),
                hidden: true
            },
            {
                path : 'wpsprwlb',
                title: '外拍视频任务列表',
                name : 'wpsprwlb',
                component: () =>
                    import ('@/views/upnew/taskmanage/wpsprwlb.vue'),
                hidden: true
            },
            {
                path : 'wpspxq',
                title: '外拍视频详情',
                name : 'wpspxq',
                component: () =>
                    import ('@/views/upnew/taskmanage/wpspxq.vue'),
                hidden: true
            },
            {
                path : 'wpspwcy',
                title: '外拍视频完成页',
                name : 'wpspwcy',
                component: () =>
                    import ('@/views/upnew/taskmanage/wpspwcy.vue'),
                hidden: true
            },
            {
                path : 'photooutside',
                title: '外拍图片任务列表',
                name : 'photooutside',
                component: () =>
                    import ('@/views/upnew/taskmanage/photooutside.vue'),
                hidden: true
            },
            {
                path : 'photooutsidedetail',
                title: '外拍图片详情',
                name : 'photooutsidedetail',
                component: () =>
                    import ('@/views/upnew/taskmanage/photooutsidedetail.vue'),
                hidden: true
            },
            {
                path : 'photooutsidecomplated',
                title: '外拍图片完成页',
                name : 'photooutsidecomplated',
                component: () =>
                    import ('@/views/upnew/taskmanage/photooutsidecomplated.vue'),
                hidden: true
            },
            {
                path : 'jingwutupicture',
                title: '静物图片任务列表',
                name : 'jingwutupicture',
                component: () =>
                    import ('@/views/upnew/taskmanage/jingwutupicture.vue'),
                hidden: false
            },
            {
                path : 'jingwutupicturedetail',
                title: '静物图片详情',
                name : 'jingwutupicturedetail',
                component: () =>import ('@/views/upnew/taskmanage/jingwutupicturedetail.vue'),
                hidden: true
            },
            {
                path : 'jingwutupicturecomplated',
                title: '静物图片完成页',
                name : 'jingwutupicturecomplated',
                component: () =>import ('@/views/upnew/taskmanage/jingwutupicturecomplated.vue'),
                hidden: true
            },
            {
                path : 'xiupiantaskList',
                title: '修片任务列表',
                name : 'xiupiantaskList',
                component: () =>import ('@/views/upnew/taskmanage/xiupiantaskList.vue'),
                hidden: false
            },
            {
                path : 'xiupiantaskdetail',
                title: '修片详情',
                name : 'xiupiantaskdetail',
                component: () =>import ('@/views/upnew/taskmanage/xiupiantaskdetail.vue'),
                hidden: true
            },
            {
                path : 'xiupiantaskcomplated',
                title: '修片详情完成页',
                name : 'xiupiantaskcomplated',
                component: () =>import ('@/views/upnew/taskmanage/xiupiantaskcomplated.vue'),
                hidden: true
            },
            {
                path : 'xprwlb',
                title: '选片任务列表',
                name : 'xprwlb',
                component: () =>import ('@/views/upnew/taskmanage/xprwlb.vue'),
                hidden: true
            },
            {
                path : 'xpxq',
                title: '选片详情',
                name : 'xpxq',
                component: () =>import ('@/views/upnew/taskmanage/xpxq.vue'),
                hidden: true
            },
            {
                path : 'xpwcy',
                title: '选片完成页',
                name : 'xpwcy',
                component: () =>import ('@/views/upnew/taskmanage/xpwcy.vue'),
                hidden: true
            },
            {   //剪辑任务列表
                path : 'cliptasklist',
                title: '剪辑任务列表',
                name : 'cliptasklist',
                component: () =>import ('@/views/upnew/taskmanage/cliptasklist.vue'),
                hidden: true
            },
            {   //剪辑详情
                path : 'cliptaskdetail',
                title: '剪辑详情',
                name : 'cliptaskdetail',
                component: () =>import ('@/views/upnew/taskmanage/cliptaskdetail.vue'),
                hidden: true
            },
            {   //剪辑详情完成页
                path : 'cliptaskcomplated',
                title: '剪辑详情完成页',
                name : 'cliptaskcomplated',
                component: () =>import ('@/views/upnew/taskmanage/cliptaskcomplated.vue'),
                hidden: true
            },
            {
                path : 'xsprwlb',
                title: '选视频任务列表',
                name : 'xsprwlb',
                component: () =>
                    import ('@/views/upnew/taskmanage/xsprwlb.vue'),
                hidden: true
            },
            {
                path : 'xspxq',
                title: '选视频详情',
                name : 'xspxq',
                component: () =>
                    import ('@/views/upnew/taskmanage/xspxq.vue'),
                hidden: true
            },
            {
                path : 'xspwcy',
                title: '选视频完成页',
                name : 'xspwcy',
                component: () =>
                    import ('@/views/upnew/taskmanage/xspwcy.vue'),
                hidden: true
            },
            {//上新任务列表，嘎嘎
                path : 'upnewtasklist',
                title: '上新任务列表',
                name : 'upnewtasklist',
                component: () =>
                    import ('@/views/upnew/taskmanage/upnewtasklist.vue'),
                hidden: false
            },
            {//上新任务详情页
                path : 'upnewtaskdetail',
                title: '上新任务详情页',
                name : 'upnewtaskdetail',
                component: () =>
                    import ('@/views/upnew/taskmanage/upnewtaskdetail.vue'),
                hidden: true
            },
            {//上新任务完成页
                path : 'upnewtaskcomplated',
                title: '上新任务完成页',
                name : 'upnewtaskcomplated',
                component: () =>
                    import ('@/views/upnew/taskmanage/upnewtaskcomplated.vue'),
                hidden: true
            },
            {
                path : 'lrcpzlrwlb',
                title: '录入产品资料任务列表',
                name : 'lrcpzlrwlb',
                component: () =>
                    import ('@/views/upnew/taskmanage/lrcpzlrwlb.vue'),
                hidden: true
            },
            {
                path : 'lrcpzlxq',
                title: '录入产品资料详情',
                name : 'lrcpzlxq',
                component: () =>
                    import ('@/views/upnew/taskmanage/lrcpzlxq.vue'),
                hidden: true
            },
            {
                path : 'lrcpzlwcy',
                title: '录入产品资料完成页',
                name : 'lrcpzlwcy',
                component: () =>
                    import ('@/views/upnew/taskmanage/lrcpzlwcy.vue'),
                hidden: true
            },
            {
                path : 'photolistmanage',
                title: '拍摄报表',
                name : 'photolistmanage',
                component: () =>
                    import ('@/views/upnew/datamanage/photolist.vue'),
                hidden: false
            },
            {
                path : 'productinformation',
                title: '产品资料信息',
                name : 'productinformation',
                component: () =>
                    import ('@/views/upnew/datamanage/productinformation.vue'),
                hidden: false
            },
            {
                path : 'index',
                title: '任务燃尽图',
                name : 'index',
                component: () =>
                    import ('@/views/upnew/index.vue'),
                hidden: false
            },
            {
                path : 'rwsxxq',
                title: '任务燃尽图详情',
                name : 'rwsxxq',
                component: () =>
                    import ('@/views/upnew/rwsxxq.vue'),
                hidden: true
            },
        ]
    },
]
export default appRouter;
