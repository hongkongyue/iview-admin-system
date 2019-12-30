const methodMap = {

    /** 管理登陆接口 **/
    AdminLogin: {url: '/eop/sys/login', method: 'post'},
    /** 用户登陆解锁 **/
    AdminUnlock: {url: '/user/unlock', method: 'post'},
    /** 后台用户列表 **/
    UserList: {url: '/user/list', method: 'get'},
    /** 获取树状列表 **/
    treeurl: {url: '/user/tree', method: 'post'},
    /**用户信息 */
    UserInfo: {url: '/user/info', method: 'get'},
    /** 添加后台用户 **/
    AdminAddUser: {url: '/user/add', method: 'post'},
    /** 编辑后台用户 **/
    AdminEditUser: {url: '/user/edit', method: 'post'},
    /** 重置后台用户密码 **/
    RestPassword: {url: '/user/rest_password', method: 'post'},

    //内购管理接口
    StaffSalesOrderList: {url: '/eop/eom/get_order', method: 'post'},

    StaffSalesOrderListCheck: {url: '/eop/eom/get_order_check', method: 'post'},

    StaffSalesOrderAdd: {url: '/eop/eom/staff_order', method: 'post'},

    StaffSalesOrderDetail: {url: '/eop/eom/get_staff_order', method: 'post'},

    //内部样衣接口
    StaffSampleCoatList: {url: '/eop/eom/spl/general/get_order', method: 'post'},
    StaffSampleCoatAdd: {url: '/eop/eom/spl/general/add_order', method: 'post'},
    get_return_order_list: {url: '/eop/eom/spl/general/get_return_order_list', method: 'post'},
    close_return_order: {url: '/eop/eom/spl/general/close_return_order', method: 'post'},
    check_return_order_detail: {url: '/eop/eom/spl/general/check_return_order_detail', method: 'post'},
    get_good_spec_by_list: {url: '/eop/eom/get_good_spec_by_list', method: 'post'},
    save_order_cart: {url: '/eop/eom/save_order_cart', method: 'post'},
    cancel_order: {url: '/eop/eom/cancel_order', method: 'post'},
    check_order_by_list: {url: '/eop/eom/spl/general/check_order_by_list', method: 'post'},     //样衣批量审核

    //工厂样衣接口
    FactorySampleCoatList: {url: '/eop/eom/spl/general/get_order', method: 'post'},
    FactorySampleCoatAdd: {url: '/eop/eom/spl/general/add_order', method: 'post'},
    FactorySampleCoatDetail: {url: '/eop/eom/spl/general/get_order_detail', method: 'post'},

    //订单确认接口
    OrderConfirm: {url: '/eop/eom/order_confirm', method: 'post'},

    //品牌列表
    GetBrandList: {url: '/eop/eom/brands_pay', method: 'post'},
    //订单状态列表
    GetOrderStatusList: {url: '/eop/eom/get_order_status', method: 'post'},
    //规格名称
    GetGoodSpecList: {url: '/eop/eom/get_good_spec_list', method: 'post'},
    //省份运费列表
    GetFreightList: {url: '/eop/eom/freight_old', method: 'post'},
    GetFreightListNew: {url: '/eop/eom/freight', method: 'post'},
    GetTotalFright: {url: '/eop/eom/spl/get_freight', method: 'post'},//后端计算运费接口

    //物流公司列表
    GetLogisticList: {url: '/eop/eom/base/logistic_old', method: 'post'},
    GetLogisticListNew: {url: '/eop/eom/base/logistic', method: 'post'},
    getLogisticListNode:{url:'/eop-node/api/sys/getLogisticList',method:'post'},

    //发送验证码到邮箱
    SendEmailCode: {url: '/eop/sys/sendEmailCode', method: 'post'},

    //校验验证码
    CheckEmailCode: {url: '/eop/sys/checkEmailCode', method: 'post'},

    //注册接口
    RegistEmail: {url: '/eop/sys/registEmail', method: 'post'},
    UpdatePwd: {url: '/eop/eom/updatepwd', method: 'post'},

    /* 物流管理KPI */
    stockout_delay_export_excel: {url: '/eop/kpi/lst/stockout_delay_export_excel', method: 'get'},//导出发货延时率excel
    stockout_error_export_excel: {url: '/eop/kpi/lst/stockout_error_export_excel', method: 'get'},//导出发货出错率excel
    logistics_center: {url: '/eop/kpi/lst/logistics_center', method: 'post'},//获取物流中心报表
    select_warehouse_kpi: {url: '/eop/kpi/lst/select_warehouse_kpi', method: 'post'},//获取仓库报表
    select_user_code: {url: '/eop/kpi/lst/select_user_code', method: 'post'},//根据用户名获取用户编码

    /* 库位出错率 */
    getbrands_bywarehouse: {url: '/eop/kpi/lst/getbrands_bywarehouse', method: 'post'},//根据仓库编码查询下属品牌列表
    inventory_error_list: {url: '/eop/kpi/lst/inventory_error_list', method: 'post'},//查询库位出错率总表
    export_inventoryError_excel: {url: '/eop/kpi/lst/export_inventoryError_excel', method: 'get'},//导出对应日期的库位出错率excel

    /* 发货出错率 */
    stockout_error_list: {url: '/eop/kpi/lst/stockout_error_list', method: 'post'},//获取发货出错数据列表
    stockout_error_detail: {url: '/eop/kpi/lst/stockout_error_detail', method: 'post'},//获取发货出错数据 详细
    validate_ordercode: {url: '/eop/kpi/lst/validate_ordercode', method: 'post'},//校验发货数据录入订单号有效性
    stockout_error: {url: '/eop/kpi/lst/stockout_error', method: 'post'},//发货出错数据增删改查

    /* 基层KPI报表 */
    select_base_kpi: {url: '/eop/kpi/lst/select_base_kpi', method: 'post'},//查询物流基层kpi报表

    /* 基层KPI报表 */
    export_base_kpi:  {url: '/eop/kpi/lst/export_base_kpi', method: 'get'},//导出物流基层kpi报表
    list_manual: {url: '/eop/kpi/lst/list_manual', method: 'post'},//查询物流基层kpi列表
    add_manual: {url: '/eop/kpi/lst/add_manual', method: 'post'},//物流基层kpi手动录入
    edit_manual: {url: '/eop/kpi/lst/edit_manual', method: 'post'},//物流基层kpi手动修改
    delete_manual: {url: '/eop/kpi/lst/delete_manual', method: 'post'},//用户前端页面删除基层kpi数据


    /* 用户管理 */
    get_userList: {url: '/eop/sys/get_userList', method: 'post'},//获取用户信息列表
    add_user: {url: '/eop/sys/add_user', method: 'post'},//新增用户
    edit_user: {url: '/eop/sys/edit_user', method: 'post'},//编辑用户
    delete_user: {url: '/eop/sys/delete_user', method: 'post'},//删除用户
    get_postList: {url: '/eop/sys/get_postList', method: 'post'},//获取岗位列表
    get_orgList: {url: '/eop/sys/get_orgList', method: 'post'},//获取部门列表
    does_user_exist: {url: '/eop/sys/does_user_exist', method: 'post'},//账户是否已存在验证
    reset_password: {url: '/eop/sys/reset_password', method: 'post'},//重置密码

    update_pwd_send_email_code: {url: '/eop/sys/updatePwdSendEmailCode', method: 'post'},//给指定的邮箱发送验证码
    update_pwd_by_email_code: {url: ' /eop/sys/updatePwdByEmailCode', method: 'post'},//通过邮箱验证码修改密码

    get_urpr_by_type: {url: '/eop/sys/get_urpr_by_type', method: 'post'},//分类获取 用户/角色/权限/资源

    /**
     * 用户常用地址管理
     */
    add_address: {url: '/eop/sys/user/add_address', method: 'post'},//用户新增常用地址
    edit_address: {url: '/eop/sys/user/edit_address', method: 'post'},//用户编辑常用地址
    delete_address: {url: '/eop/sys/user/delete_address', method: 'post'},//用户删除常用地址
    get_address_list: {url: '/eop/sys/user/get_address_list', method: 'post'},//获取用户常用地址列表

    /* 资源管理 */
    get_urpr: {url: '/eop/sys/get_urpr', method: 'post'},//根据行获取 用户/角色/权限/资源
    res_aud: {url: '/eop/sys/urpr/res_aud', method: 'post'}, //res操作接口

    /* 角色管理 */
    get_urpr_name: {url: '/eop/sys/get_urpr_name', method: 'post'},   //根据名字查询 用户/角色/权限/资源
    sys_ver_log: {url: '/eop/sys/ver_log', method: 'post'},           //系统升级日志
    role_aud: {url: '/eop/sys/urpr/role_aud', method: 'post'},        //role操作接口
    rp_link: {url: '/eop/sys/rp_link', method: 'post'},               //角色添加权限接口
    get_urpr_param: {url: '/eop/sys/get_urpr_param', method: 'post'},        //根据父级Id和分页获取子级目录

    /* 权限管理 */
    priv_aud: {url: '/eop/sys/urpr/priv_aud', method: 'post'},      //priv操作接口
    pr_link: {url: '/eop/sys/urpr/pr_link', method: 'post'},        //权限添加资源接口
    priv_res: {url: '/eop/sys/get_urpr_param_', method: 'post'},    //根据权限ID获取相应资源列表

    /* 功能管理 */
    get_config: {url: '/eop/sys/get_config', method: 'post'},
    config: {url: '/eop/sys/config', method: 'post'},

    /* 原始订单 */
    get_order_list: {url: '/eop/eom/akc/get_order_list', method: 'post'},           //查询原始订单列表
    get_order_detail: {url: '/eop/eom/akc/get_order_detail', method: 'post'},       //根据订单号查询商品明细
    get_shop_list: {url: '/eop/eom/akc/get_shop_list', method: 'post'},             //获取爱库存订单店铺列表
    get_lives_list: {url: '/eop/eom/akc/get_lives_list', method: 'post'},           //获取爱库存订单活动列表
    resend_order: {url: '/eop/eom/resend_order', method: 'post'},                   //订单重新推送旺店通
    get_bbc_order_list: {url: '/eop/eom/bbc/get_order_list', method: 'post'},           //查询原始订单列表
    get_bbc_order_detail: {url: '/eop/eom/bbc/get_order_detail', method: 'post'},       //根据订单号查询商品明细
    get_bbc_shop_list: {url: '/eop/eom/bbc/get_shop_list', method: 'post'},
    get_bbc_lives_list: {url: '/eop/eom/bbc/get_lives_list', method: 'post'},           //获取爱库存订单活动列表
    /**
     * 好衣库
     */
    get_hyc_order_list: {url: '/eop/eom/hyc/get_order_list', method: 'post'},           //查询好衣库原始订单列表
    get_hyc_order_detail: {url: '/eop/eom/hyc/get_order_detail', method: 'post'},       //根据好衣库订单号查询商品明细
    get_hyc_shop_list: {url: '/eop/eom/hyc/get_shop_list', method: 'post'}, 　       　　//获取好衣库订单店铺列表

    /**
     * 苏宁特卖
     */
    get_sntm_order_list: {url: '/eop/eom/sntm/get_order_list', method: 'post'},           
    get_sntm_order_detail: {url: '/eop/eom/sntm/get_order_detail', method: 'post'},       
    get_sntm_shop_list: {url: '/eop/eom/sntm/get_shop_list', method: 'post'}, 　       　　
    get_sntm_lives_list: {url: '/eop/eom/sntm/get_lives_list', method: 'post'},   

    /**
     * 苏宁特卖
     */
    get_sportjx_order_list: {url: '/eop/eom/thms/get_order_list', method: 'post'},           
    get_sportjx_order_detail: {url: '/eop/eom/thms/get_order_detail', method: 'post'},       
    get_sportjx_shop_list: {url: '/eop/eom/thms/get_shop_list', method: 'post'}, 　       　　
    get_sportjx_lives_list: {url: '/eop/eom/thms/get_lives_list', method: 'post'},   

    /**
     * 达令家 
     */
    get_dalingjia_order_list: {url: '/eop/eom/dlj/get_order_list', method: 'post'},           
    get_dalingjia_order_detail: {url: '/eop/eom/dlj/get_order_detail', method: 'post'},       
    get_dalingjia_shop_list: {url: '/eop/eom/dlj/get_shop_list', method: 'post'}, 　       　　
    get_dalingjia_lives_list: {url: '/eop/eom/dlj/get_lives_list', method: 'post'},   

    /**
     * 达令家 
     */
    get_wykl_order_list: {url: '/eop/eom/wykl/get_order_list', method: 'post'},           
    get_wykl_order_detail: {url: '/eop/eom/wykl/get_order_detail', method: 'post'},       
    get_wykl_shop_list: {url: '/eop/eom/wykl/get_shop_list', method: 'post'}, 　       　　
    get_wykl_lives_list: {url: '/eop/eom/wykl/get_lives_list', method: 'post'},   


    /**
     * 小小包
     */
    get_xxb_order_list: {url: '/eop/eom/xxb/get_order_list', method: 'post'},           
    get_xxb_order_detail: {url: '/eop/eom/xxb/get_order_detail', method: 'post'},       
    get_xxb_shop_list: {url: '/eop/eom/xxb/get_shop_list', method: 'post'}, 　       　　
    get_xxb_lives_list: {url: '/eop/eom/xxb/get_lives_list', method: 'post'},   
    
    /**
     * 钉钉扫码登录
     */
    get_dingtalk_scan_userinfo: {url: '/eop-node/api/auth/getScanUserInfo', method: 'post'},//获取钉钉扫码用户信息
    scan_login:{url:'/eop-node/api/user/scanLogin',method:'post'},//扫码登录
    create_platform_auth_account:{url:'/eop-node/api/user/createPlatformAuthAccount',method:'post'},//账户绑定
    get_dingtalk_info: {url: '/eop-node/api/user/getDingtalkInfo', method: 'post'},//获取当前登录用户 的钉钉绑定信息
    unbind_dingtalk: {url: '/eop-node/api/user/unBindDingtalk', method: 'post'},//解绑钉钉

    /**
     * 翻单预警
     */
    get_resource_list: {url: '/eop/sys/get_resourceList', method: 'post'},                  //根据用户id获取菜单
    get_reorder_goods: {url: '/eop/eom/reorder/get_reorder_goods', method: 'post'},         //查询翻单预警
    get_brands_by_userId: {url: '/eop/eom/reorder/get_brands_by_userId', method: 'post'},   //获取当前用户权限品牌列表
    add_reorder: {url: '/eop/eom/reorder/add_reorder', method: 'post'},                     //新增快捷翻单
    add_reorder_cart: {url: '/eop/eom/reorder/add_reorder_cart', method: 'post'},           //保存翻单草稿
    get_goods_name: {url: '/eop/eom/reorder/get_goods_name', method: 'post'},               //根据用户id获取品名列表
    get_reorder_list: {url: '/eop/eom/reorder/get_reorder_list', method: 'post'},           //翻单记录查询接口
    get_reorder_detail: {url: '/eop/eom/reorder/get_reorder_detail', method: 'post'},       //根据单号查询翻单明细
    exportReOrderExcel: {url: '/eop/eom/reorder/exportReOrderExcel', method: 'post'},       //翻单预警导出
    get_class_name: {url: '/eop/eom/reorder/get_class_name',method: 'post'},
    get_brand_by_sectionNo: {url: '/eop/eom/reorder/get_brand_by_sectionNo',method: 'post'},
    cancel_reorder: {url: '/eop/eom/reorder/cancel_reorder', method: 'post'},
    check_reorder: {url: '/eop/eom/reorder/check_reorder', method: 'post'},
    check_order: {url: '/eop/eom/reorder/check_order', method: 'post'},//新的审核接口
    eom_reorder_push_scm: {url: '/eop/eom/reorder/push_scm', method: 'post'},

    get_oa_department_list: {url: '/eop/sys/get_oa_department_list', method: 'post'},//获取OA部门列表
    //品牌权限
    getBrandPermissions: {url: '/eop/eom/brandPermissions/getBrandPermissions', method: 'post'},//获取品牌权限列表
    getBrandListByUserCode: {url: '/eop/eom/brandPermissions/getBrandListByUserCode', method: 'post'},//获取品牌权限列表
    saveOrUpdateBrandPermissions: {url: '/eop/eom/brandPermissions/saveOrUpdateBrandPermissions', method: 'post'},//新增或修改品牌权限
    deletedBrandPermissions: {url: '/eop/eom/brandPermissions/deletedBrandPermissions', method: 'post'},//删除品牌权限

    //销售运营计划
    reorderPlan_getActivity: {url: '/eop/eom/reorderPlan/getActivity', method: 'post'},//活动查询
    reorderPlan_addActivity: {url: '/eop/eom/reorderPlan/addActivity', method: 'post'},//新增活动
    reorderPlan_updateActivity: {url: '/eop/eom/reorderPlan/updateActivity', method: 'post'},//编辑活动
    reorderPlan_deleteActivity: {url: '/eop/eom/reorderPlan/deleteActivity', method: 'post'},//删除活动
    reorderPlan_updateActivityDetails: {url: '/eop/eom/reorderPlan/updateActivityDetails', method: 'post'},//编辑活动明细
    reorderPlan_deleteActivityDetails: {url: '/eop/eom/reorderPlan/deleteActivityDetails', method: 'post'},//删除活动明细
    reorderPlan_getActivityDetails: {url: '/eop/eom/reorderPlan/getActivityDetails', method: 'post'},//活动明细查询
    reorderPlan_downloadActivityDetails: {url: '/eop/eom/reorderPlan/downloadActivityDetails', method: 'post'},//下载活动明细模版

    //快捷返单
    get_goods_department: {url: '/eop/eom/reorder/get_goods_department', method: 'post'},//根据款号查询部门
    check_order_price: {url: '/eop/eom/reorder/check_order_price', method: 'post'},//校验下单金额
    /**
     * 在线支付相关
     */
    create_alipay_pc_url: {url: '/eop-node/api/alipay/createPayUrlForPC', method: 'post'},//创建电脑支付链接
    eom_alipay_order: {url: '/eop/eom/alipay_order', method: 'post'},//创建电脑支付链接xin
    search_alipay_order: {url: '/eop-node/api/alipay/searchAlipayOrder', method: 'post'},//根据商家订单号查询付款记录
    get_alipay_order_list: {url: '/eop-node/api/alipay/getAlipayLogList', method: 'post'},//获取支付记录列表
    get_express_track: {url: '/eop-node/api/express/getTrackByExpressNo', method: 'get'},//根据运单号查询物流记录

    /**
     * 报表管理
     */
    get_report_list: {url: '/eop/sys/get_report_list', method: 'post'},                   //根据资源id获取报表列表
    add_report_type: {url: '/eop/sys/add_report_type', method: 'post'},                   //新增报表类型
    add_report_config: {url: '/eop/sys/add_report_config', method: 'post'},               //新增报表配置
    update_report_config: {url: '/eop/sys/update_report_config', method: 'post'},         //更新报表配置
    get_report_type_list: {url: '/eop/sys/get_report_type_list', method: 'post'},         //获取报表类型列表
    get_report_list_all: {url: '/eop/sys/get_report_list_all', method: 'post'},           //管理员获取所有报表列表
    get_report_resource: {url: '/eop/sys/get_report_resource', method: 'post'},           //根据用户id获取资源
    /**
     * 内购、代销  退换货接口
     */
    get_return_detail_list: {url: '/eop/eom/get_return_detail_list', method: 'post'},  //根据退货单号查询退货明细
    delete_logistics_img: {url: '/eop/eom/delete_logistics_img', method: 'post'},  //删除运单图片
    add_return_order: {url: '/eop/eom/spl/general/add_return_order', method: 'post'},  //新增退换货订单
    get_return_list: {url: '/eop/eom/get_return_list', method: 'post'},                   //根据单号查询退换货信息

    /**
     * 同步旺店通商品sku
     */
    sync_goods: {url: '/eop-node/api/oms/syncGoods', method: 'post'},//同步商品
    sync_skus: {url: '/eop-node/api/oms/syncSkus', method: 'post'},//同步sku
    get_last_sync_time: {url: '/eop-node/api/oms/getLastSyncTime', method: 'post'},//获取最后同步时间

    /**
     * 库存预警
     */
    get_vip_warning_list: {url: '/eop/inventory/get_vip_warning_list', method: 'post'},   //获取缺货预警列表
    get_vip_warning_qty: {url: '/eop/inventory/get_vip_warning_qty', method: 'post'},     //获取唯品会品牌及默认预警值
    /**
     * 财务对账
     */
    finance_import_data: {url: '/eop-node/api/finance/importData', method: 'post'},
    finance_get_order_list: {url: '/eop-node/api/finance/getOrderList', method: 'post'},
    finance_get_pay_list: {url: '/eop-node/api/finance/getPayList', method: 'post'},
    finance_auto_check_platform_order_pay: {url: '/eop-node/api/finance/checkPlatformOrderPay', method: 'post'},
    finance_manual_check_platform_order_pay: {url: '/eop-node/api/finance/manualCheckPlatformOrderPay', method: 'post'},
    finance_manual_check_jd_oms_order: {url: '/eop-node/api/finance/manualCheckJdOmsOrder', method: 'post'},
    finance_auto_check_jd_oms_order: {url: '/eop-node/api/finance/checkJdOms', method: 'post'},
    get_oms_jd_shop_list: {url: '/eop-node/api/oms/getJdShopList', method: 'post'},
    finance_exportBalance_data: {url: '/eop-node/api/finance/exportBalanceData', method: 'post'},
    finance_stagmusic_import_data: {url: '/eop-node/api/stagmusic/importData', method: 'post'},
    finance_check_platform_order_pay: {url: '/eop-node/api/stagmusic/manualCheckPlatormOrderPay', method: 'post'},
    finance_auto_check_stagmusic_oms_order: {url: '/eop-node/api/stagmusic/checkStagMusicOms', method: 'post'},
    finance_check_platform_order_oms: {url: '/eop-node/api/stagmusic/manualCheckPlatormOrderOms',method:'post'},
    finance_export_stagmusic_data: {url: '/eop-node/api/stagmusic/exportStagmusic',method:'post'},
   
    get_oms_stagmusic_shop_list: {url: '/eop-node/api/oms/getSmShopList', method: 'post'},
    stagmusic_import_data: {url: '/eop-node/api/stagmusic/importData', method: 'post'},
    get_oms_shop_list: {url: '/eop-node/api/oms/getOmsShopList', method: 'post'},

    finance_import_beibei_data: {url: '/eop-node/api/finance/importBeibeiData', method: 'post'},
    get_beibei_pay_info:{url:'/eop-node/api/finance/getBeibeiPayInfo',method:'post'},
    finance_auto_check_beibei_order_pay:{url:'/eop-node/api/finance/autoCheckBeibeiOrderOms',method:'post'},
    finance_export_beibei_balance_data:{url:'/eop-node/api/finance/exportBeibeiBalanceData',method:'post'},
    finance_manual_check_beibei_oms_order: {url: '/eop-node/api/finance/manualCheckBeibeiOmsOrder', method: 'post'},

    finance_import_neigou_data:{url:'/eop-node/api/finance/importNeigouData',method:'post'},
    finance_auto_check_neigou_order:{url:'/eop-node/api/finance/autoCheckNeigouOrder',method:'post'},
    finance_export_neigou_balance_data:{url:'/eop-node/api/finance/exportNeigouBalanceData',method:'post'},
    finance_export_unbalance_data:{url:'/eop-node/api/finance/exportUnBalanceData',method:'post'},

    //拼多多对账
    finance_import_pinduoduo_data:{url:'/eop-node/api/finance/importPinduoduoData',method:'post'},
    getPinduoduoFinance:{url:'/eop-node/api/finance/getPinduoduoFinance',method:'post'},
    autoCheckPinduoduoOms:{url:'/eop-node/api/finance/autoCheckPinduoduoOms',method:'post'},
    exportPinduoduoData:{url:'/eop-node/api/finance/exportPinduoduoData',method:'post'},
    
    /**
     * 消息通知
     */
    get_message_list: {url: '/eop/message/get_message_list', method: 'post'},         //根据用户id获取当前用户消息
    edit_message_status: {url: '/eop/message/edit_message_status', method: 'post'},   //修改消息状态

    /**
     *  仓库月吞吐
     */
    sale_stockout: {url: '/eop/tps/sale_stockout', method: 'post'},                              //发货汇总
    sum_per_month: {url: '/eop/tps/sum_per_month', method: 'post'},                              //吞吐量月度汇总
    purchase_return_stockin: {url: '/eop/tps/purchase_return_stockin', method: 'post'},          //大货/返修入库
    return_stockout: {url: '/eop/tps/return_stockout', method: 'post'},                          //返厂出库
    sale_return_stockin: {url: '/eop/tps/sale_return_stockin', method: 'post'},                  //销退入库
    export_tps_excel: {url: '/eop/tps/export_tps_excel', method: 'get'},

    /**
     *  首页
     */
    get_user_resource:{url:'/eop/sys/get_user_resource',method:'post'},             //根据用户id获取首页快捷资源
    add_user_resource:{url:'/eop/sys/add_user_resource',method:'post'},             //新增/编辑用户首页快捷资源
    sale_stockout: {url: '/eop/tps/sale_stockout',method: 'post'},                              //发货汇总
    sum_per_month: {url: '/eop/tps/sum_per_month',method: 'post'},                              //吞吐量月度汇总
    purchase_return_stockin: {url: '/eop/tps/purchase_return_stockin',method: 'post'},          //大货/返修入库
    return_stockout: {url: '/eop/tps/return_stockout',method: 'post'},                          //返厂出库
    sale_return_stockin: {url: '/eop/tps/sale_return_stockin',method: 'post'},                  //销退入库
    export_tps_excel: {url: '/eop/tps/export_tps_excel',method:'get'},

    /**
     *　操作日志
     */
    get_operation_log_list:{url:'/eop-node/api/user/getOperateLogList',method:'post'},//获取操作日志列表
    get_opeartion_log_summary:{url:'/eop-node/api/user/getOerationLogSummary',method:'post'},//操作日志报表
    get_sysresource_list:{url:'/eop-node/api/user/getSysResourceList',method:'post'},//获取　资源选择列表

    /**
     *　登陆日志
     */
    get_login_log_list:{url:'/eop/sys/get_login_log',method:'post'},//获取登陆日志列表

    /**
     *　小红书
     */
    importXiaohongshuData:{url:'/eop-node/api/finance/importXiaohongshuData',method:'post'},    //同步旺店通数据
    autoCheckXiaohongshuOms:{url:'/eop-node/api/finance/autoCheckXiaohongshuOms',method:'post'},    //自动核销
    manualCheckXiaohongshuOms:{url:'/eop-node/api/finance/manualCheckXiaohongshuOms',method:'post'},  //手动核销
    importXiaohongshu:{url:'/eop-node/api/finance/importXiaohongshu',method:'post'},          //导出小红书核销数据
    getXiaohongshuFinance:{url:'/eop-node/api/finance/getXiaohongshuFinance',method:'post'},        //获取小红书财务信息数据

    /**
     *  大V店 对账
     */
    importDavdianData:{url:'/eop-node/api/finance/importDavdianData',method:'post'},   
    autoDavdianOms:{url:'/eop-node/api/finance/autoDavdianOms',method:'post'},         
    exportDavdian:{url:'/eop-node/api/finance/exportDavdian',method:'post'},        
    
    /**
     *  系统公告
     */
    get_public_board:{url:'/eop/sys/get_public_board',method:'post'},           //获取系统公告

    /**
     *  云集
     */
    select_yunji_sales:{url:'/eop/oms/yunji/select_sales',method:'post'},           //查询云集活动数据
    edit_sales:{url:'/eop/oms/yunji/edit_sales',method:'post'},                     //云集活动数据修改
    delete_yunji_sales:{url:'/eop-node/api/analysis/delete_yunji_sales',method:'post'},
    /**
     *  损益维护
     */
    get_profit_loss_tm:{url:'/eop/bi/get_profit_loss_tm',method:'post'},                //获取天猫损益列表
    get_profit_loss_vip:{url:'/eop/bi/get_profit_loss_vip',method:'post'},              //获取唯品会损益列表
    // add_profit_loss:{url:'/eop/bi/add_profit_loss',method:'post'},                      //新增天猫、唯品会损益
    edit_profit_loss_vip:{url:'/eop/bi/edit_profit_loss_vip',method:'post'},
    edit_profit_loss_tm:{url:'/eop/bi/edit_profit_loss_tm',method:'post'},
    delete_profit_loss_vip:{url:'/eop/bi/delete_profit_loss_vip',method:'post'},
    delete_profit_loss_tm:{url:'/eop/bi/delete_profit_loss_tm',method:'post'},   
    add_profit_loss_tm:{url:'/eop/bi/add_profit_loss_tm',method:'post'},   
    add_profit_loss_ad_tm:{url:'/eop/bi/add_profit_loss_ad_tm',method:'post'},       
    add_profit_loss_vip:{url:'/eop/bi/add_profit_loss_vip',method:'post'},   
    edit_profit_loss_ad_tm:{url:'/eop/bi/edit_profit_loss_ad_tm',method:'post'},   
    /**
     *  数据管理  ==》财务数据
     */
    
    //包材费
    get_cost_packing:{url:'/eop/bi/get_cost_packing',method:'post'},                //获取包材费列表
    add_cost_packing:{url:'/eop/bi/add_cost_packing',method:'post'},                //新增包材费
    edit_cost_packing:{url:'/eop/bi/edit_cost_packing',method:'post'},              //修改包材费
    delete_cost_packing:{url:'/eop/bi/delete_cost_packing',method:'post'},          //删除包材费
    //快递费
    get_cost_express:{url:'/eop/bi/get_cost_express',method:'post'},                //获取快递费列表
    add_cost_express:{url:'/eop/bi/add_cost_express',method:'post'},                //新增快递费
    edit_cost_express:{url:'/eop/bi/edit_cost_express',method:'post'},              //修改快递费
    delete_cost_express:{url:'/eop/bi/delete_cost_express',method:'post'},          //删除快递费
    //税率
    get_cost_tax_rate:{url:'/eop/bi/get_cost_tax_rate',method:'post'},              //获取税率列表
    get_tax_class:{url:'/eop/bi/get_tax_class',method:'post'},                      //获取税类列表
    get_tax_detail:{url:'/eop/bi/get_tax_detail',method:'post'},                    //获取税类明细
    get_cost_tax_rate_log:{url:'/eop/bi/get_cost_tax_rate_log',method:'post'},      //获取税率修改记录
    delete_cost_tax_rate:{url:'/eop/bi/delete_cost_tax_rate',method:'post'},        //删除税率
    edit_cost_tax_rate:{url:'/eop/bi/edit_cost_tax_rate',method:'post'},            //修改税率
    add_cost_tax_rate:{url:'/eop/bi/add_cost_tax_rate',method:'post'},              //新增税率
    
    //短信费
    get_cost_message:{url:'/eop/bi/get_cost_message',method:'post'},                //获取短信费列表
    get_cost_message_log:{url:'/eop/bi/get_cost_message_log',method:'post'},        //获取短信费修改记录
    add_cost_message:{url:'/eop/bi/add_cost_message',method:'post'},                //新增短信费
    edit_cost_message:{url:'/eop/bi/edit_cost_message',method:'post'},              //修改短信费
    delete_cost_message:{url:'/eop/bi/delete_cost_message',method:'post'},          //删除短信费

    //日报项维护
    get_cost_daily:{url:'/eop/bi/get_cost_daily',method:'post'},                //获取短信费列表
    add_cost_daily:{url:'/eop/bi/add_cost_daily',method:'post'},                //新增日报项
    delete_cost_daily:{url:'/eop/bi/delete_cost_daily',method:'post'},          //删除日报项
    edit_cost_daily:{url:'/eop/bi/edit_cost_daily',method:'post'},              //修改日报项
    export_refundCash_data:{url:'/eop-node/api/analysis/export_refundCash_data',method:'post'},

    //周包项维护
    get_cost_service:{url:'/eop/bi/get_cost_service',method:'post'},         
    get_cost_weixin:{url:'/eop/bi/get_cost_weixin',method:'post'},
    edit_cost_service:{url:'/eop/bi/edit_cost_service',method:'post'},
    edit_cost_weixin:{url:'/eop/bi/edit_cost_weixin',method:'post'},
    delete_cost_service:{url:'/eop/bi/delete_cost_service',method:'post'},
    delete_cost_weixin:{url:'/eop/bi/delete_cost_weixin',method:'post'},

    //费用明细
    edit_base_cost_detail:{url:'/eop/bi/edit_base_cost_detail',method:'post'},         
    get_base_cosr_detail:{url:'/eop/bi/get_base_cosr_detail',method:'post'},  
    export_cost_detail:{url:'/eop-node/api/analysis/export_cost_detail',method:'post'},
    
    //跨域物流费
    edit_cost_kyexpress:{url:'/eop/bi/edit_cost_kyexpress',method:'post'},         
    delete_cost_kyexpress:{url:'/eop/bi/delete_cost_kyexpress',method:'post'},         
    get_cost_kyexpress:{url:'/eop/bi/get_cost_kyexpress',method:'post'},   
    add_cost_kyexpress:{url:'/eop/bi/add_cost_kyexpress',method:'post'},//物流费用新增
    getDeliverOrderByLogisticsNo:{url:'/eop-node/api/oms/getDeliverOrderByLogisticsNo',method:'post'}, //根据运单编号 查询 出库单信息
    get_delivery_area_freight:{url:'/eop-node/api/analysis/get_delivery_area_freight',method:'post'},//查询物流费用
    export_across_logistics_data:{url:'/eop-node/api/analysis/export_across_logistics_data',method:'post'},
    get_across_logistics_report_data:{url:'/eop-node/api/oms/getAcrossLogisticsReportData',method:'post'},//物流费用 报表
    export_across_logistics_report_data:{url:'/eop-node/api/oms/exportAcrossLogisticsReportData',method:'post'},//物流费用 报表导
    get_across_logistics_summary_data:{url:'/eop-node/api/analysis/getAcrossLogisticsSummaryData',method:'post'},//物流费用 汇总报表
    

    //损益管理报表
    get_variable_vip:{url:'/eop/bi/get_variable_vip',method:'post'},//唯品会变动费用
    get_variable_tm:{url:'/eop/bi/get_variable_tm',method:'post'},//天猫变动费用
    get_analysis_vip:{url:'/eop/bi/get_analysis_vip',method:'post'},//唯品会经营分析
    get_analysis_tm:{url:'/eop/bi/get_analysis_tm',method:'post'},//天猫经营分析
    exportProfitLossData:{url:'/eop-node/api/analysis/exportProfitLossData',method:'post'},
    export_variable_cost:{url:'/eop-node/api/analysis/export_variable_cost',method:'post'},
    export_analysis_tmall:{url:'/eop-node/api/analysis/export_analysis_tmall',method:'post'},
    export_analysis_vip:{url:'/eop-node/api/analysis/export_analysis_vip',method:'post'},
    get_platform_list:{url:'/eop/bi/get_platfrom_list',method:'post'},
    
    //经营看板
    bi_analysis_board_total:{url:'/eop/bi/bi_analysis_board_total',method:'post'},//唯品会经营分析
    bi_analysis_board_detail:{url:'/eop/bi/bi_analysis_board_detail',method:'post'},//唯品会经营分析
    bi_get_update_time:{url:'/eop/bi/get_update_time',method:'post'},//获取看板更新时间

    bi_brand_list:{url:'/eop/bi/get_brand_list',method:'post'},     //经营分析获取品牌列表
    get_daily_shop_list:{url:'/eop/bi/get_daily_shop_list',method:'post'},
    get_shop_list_by_platform:{url:'/eop/bi/get_sale_shop_list',method:'post'},

    //费用总览
    get_fixed_cost:{url:'/eop/bi/get_fixed_cost',method:'post'},
    export_fixed_cost:{url:'/eop-node/api/analysis/export_fixed_cost',method:'post'},
    get_variable_cost:{url:'/eop/bi/get_variable_cost',method:'post'},

    //支付宝账单 
    get_alipay_shopList:{url:'/eop-node/api/analysis/get_shopList',method:'post'},  // 店铺列表
    get_alipay_bill:{url:'/eop-node/api/analysis/get_alipay_bill',method:'post'},
    get_alipay_bill_costview:{url:'/eop-node/api/analysis/get_alipay_bill_costview',method:'post'},
    export_alipay_bill_costview:{url:'/eop-node/api/analysis/export_alipay_bill_costview',method:'post'},

    get_alipay_bill_data_integration:{url:'/eop-node/api/alipay/get_alipay_bill_data_integration',method:'post'},//支付宝账单 数据整合
    export_alipay_bill_data_integration:{url:'/eop-node/api/alipay/export_alipay_bill_data_integration',method:'post'},//支付宝账单 数据整合导出
    sync_alipay_return_refund:{url:'/eop-node/api/alipay/sync_alipay_return_refund',method:'post'},//支付宝账单 数据整合  同步退款返现数据
    sync_alipay_bill:{url:'/eop-node/api/alipay/billDownloadQuery',method:'post'},//调用支付宝接口同步支付宝账单
    sync_alipay_refund_bill:{url:'/eop-node/api/alipay/refundBillDownloadQuery',method:'post'},//调用支付宝接口同步支付宝退款账单


    //目标日消耗
    get_daily_consumpe_list:{url:'/eop-node/api/analysis/get_daily_consumpe_list',method:'post'},
    add_daily_consumpe:{url:'/eop-node/api/analysis/add_daily_consumpe',method:'post'},
    update_daily_consumpe:{url:'/eop-node/api/analysis/update_daily_consumpe',method:'post'},
    delete_daily_consumpe:{url:'/eop-node/api/analysis/delete_daily_consumpe',method:'post'},    

    //账单变动项
    get_bill_variable_data:{url:'/eop-node/api/analysis/get_bill_variable_data',method:'post'},
    export_bill_variable:{url:'/eop-node/api/analysis/export_bill_variable',method:'post'},
    add_bill_variable:{url:'/eop-node/api/analysis/add_bill_variable',method:'post'},
    update_bill_variable:{url:'/eop-node/api/analysis/update_bill_variable',method:'post'},
    delete_bill_variable:{url:'/eop-node/api/analysis/delete_bill_variable',method:'post'},

    //首页报表
    get_staff_order_report:{url:'/eop-node/api/user/getStaffOrderReport',method:'post'},
    get_work_time_report:{url:'/eop-node/api/oa/getOaWorkTimeReport',method:'post'},
    get_login_count_report:{url:'/eop-node/api/user/getLoginReport',method:'post'},
    
    //唯品会 导入参数 列表页面数据
    // get_vip_forecast_parameter_list:{url:'/eop-node/api/analysis/get_vip_forecast_parameter_list',method:'post'},
    get_vip_forecast_promotion_list:{url:'/eop/bi/get_vip_forecast_promotion_list',method:'post'},//活动参数
    get_vip_forecast_subpoint_list:{url:'/eop/bi/get_vip_forecast_subpoint_list',method:'post'},//常规参数
    add_vip_forecast_promotion:{url:'/eop/bi/add_vip_forecast_promotion',method:'post'},//新增
    edit_vip_forecast_promotion:{url:'/eop/bi/edit_vip_forecast_promotion',method:'post'},//编辑
    delete_vip_forecast_promotion:{url:'/eop/bi/delete_vip_forecast_promotion',method:'post'},//删除
    get_vip_forecast_parameter_list:{url:'/eop/bi/get_vip_forecast_parameter_list',method:'post'},//查询唯品会参数列表

    //支付宝账单===》返现
    get_return_cash_list:{url:'/eop-node/api/analysis/get_return_cash_list',method:'post'},

    //获取云集面板参数
    get_board_parameter:{url:'/eop-node/api/analysis/get_board_parameter',method:'post'},

    //唯品会发货地区名称(跨越物流费)
    get_delivery_area:{url:'/eop-node/api/analysis/get_delivery_area',method:'post'},

    //看板更新
    refresh_broad:{url:'/eop/bi/refresh_broad',method:'post'},         //根据日期刷新看板
    get_broad_status:{url:'/eop/bi/get_broad_status',method:'post'},    //获取看板刷新状态
    get_vip_status:{url:'/eop/bi/get_vip_status',method:'post'},    //获取VIP经营分析刷新状态
    get_basekpi_status:{url:'/eop/kpi/lst/get_basekpi_status',method:'post'},

    //预算完成率
    import_budget_complete_data:{url:'/eop-node/api/finance/importBudgetCompleteData',method:'post'},//导入
    get_budget_complete_list_data:{url:'/eop-node/api/finance/getBudgetCompleteListData',method:'post'},
    
    //获取平台列表
    // get_platform_list:{url:'/eop-node/api/oms/getPlatformList',method:'post'},

    /**
     *  商品外部信息
     */
    get_good_external_info_list:{url:'/eop-node/api/shop_operation/data_import/good_external_info/getList',method:'post'},
    get_good_external_info_detail:{url:'/eop-node/api/shop_operation/data_import/good_external_info/getDetail',method:'post'},
    update_good_external_info:{url:'/eop-node/api/shop_operation/data_import/good_external_info/updateData',method:'post'},
    delete_good_external_info:{url:'/eop-node/api/shop_operation/data_import/good_external_info/deleteData',method:'post'},

    /**
     *  自定义表格列
     */
    get_table_custom_list:{url:'/eop/sys/get_table_custom_list',method:'post'},
    save_table_custom:{url:'/eop/sys/save_table_custom',method:'post'},

    //预售管理
    get_pre_sale_parameters_list:{url:'/eop-node/api/shop_operation/pre_sale/parameters/getList',method:'post'},
    update_pre_sale_parameter_data:{url:'/eop-node/api/shop_operation/pre_sale/parameters/update',method:'post'},
    delete_pre_sale_parameter_data:{url:'/eop-node/api/shop_operation/pre_sale/parameters/delete',method:'post'},
    get_pre_sale_parameters_detail:{url:'/eop-node/api/shop_operation/pre_sale/parameters/detail',method:'post'},
    get_goods_info:{url:'/eop-node/api/shop_operation/pre_sale/parameters/getGoodsInfo',method:'post'},
    import_pre_sale_parameter_data:{url:'/eop-node/api/shop_operation/pre_sale/parameters/import',method:'post'},

    get_production_order_list:{url:'/eop-node/api/shop_operation/pre_sale/production_order/list',method:'post'},
    get_production_order_detail:{url:'/eop-node/api/shop_operation/pre_sale/production_order/detail',method:'post'},
    get_goods_list:{url:'/eop-node/api/oms/getGoodsList',method:'post'},
    get_class_list:{url:'/eop-node/api/oms/getClassList',method:'post'},
    sync_production_order:{url:'/eop-node/api/shop_operation/pre_sale/production_order/syncProduceOrder',method:'post'},

    //预售池
    get_presale_pool:{url:'/eop/eom/presale/get_presale_pool',method:'post'},        //查询预售池列表
    get_presale_pool_detail:{url:'/eop/eom/presale/get_presale_pool_detail',method:'post'},        //查看预售池
    submit_presale_order:{url:'/eop/eom/presale/submit_presale_order',method:'post'},       //提交预售
    get_presale_order_list:{url:'/eop/eom/presale/get_presale_order_list',method:'post'},   
    add_produce_order:{url:'/eop/eom/presale/add_produce_order',method:'post'},
    edit_presale_order:{url:'/eop/eom/presale/edit_presale_order',method:'post'},
    get_shop_list:{url:'/eop/eom/presale/get_shop_list',method:'post'},
    edit_presale_status:{url:'/eop/eom/presale/edit_presale_status',method:'post'},
    get_production_order_log:{url:'/eop-node/api/shop_operation/pre_sale/production_order/log',method:'post'},
    update_produce_order:{url:'/eop/eom/presale/update_produce_order',method:'post'},
    get_brand_list:{url:'/eop-node/api/oms/getBrandList',method:'post'},
    get_shop_by_platfromno:{url:'/eop/eom/presale/get_shop_by_platfromno',method:'post'},

    //系统按钮管理
    get_btn_list:{url:'/eop-node/api/sys/getBtnList',method:'post'},
    update_btn_data:{url:'/eop-node/api/sys/updateBtn',method:'post'},
    delete_btn_data:{url:'/eop-node/api/sys/deleteBtn',method:'post'},

    //部门管理
    check_org_unique:{url: '/eop/sys/check_org_unique', method: 'post'},
    add_org:{url: '/eop/sys/add_org', method: 'post'},
    edit_org:{url: '/eop/sys/edit_org', method: 'post'},
    delete_org:{url: '/eop/sys/delete_org', method: 'post'},
    get_user_all:{url:'/eop/sys/get_user_all',method: 'post'},

    //岗位管理
    check_post_unique:{url: '/eop/sys/check_post_unique', method: 'post'},
    add_post:{url: '/eop/sys/add_post', method: 'post'},
    edit_post:{url: '/eop/sys/edit_post', method: 'post'},
    delete_post:{url: '/eop/sys/delete_post', method: 'post'},
    get_post_fuzzy:{url: '/eop/sys/get_post_fuzzy',method:'post'},

    //绩效参数    
    import_performance_parameter:{url: '/eop/sys/import_performance_parameter', method: 'post'},
    get_performance_parameter_list:{url: '/eop/sys/get_performance_parameter_list', method: 'post'},
    edit_performance_parameter:{url: '/eop/sys/edit_performance_parameter', method: 'post'},
    delete_performance_parameter:{url: '/eop/sys/delete_performance_parameter', method: 'post'},
    add_performance_parameter:{url: '/eop/sys/add_performance_parameter', method: 'post'},
    export_sys_employee:{url: '/eop/sys/export_sys_employee', method: 'post'},
    employee_review_exist:{url: '/eop/sys/employee_review_exist', method: 'post'}, //检查个人考核是否存在
    department_review_exist:{url: '/eop/sys/department_review_exist', method: 'post'}, //检查部门考核是否存在
    get_examine_detail_list:{url: '/eop/sys/get_examine_detail_list', method: 'post'}, //根据员工id获取成长记录详情

    
    update_priv_btn_data:{url:'/eop-node/api/sys/updatePrivBtn',method:'post'},
    update_priv_other_data:{url:'/eop-node/api/sys/updatePrivOther',method:'post'},

    //属性档案
    get_good_peoperty_list:{url: '/eop/bse/get_good_peoperty_list', method: 'post'},
    add_good_property:{url: '/eop/bse/add_good_property', method: 'post'},
    edit_good_property:{url: '/eop/bse/edit_good_property', method: 'post'},
    delete_good_property:{url: '/eop/bse/delete_good_property', method: 'post'},
    //标签管理
    get_label_list:{url:'/eop/bse/get_label_list',method:'post'},
    add_good_label:{url:'/eop/bse/add_good_label',method:'post'},
    edit_good_label:{url:'/eop/bse/edit_good_label',method:'post'},
    delete_good_label:{url:'/eop/bse/delete_good_label',method:'post'},

    //损益决算
    get_final_parameter_list:{url:'/eop/bi/get_final_parameter_list',method:'post'},
    get_final_parameter_version:{url:'/eop/bi/get_final_parameter_version',method:'post'},
    delete_final_parameter:{url:'/eop/bi/delete_final_parameter',method:'post'},
    bi_final_board_detail:{url:'/eop/bi/bi_final_board_detail',method:'post'},
    bi_final_board_total:{url:'/eop/bi/bi_final_board_total',method:'post'},
    bi_final_board_version:{url:'/eop/bi/bi_final_board_version',method:'post'},
    export_final_parameter:{url:'/eop/bi/export_final_parameter',method:'get'},
    refresh_final_broad:{url:'/eop/bi/refresh_final_broad',method:'post'},
    get_final_board_status:{url:'/eop/bi/get_final_board_status',method:'post'},

    //损益决算  劳务费
    get_final_service_fee_list:{url:'/eop/bi/get_final_service_fee_list',method:'post'},
    delete_final_service_fee:{url:'/eop/bi/delete_final_service_fee',method:'post'},
    edit_final_service_fee  :{url:'/eop/bi/edit_final_service_fee',method:'post'},

    //日报项 拼多多
    get_daily_pinduouo:{url:'/eop-node/api/analysis/get_daily_pinduouo',method:'post'}, 
    del_daily_pinduoduo:{url:'/eop-node/api/analysis/del_daily_pinduoduo',method:'post'},    
    export_daily_pinduoduo:{url:'/eop-node/api/analysis/export_daily_pinduoduo',method:'post'},  

    //日报项　广告费
    get_daily_addfee:{url:'/eop-node/api/analysis/get_add_fee_list',method:'post'},
    del_daily_addfee:{url:'/eop-node/api/analysis/del_add_fee',method:'post'},
    
    //绩效考核
    save_performance_examine_data:{url:'/eop-node/api/performance/savePerformanceExamine',method:'post'},
    get_performance_examine_list_data:{url:'/eop-node/api/performance/getPerformanceExamineList',method:'post'},
    save_performance_examine_detail_data:{url:'/eop-node/api/performance/savePerformanceExamineDetail',method:'post'},
    get_performance_examine_detail_data:{url:'/eop-node/api/performance/getPerformanceExamineDetail',method:'post'},
    delete_performance_examine_data:{url:'/eop-node/api/performance/deletePerformanceExamine',method:'post'},
    export_performance_examine_data:{url:'/eop-node/api/performance/exportPerformanceExamine',method:'post'},
    get_department_tree_data:{url:'/eop-node/api/oa/getDepartmentTreeData',method:'post'},

    //唯品会
    get_vip_stock_list_data:{url:'/eop-node/api/vip/list',method:'post'},
    get_vip_goods_list:{url:'/eop/eom/vip/get_vip_goods_list',method:'post'},//唯品会商品
    import_vip_goods:{url:'/eop/eom/vip/import_vip_goods',method:'post'},//导入唯品会商品
    get_vip_brand_list:{url:'/eop/eom/vip/get_vip_brand_list',method:'post'},//查询唯品会品牌
    get_vip_class_list:{url:'/eop/eom/vip/get_vip_class_list',method:'post'},//查询唯品会品类
    export_vip_goods_list:{url:'/eop/eom/vip/export_vip_goods_list',method:'post'},//导出唯品会商品
    update_vip_config:{url:'/eop-node/api/vip/updateVipConfig',method:'post'},
    sync_vip_stock:{url:'/eop-node/api/vip/syncVipStock',method:'post'},
    

    //销售参数
    save_sales_parameter_data:{url:'/eop/bi/add_sale_parameter',method:'post'}, //新增销售参数
    edit_sales_parameter_data:{url:'/eop/bi/edit_sale_parameter',method:'post'},
    delete_sales_parameter_data:{url:'/eop/bi/delete_sale_parameter',method:'post'},
    get_sales_parameter_list:{url:'/eop/bi/get_sale_parameter',method:'post'},

    //员工档案
    get_sys_employee_list:{url:'/eop-node/api/oa/getEmployeeListData', method:'post'},
    get_department_tree_list:{url:'/eop-node/api/oa/getDepartmentTree',method:'post'},
    update_employee_data:{url:'/eop-node/api/oa/updateEmployee',       method:'post'},
    get_level_list_data:{url:'/eop-node/api/oa/getLevelListData',      method:'post'},
    sync_employee_from_oa:{url:'/eop-node/api/oa/syncEmployeeFromOa',  method:'post'},

    //考核目标
    save_performance_target_data:{url:'/eop-node/api/performance/savePerformanceTarget',method:'post'},
    get_performance_target_list_data:{url:'/eop-node/api/performance/getPerformanceTargetList',method:'post'},
    delete_performance_target_data:{url:'/eop-node/api/performance/deletePerformanceTarget',method:'post'},

    get_performance_score_standard_list_data:{url:'/eop-node/api/performance/getPerformanceScoreStandardList',method:'post'},
    save_performance_score_standard_data:{url:'/eop-node/api/performance/savePerformanceScoreStandard',method:'post'},
    delete_performance_score_standard_data:{url:'/eop-node/api/performance/deletePerformanceScoreStandard',method:'post'},

    save_performance_review_data:{url:'/eop-node/api/performance/savePerformanceReviewData',method:'post'},
    get_performance_review_list:{url:'/eop-node/api/performance/getPerformanceReviewList',method:'post'},
    get_performance_review_detail:{url:'/eop-node/api/performance/getPerformanceReviewDetail',method:'post'},
    delete_performance_review_data:{url:'/eop-node/api/performance/deletePerformanceReview',method:'post'},
    export_performance_review_data:{url:'/eop-node/api/performance/exportPerformanceReview',method:'post'},
    get_review_type_list:{url:'/eop-node/api/performance/getReviewTypeList',method:'post'},

    get_employee_list:{url:'/eop-node/api/performance/getEmployeeList',method:'post'},
    get_department_list:{url:'/eop-node/api/performance/getDepartmentList',method:'post'},

    //往来对账
    get_supplier_list:{url:'/eop/bi/get_supplier_list',method:'post'},
    add_supplier_discount:{url:'/eop/bi/add_supplier_discount',method:'post'},
    edit_supplier_discount:{url:'/eop/bi/edit_supplier_discount',method:'post'},
    delete_supplier_discount:{url:'/eop/bi/delete_supplier_discount',method:'post'},
    get_supplier_discount_list:{url:'/eop/bi/get_supplier_discount_list',method:'post'},
    import_supplier_discount:{url:'/eop/bi//import_supplier_discount',method:'post'},

    get_delay_order_list:{url:'/eop/bi/get_delay_order_list',method:'post'},//获取延期单列表
    edit_delay_order:{url:'/eop/bi//edit_delay_order',method:'post'},
    export_delay_order_list:{url:'/eop/bi/export_delay_order_list',method:'post'},
    delete_delay_order:{url:'/eop/bi//delete_delay_order',method:'post'},

    //店铺运营
    import_refund_date:{url:'/eop/eom/import_refund_date',    method:'post'}, //退货率
    get_refund_rate_list:{url:'/eop/eom/get_refund_rate_list',method:'post'},
    edit_refund_rate:{url:'/eop/eom/edit_refund_rate',        method:'post'},
    import_sale_target:{url:'/eop/eom/import_sale_target',    method:'post'},//销售指标
    get_sale_target_list:{url:'/eop/eom/get_sale_target_list',method:'post'},
    edit_sale_target:{url:'/eop/eom/edit_sale_target',        method:'post'},
    //战友成长记录
    get_examine_employee_list:{url:'/eop/sys/get_examine_employee_list', method:'post'},//查询员工列表
    get_examine_org_list:{url:'/eop/sys/get_examine_org_list',           method:'post'},//查询部门列表
    save_examine_detail:{url:'/eop/sys/save_examine_detail',             method:'post'},//批量保存成长记录
    get_employee_type_list:{url:'/eop/sys/get_employee_type_list',       method:'post'},//获取全部员工
    //商企企划 
    get_ods_update_time:{url:'/eop/business/get_ods_update_time',method:'post'},//获取数据更新时间
    get_scm_brand_list : {url:'/eop/business/get_scm_brand_list',method:'post'},//查询品牌列表
    get_class_follow_list : {url:'/eop/business/get_class_follow_list',method:'post'},//查询品类企划跟进列表
    get_wave_band_list : {url:'/eop/business/get_wave_band_list',method:'post'},//查询波段列表
    get_class_level_list: {url:'/eop/business/get_class_level_list',method:'post'},//查询品类层级
    get_goods_follow_list:{url:'/eop/business/get_goods_follow_list',method:'post'},//获取商品企划跟进列表
    get_develop_simple:{url:'/eop/business/get_develop_simple',method:'post'},//获取开发样衣数据
    get_big_order:{url:'/eop/business/get_big_order',method:'post'},//获取大货下单数据
    edit_follow_remark:{url:'/eop/business/edit_follow_remark',method:'post'},//商品企划备注详情保存
    edit_class_follow_remark:{url:'/eop/business/edit_class_follow_remark',method:'post'},//品类企划备注详情保存
    get_color_simple_list:{url:'/eop/business/get_color_simple_list',method:'post'},//获取齐色样数据
    get_purchase_follow_list:{url:'/eop/business/get_purchase_follow_list',method:'post'},//获取入库跟进数据
    get_parameters_list : {url:'/eop/business/get_parameters_list',method:'post'}, //查询企划参数列表
    get_parameters_detail_list: {url:'/eop/business/get_parameters_detail_list',method:'post'}, //根据主表Id查询企划参数明细
    delete_parameters_detail: {url:'/eop/business/delete_parameters_detail',method:'post'}, //删除企划参数id
    add_business_parameters:{url:'/eop/business/add_business_parameters',method:'post'}, //新增企划参数
    check_parameter_exist:{url:'/eop/business/check_parameter_exist',method:'post'}, //新增企划参数校验是否已经存在
    delete_parameters_header:{url:'/eop/business/delete_parameters_header',method:'post'}, //删除主表Id
    edit_business_parameters:{url:'/eop/business/edit_business_parameters',method:'post'}, //编辑企业参数
    get_brand_follow_list:{url:'/eop/business/get_brand_follow_list',method:'post'},       //查询品牌企划跟进列表
    edit_brand_follow_remark:{url:'/eop/business/edit_brand_follow_remark',method:'post'}, //编辑品牌跟进列表
    get_class_level1:{url:'/eop/business/get_class_level1',method:'post'},                //查询一级品类
    get_class_level2:{url:'/eop/business/get_class_level2',method:'post'},                //根据一级品类获取二级品类
    get_class_level3:{url:'/eop/business/get_class_level3',method:'post'},                //根据二级品类获取三级品类
    get_user_config_list:{url:'/eop/business/get_user_config_list',method:'post'},                //查询人员配置列表
    get_user_list_all:{url:'/eop/business/get_user_list_all',method:'post'},                //全部用户列表
    delete_user_config:{url:'/eop/business/delete_user_config',method:'post'},                //删除人员配置
    edit_user_config:{url:'/eop/business/edit_user_config',method:'post'},                //编辑人员配置
    add_user_config:{url:'/eop/business/add_user_config',method:'post'},                //新增人员配置
    update_goods_info:{url:'/eop/business/update_goods_info',method:'post'},                //重新获取货品资料信息
    add_question:{url:'/eop/business/add_question',method:'post'},                //新增问题    
    edit_question:{url:'/eop/business/edit_question',method:'post'},                //编辑问题  
    get_user_list_all:{url:'/eop/business/get_user_list_all',method:'post'},                //获取全部用户  
    get_brand_by_goodsNo:{url:'/eop/business/get_brand_by_goodsNo',method:'post'},                //根据款号获取品牌信息 
    get_question_detail:{url:'/eop/business/get_question_detail',method:'post'},                //根据问题编号查询明细，用于处理 


    //人力资源 
    get_department_total_list:{url:'/eop/sys/get_department_total_list',method:'post'},      //获取部门考核汇总
    get_employee_total_list:{url:'/eop/sys/get_employee_total_list',method:'post'},          //获取个人考核汇总
    export_employee_total_list:{url:'/eop/sys/export_employee_total_list',method:'post'},    //导出个人考核汇总

    export_department_total_list:{url:'/eop/sys/export_department_total_list',method:'post'}, //导出部门考核汇总
    
    //问题核查

    business_upload_deal_file    :  {url:'/eop/business/upload_deal_file',    method:'post'},    //上传处理结果附件
    business_get_config_user_list:  {url:'/eop/business/get_config_user_list',method:'post'},    //查询处理人列表
    business_get_user_list_all   :  {url:'/eop/business/get_user_list_all',   method:'post'},    //获取全部用户
    business_save_deal_result    :  {url:'/eop/business/save_deal_result',    method:'post'},    //处理问题保存
    business_commit_deal_result  :  {url:'/eop/business/commit_deal_result',  method:'post'},    //处理问题提交
    business_delete_file         :  {url:'/eop/business/delete_file',         method:'post'},    //删除文件
    business_return_question     :  {url:'/eop/business/return_question',     method:'post'},    //处理问题回退
    business_get_question_detail :  {url:'/eop/business/get_question_detail', method:'post'},    //根据问题编号查询明细，用于处理
    business_get_qusetion_list   :  {url:'/eop/business/get_qusetion_list',   method:'post'},    //根据问题编号查询明细，用于处理
    business_delete_question     :  {url:'/eop/business/delete_question',     method:'post'},    //删除问题
    business_check_question_exist:  {url:'/eop/business/check_question_exist',method:'post'},    //检验问题
    // 报废损失
    bi_get_cost_waste            :  {url:'/eop/bi/get_cost_waste',            method:'post'},   //报废损失列表
    bi_edit_cost_waste           :  {url:'/eop/bi/edit_cost_waste',           method:'post'},  //编辑

    //货品资料库
    get_goods_info_list     :  {url:'/eop/business/get_goods_info_list',     method:'post'},   //删除问题



    //开发上新

    //   任务时效配置   
    get_examine_post_list:{url:'/eop/sys/get_examine_post_list',method:'post'},//根据部门id获取OA岗位数据
    addDevelopWorkConfig:{url:'/eop/productlaunch/addDevelopWorkConfig',method:'post'},//新增工作量配置
    selectAllProjectCode:{url:'/eop/productlaunch/developTimeConfig/selectAllProjectCode',method:'post'},//失效方案
    updateInfo:{url:'/eop/productlaunch/developTimeConfig/updateInfo',method:'post'},//任务时效配置-编辑保存
    selectPage:{url:'/eop/productlaunch/developTimeConfig/selectPage',method:'post'},//任务时效配置-查询
    selectAllNodeNamesAndLevels:{url:'/eop/productlaunch/developTimeConfig/selectAllNodeNamesAndLevels',method:'post'},//根据部门id获取OA岗位数据

    productlaunch_getDevelopUserConfigList:{url:'/eop/productlaunch/getDevelopUserConfigList',method:'post'},//人员配置-查询列表
    productlaunch_developDesignerConfig_selectPage:{url:'/eop/productlaunch/developDesignerConfig/selectPage',method:'post'},//设计师绑定企划配置-分页查询
    productlaunch_developDesignerConfig_departmentListInit:{url:'/eop/productlaunch/developDesignerConfig/departmentListInit',method:'post'},//设计师绑定企划配置-获取部门列表
    productlaunch_developDesignerConfig_designerListInit:{url:'/eop/productlaunch/developDesignerConfig/designerListInit',method:'post'}, //设计师绑定企划配置-获取设计师列表
    productlaunch_developDesignerConfig_deleteById:{url:'/eop/productlaunch/developDesignerConfig/deleteById',     method:'post'}, //设计师绑定企划配置-获取设计师列表
    productlaunch_developDesignerConfig_addNewConfig:{url:'/eop/productlaunch/developDesignerConfig/addNewConfig', method:'post'}, //设计师绑定企划配置-新增
    productlaunch_developDesignerConfig_updateInfo:{url:'/eop/productlaunch/developDesignerConfig/updateInfo', method:'post'},     //设计师绑定企划配置-更新

    getDevelopWorkConfigList:{url:'/eop/productlaunch/getDevelopWorkConfigList',method:'post'},//获取工作量列表
    addDevelopWorkConfig:{url:'/eop/productlaunch/addDevelopWorkConfig',method:'post'},//新增工作量配置
    editDevelopWorkConfig:{url:'/eop/productlaunch/editDevelopWorkConfig',method:'post'},//编辑工作量
    deleteDevelopWorkConfig:{url:'/eop/productlaunch/deleteDevelopWorkConfig',method:'post'},//删除工作量配置
    //人员配置
    productlaunch_developTimeConfig_selectAllTask:{url:'/eop/productlaunch/developTimeConfig/selectAllTask',method:'post'},//所有任务获取
    productlaunch_deleteDevelopUserConfig:{url:'/eop/productlaunch/deleteDevelopUserConfig',method:'post'},//人员配置-删除
    productlaunch_addDevelopUserConfig:{url:'/eop/productlaunch/addDevelopUserConfig',method:'post'},  //人员配置-新增
    productlaunch_editDevelopUserConfig:{url:'/eop/productlaunch/editDevelopUserConfig',method:'post'},//人员配置-编辑

    //品类属性模板配置
    templateListInit:{url:'/eop/productlaunch/developClassTemplateConfig/templateListInit',method:'post'},//获取所有属性
    addNewConfigAdd:{url:'/eop/productlaunch/developClassTemplateConfig/addNewConfig',method:'post'},//新增
    selectPageAdd:{url:'/eop/productlaunch/developClassTemplateConfig/selectPage',method:'post'},//查询

    //拍照样领取管理
    productlaunch_getDevelopPhotoManageList:{url:'/eop/productlaunch/getDevelopPhotoManageList',method:'post'}, //拍照样领取管理查询
    productlaunch_saveDevelopPgotoManage:{url:'/eop/productlaunch/saveDevelopPhotoManage',method:'post'}, //保存拍照样领取
    productlaunch_cancelDevelopPhotoManage:{url:'/eop/productlaunch/cancelDevelopPhotoManage',method:'post'}, //取消拍照领取
    productlaunch_getGoodsImg:{url:'/eop/productlaunch/getGoodsImg', method:'post'}, //获取商品图片
    productlaunch_editDevelopPhotoManage:{url:'/eop/productlaunch/editDevelopPhotoManage', method:'post'},//编辑拍照样领取

    deleteByIdAdd:{url:'/eop/productlaunch/developClassTemplateConfig/deleteById',method:'post'},//删除
    updateInfoAdd:{url:'/eop/productlaunch/developClassTemplateConfig/updateInfo',method:'post'},//编辑保存
    selectDesignerInRecords:{url:'/eop/productlaunch/selectDesignerInRecords',method:'post'},//获取设计师
    updatePhotoManagerTask:{url:'/eop/productlaunch/updatePhotoManagerTask',method:'post'},//同步大货款号


    //拍摄报表管理
    productlaunch_developPhotoReportManage_selectPage        :  {url:'/eop/productlaunch/developPhotoReportManage/selectPage',        method:'post'},                 // 拍摄报表管理-分页
    productlaunch_developDesignerConfig_plannerListInit      :  {url:'/eop/productlaunch/developDesignerConfig/plannerListInit',      method:'post'},                  // 设计师绑定企划配置-获取所有的企划列表
    productlaunch_developPhotoReportManage_reBuild           :  {url:'/eop/productlaunch/developPhotoReportManage/reBuild',           method:'post'},                 // 拍摄报表管理-翻拍
    productlaunch_developPhotoReportManage_createPhotoReport :  {url:'/eop/productlaunch/developPhotoReportManage/createPhotoReport', method:'post'},                 // 拍摄报表管理-批量生成拍摄报表
    productlaunch_developPhotoReportManage_taskCodeListInit  :  {url:'/eop/productlaunch/developPhotoReportManage/taskCodeListInit',  method:'post'},                  // 拍摄报表管理-获取所有的拍摄任务状态
    productlaunch_developPhotoReportManage_updatePhotoReport :  {url:'/eop/productlaunch/developPhotoReportManage/updatePhotoReport', method:'post'},                 // 拍摄报表管理-编辑保存
    productlaunch_deleteGoodsPhotodel                        :  {url:'/eop/productlaunch/deleteGoodsPhoto',                           method:'post'},                 // 删除上传图片
    productlaunch_developDesignerConfig_designerListInit     :  {url:'/eop/productlaunch/developDesignerConfig/designerListInit',     method:'post'},                 //设计师列表
    productlaunch_developPhotoReportManage_insertPhotoReport :  {url:'/eop/productlaunch/developPhotoReportManage/insertPhotoReport', method:'post'},                 //拍摄报表管理-新增
    productlaunch_developPhotoReportManage_checkStillLifePhotoReport : {url:'/eop/productlaunch/developPhotoReportManage/checkStillLifePhotoReport', method:'post'},  //拍摄报表管理-点击 生成静物拍摄报表 按钮
    productlaunch_developPhotoReportManage_getStillLifePhotographer : {url:'/eop/productlaunch/developPhotoReportManage/getStillLifePhotographer',   method:'post'},  //拍摄报表管理-获取静物摄影师
    productlaunch_developPhotoReportManage_createStillLifePhotoReport:{url:'/eop/productlaunch/developPhotoReportManage/createStillLifePhotoReport', method:'post'},  //拍摄报表管理-提交拍摄报表

    importPhotoReport:{url:'/eop/productlaunch/developPhotoReportManage/importPhotoReport', method:'post'},  //导入拍摄报表
    handOverTaskt:{url:'/eop/productlaunch/developDesignerConfig/handOverTask', method:'post'},  //任务交接

    
    //拍摄方案
    getTaskShootingPlanList:{url:'/eop/productlaunch/getTaskShootingPlanList',method:'post'},//根据状态查询任务列表
    editDevelopTaskStatus:{url:'/eop/productlaunch/editDevelopTaskStatus',method:'post'},//待完成任务触发进行中
    getTaskShootingPlanDetail:{url:'/eop/productlaunch/getTaskShootingPlanDetail',method:'post'},//查询拍摄方案详情
    getTaskShootingPlanDetailPlanner:{url:'/eop/productlaunch/getTaskShootingPlanDetailPlanner',method:'post'},//获取默认配置人员
    deleteShootingPlan:{url:'/eop/productlaunch/deleteShootingPlan',method:'post'},//删除拍摄方案文件
    deleteMatchPlan:{url:'/eop/productlaunch/deleteMatchPlan',method:'post'},//删除搭配方案文件
    deleteStillLifePlan:{url:'/eop/productlaunch/deleteStillLifePlan',method:'post'},//删除静物方案文件
    submitTaskShootingPlan:{url:'/eop/productlaunch/submitTaskShootingPlan',method:'post'},//拍摄方案提交
    
    //外拍图片任务列表
    productlaunch_getTaskOutdoorPhotoList:{url:'/eop/productlaunch/getTaskOutdoorPhotoList',method:'post'},             //外拍图片--根据状态查询外拍图片任务列表
    productlaunch_editDevelopTaskStatus:{url:'/eop/productlaunch/editDevelopTaskStatus',    method:'post'},            //待完成任务触发进行中
    productlaunch_getDevelopOutdoorPhotoDetail:{url:'/eop/productlaunch/getDevelopOutdoorPhotoDetail', method:'post'}, //外拍图片--根据任务号查询外拍任务详情
    productlaunch_saveDevelopOriginalPhotoPath:{url:'/eop/productlaunch/saveDevelopOriginalPhotoPath', method:'post'}, //外拍图片--保存原外拍图片路径
    productlaunch_submitDevelopOutdoorPhoto:{url:'/eop/productlaunch/submitDevelopOutdoorPhoto', method:'post'},       //外拍图片--保存原外拍图片路径提交
    //外拍视频
    getTaskOutdoorVideoList:{url:'/eop/productlaunch/getTaskOutdoorVideoList',method:'post'},//根据状态查询任务列表
    saveDevelopOriginalVideoPath:{url:'/eop/productlaunch/saveDevelopOriginalVideoPath',method:'post'},//保存原外拍视频路径
    getDevelopOutdoorVideoDetail:{url:'/eop/productlaunch/getDevelopOutdoorVideoDetail',method:'post'},//根据任务号查询外拍视频任务详情
    submitDevelopOutdoorVideo:{url:'/eop/productlaunch/submitDevelopOutdoorVideo',method:'post'},//保存原外拍视频路径提交

    //静物图片列表
    productlaunch_getTaskStillLifeList:{url:'/eop/productlaunch/getTaskStillLifeList',method:'post'},//静物图片--根据状态查询静物图片任务列表
    productlaunch_getDevelopStillLifeDetail:{url:'/eop/productlaunch/getDevelopStillLifeDetail',method:'post'},//静物图片--根据任务号查询静物任务详情
    productlaunch_saveDevelopStillLifePath:{url:'/eop/productlaunch/saveDevelopStillLifePath'  ,method:'post'},//静物图片--保存原静物图片路径
    productlaunch_submitDevelopStillLife: {url:'/eop/productlaunch/submitDevelopStillLife',     method:'post'},//静物图片--保存原静物图片路径提交

    //选片任务列表
    getTaskChoosePhotoList:{url:'/eop/productlaunch/getTaskChoosePhotoList',method:'post'},//根据状态查询选片任务列表
    saveDevelopChoosePhotoPath:{url:'/eop/productlaunch/saveDevelopChoosePhotoPath',method:'post'},//保存选片路径
    submitDevelopChoosePhotoPath:{url:'/eop/productlaunch/submitDevelopChoosePhotoPath',method:'post'},//提交选片路径
    getDevelopChoosePhotoDetail:{url:'/eop/productlaunch/getDevelopChoosePhotoDetail',method:'post'},//根据任务号查询选片任务明细
    

    //选视频任务列表
    getTaskList:{url:'/eop/productlaunch/videoTask/getTaskList',method:'post'},//选视频任务列表-列表查询
    getTaskDetailByTaskCode:{url:'/eop/productlaunch/videoTask/getTaskDetailByTaskCode',method:'post'},//选视频任务-详情获取
    saveVideoPath:{url:'/eop/productlaunch/videoTask/saveVideoPath',method:'post'},//选视频任务-保存
    commit:{url:'/eop/productlaunch/videoTask/commit',method:'post'},//选视频任务-提交
    getDevelopEditorUserList:{url:'/eop/productlaunch/getDevelopEditorUserList',method:'post'},//查询美编、剪辑人员列表
    
    //上新任务
    productlaunch_getTaskProductLaunchList              : {url:'/eop/productlaunch/getTaskProductLaunchList',            method:'post'},       //上新任务--根据状态查询上新任务列表
    productlaunch_getDevelopProductLaunchDetail         : {url:'/eop/productlaunch/getDevelopProductLaunchDetail',       method:'post'},       //上新任务--根据任务号查询上新任务明细
    productlaunch_saveDevelopProductLaunchPath          : {url:'/eop/productlaunch/saveDevelopProductLaunchPath',        method:'post'},        //上新任务--保存上新链接
    productlaunch_submitDevelopProductLaunchPath        : {url:'/eop/productlaunch/submitDevelopProductLaunchPath',      method:'post'},       //上新任务--提交上新链接

    //修片任务
    productlaunch_retouchPhoto_list                     : {url:'/eop/productlaunch/retouchPhoto/list',                   method:'post'},       //修片-列表
    productlaunch_retouchPhoto_detail                   : {url:'/eop/productlaunch/retouchPhoto/detail',                 method:'post'},       //修片-详情筛选
    productlaunch_retouchPhoto_update                   : {url:'/eop/productlaunch/retouchPhoto/update',                 method:'post'},       //修片-保存/提交

    //剪辑-任务查询
    productlaunch_cutVideoTask_getTaskList              : {url:'/eop/productlaunch/cutVideoTask/getTaskList',            method:'post'},  // 剪辑-任务查询
    productlaunch_cutVideoTask_getTaskDetailByTaskCode  : {url:'/eop/productlaunch/cutVideoTask/getTaskDetailByTaskCode',method:'post'},  // 剪辑-详情查询
    productlaunch_cutVideoTask_saveFinishVideoPath      : {url:'/eop/productlaunch/cutVideoTask/saveFinishVideoPath',    method:'post'},  // 剪辑-保存完成视频路径
    productlaunch_cutVideoTask_commit                   : {url:'/eop/productlaunch/cutVideoTask/commit',                 method:'post'},  // 剪辑-提交
    
    //拍摄报表
    productlaunch_developPhotoReportManage_reportDetail : {url:'/eop/productlaunch/developPhotoReportManage/reportDetail',method:'post'},  // 资料管理--拍摄报表--列表
    productlaunch_timingDiagram_selectPage              : {url:'/eop/productlaunch/timingDiagram/selectPage',             method:'post'},  // 燃尽图任务列表接口
    productlaunch_getDevelopGoodsInfoList               : {url:'/eop/productlaunch/getDevelopGoodsInfoList',              method:'post'},  // 产品资料表--查询产品资料列表
    productlaunch_exportDevelopGoodsInfoList            : {url:'/eop/productlaunch/exportDevelopGoodsInfoList',           method:'post'},  // 产品资料表--导出产品资料
    productlaunch_developPhotoReportManage_reportExport :{url:'/eop/productlaunch/developPhotoReportManage/reportExport',  method:'post'},

    //录入产品资料
    getTaskPageList:{url:'/eop/productlaunch/DevelopTaskEntering/getTaskPageList',method:'post'},//根据任务状态获取任务列表
    detailPageSelect:{url:'/eop/productlaunch/DevelopTaskEntering/detailPageSelect',method:'post'},//任务详情
    deleteTempGoodInfoFile:{url:'/eop/productlaunch/deleteTempGoodInfoFile',method:'post'},//删除录入产品资料文件
    changeSave:{url:'/eop/productlaunch/DevelopTaskEntering/save',method:'post'},//录入产品资料-完成
    commitRl:{url:'/eop/productlaunch/DevelopTaskEntering/commit',method:'post'},//录入产品资料-编辑保存
    editForEntering:{url:'/eop/productlaunch/editForEntering',method:'post'},//录入产品资料-分类保存接口
    getPropertiesTitle:{url:'/eop/productlaunch/DevelopTaskEntering/getPropertiesTitle',method:'post'},//录入产品资料-获取属性列表
    productlaunch_recallTask :{url:'/eop/productlaunch/recallTask',method:'post'},//任务撤回

    //燃尽图详情
    timingDiagram_detail:{url:'/eop/productlaunch/timingDiagram/detail',method:'post'},//燃尽图详情接口
    remindTask:{url:'/eop/productlaunch/remindTask',method:'post'},//燃尽图详情催办
    productlaunch_developPhotoReportManage_updatePlannerBatch:{url:'/eop/productlaunch/developPhotoReportManage/updatePlannerBatch',method:'post'},//燃尽图详情催办

    //内购
    eom_get_return_list:{url:'/eop/eom/get_return_list',method:'post'},//内购订单退换货-查询退换货列表
    eom_get_status_count:{url:'/eop/eom/get_status_count',method:'post'},//内购订单退换货-查询退换货状态统计

    eom_get_return_detail_list:{url:'/eop/eom/get_return_detail_list',method:'post'},//内购订单退换货-查询退换货状态统计


    //退货原因 
    get_return_type_list:{url:'/eop/eom/get_return_type_list',method:'post'},//获取退货类型列表
    get_return_reason_list:{url:'/eop/eom/get_return_reason_list',method:'post'},//获取退货原因列表
    add_return_reason:{url:'/eop/eom/add_return_reason',method:'post'},//退货原因新增
    edit_return_reason:{url:'/eop/eom/edit_return_reason',method:'post'},//退货原因修改
    delete_return_reason:{url:'/eop/eom/delete_return_reason',method:'post'},//退货原因删除
    get_return_status_list:{url:'/eop/eom/get_return_status_list',method:'post'},//获取退货单据状态列表
    cancel_return_order:{url:'/eop/eom/cancel_return_order',method:'post'},//取消退货
    add_return_order_auto:{url:'/eop/eom/add_return_order_auto',method:'post'},//退款自动生成退货单

    eom_check_goods_status:{url:'/eop/eom/check_goods_status',method:'post'},//审核退货状态
    eom_check_refund_status:{url:'/eop/eom/check_refund_status',method:'post'},//审核退款状态
    check_order_return:{url:'/eop/eom/check_order_return',method:'post'},//订单是否符合退货条件确认
    eom_check_return_status_code:{url:'/eop/eom/check_return_status_code',method:'post'},//审核退货单校验
    eom_refund_pay_01:{url:'/eop/eom/refund_pay',method:'post'},//手动退款
    get_return_type_list_all:{url:'/eop/eom/get_return_reason_list_all',method:'post'},//获取退货原因列表下拉
    check_logistics_no:{url:'/eop/eom/check_logistics_no',method:'post'},//校验运单号是否可用

    eom_est_stockin:{url:'/eop/eom/test_stockin',       method:'post'},//收货
    eom_test_ship_order:{url:'/eop/eom/test_ship_order',method:'post'},//发货

    //采购预算
    eom_procurementBudget_getProcurementBudget:{url:'/eop/eom/procurementBudget/getProcurementBudget',method:'post'},//查询采购预售单接口
    eom_procurementBudget_deletedProcurementBudget:{url:'/eop/eom/procurementBudget/deletedProcurementBudget',method:'post'},//删除采购预售单接口
    eom_procurementBudget_updateProcurementBudget:{url:'/eop/eom/procurementBudget/updateProcurementBudget',method:'post'},//更新
    eom_procurementBudget_saveProcurementBudget:{url  :'/eop/eom/procurementBudget/saveProcurementBudget',method:'post'},//新增

    // 翻单预警
    eom_brandPermissions_getBrandListByUserCode:{url:'/eop/eom/brandPermissions/getBrandListByUserCode',method:'post'},//获取品牌权限
    eom_reorder_get_class_name:{url:'/eop/eom/reorder/get_class_name',    method:'post'},   //翻单-获取品类
    eom_reorder_get_update_time:{url:'/eop/eom/reorder/get_update_time',  method:'post'}, //查询数据更新时间
    eom_reorder_get_season_now:{url:'/eop/eom/reorder/get_season_now',  method:'post'}, //查询当前季节
};
export default methodMap; 
//   /business/get_develop_simple