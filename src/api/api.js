import { getAction, deleteAction, putAction, postAction, httpAction, uploadAction } from '@/api/manage'
import Vue from 'vue'
import {UI_CACHE_DB_DICT_DATA } from "@/store/mutation-types"

//角色管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
const queryall = (params)=>getAction("/sys/role/queryall",params);
const getRoleSiteAndTechnology = (params)=>getAction("/sys/role/getRoleSiteAndTechnology", params); // 查询已保存关系接口
const editRoleSiteAndTechnology = (params)=>postAction("/sys/role/editRoleSiteAndTechnology", params); // 保存关系接口

// 账户绑定
const listBindInfo = (params)=>getAction("/sys/sysUserMobileInfo/listBindInfo",params);
const updateMobileInfo = (params)=>postAction("/sys/sysUserMobileInfo/updateMobileInfo",params);

//用户管理
const addUser = (params)=>postAction("/sys/user/add",params);
const editUser = (params)=>putAction("/sys/user/edit",params);
const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const getUserList = (params)=>getAction("/sys/user/list",params);
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);
//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/sys/user/checkOnlyUser",params);
//改变密码
const changePassword = (params)=>putAction("/sys/user/changePassword",params);

//权限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
const getSystemMenuList = (params)=>getAction("/sys/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/sys/permission/getSystemSubmenu",params);
const getSystemSubmenuBatch = (params) => getAction('/sys/permission/getSystemSubmenuBatch', params)
const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
const queryPermissionsByUser = (params)=>getAction("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);

//二级部门管理
const queryDepartPermission = (params)=>getAction("/sys/permission/queryDepartPermission",params);
const saveDepartPermission = (params)=>postAction("/sys/permission/saveDepartPermission",params);
const queryTreeListForDeptRole = (params)=>getAction("/sys/sysDepartPermission/queryTreeListForDeptRole",params);
const queryDeptRolePermission = (params)=>getAction("/sys/sysDepartPermission/queryDeptRolePermission",params);
const saveDeptRolePermission = (params)=>postAction("/sys/sysDepartPermission/saveDeptRolePermission",params);
const queryMyDepartTreeList = (params)=>getAction("/sys/sysDepart/queryMyDeptTreeList",params);

//日志管理
//const getLogList = (params)=>getAction("/sys/log/list",params);
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/sys/dict/getDictItems/${code}`,params);
//从缓存中获取字典配置
function getDictItemsFromCache(dictCode) {
  if (Vue.ls.get(UI_CACHE_DB_DICT_DATA) && Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]) {
    let dictItems = Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode];
    console.log("-----------getDictItemsFromCache----------dictCode="+dictCode+"---- dictItems=",dictItems)
    return dictItems;
  }
}

//系统通告
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);

// 重复校验
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",params);
// 加载分类字典
const loadCategoryData = (params)=>getAction("/sys/category/loadAllData",params);
const checkRuleByCode = (params) => getAction('/sys/checkRule/checkByCode', params)
//加载我的通告信息
const getUserNoticeInfo= (params)=>getAction("/sys/sysAnnouncementSend/getMyAnnouncementSend",params);
const getTransitURL = url => `/sys/common/transitRESTful?url=${encodeURIComponent(url)}`
//工作台
const getMyAnnouncementSendNew= (params)=>getAction("/sys/sysAnnouncementSend/getMyAnnouncementSendNew",params);
const updateSysAnnounReadFlag= (params)=>postAction("/sys/sysAnnouncementSend/updateSysAnnounReadFlag",params);


//模具制造
const  getMould = (params) => postAction('/mould/select', params); // 获取新增列表数据
const postMould = (params)=>postAction("/mould/MouldNew",params); //新建 发送 数据
const searchMouldById = (params)=>getAction("/mould/selectById",params);
const importExcel = (params)=>postAction("/mould/importExcel",params);
//模具维护
const getMouldRepair = (params)=>postAction("/mouldMaintain/select",params); //获取模具维护列表数据
const postMouldRepair = (params)=>postAction("/mouldMaintain/mouldMaintainNew",params); //新建 发送 数据
const searchMouldRepairById = (params)=>getAction("/mouldMaintain/selectById",params);
const deleteMould = (params)=>postAction("/mouldMaintain/delMouldMaintain",params);
//模具新增下拉框
const getMouldOptions = (code, params)=>getAction(`/sys/ng-alain/getDictItems/${code}`, params); // 获取字典

//物料 二级库存
const getSecondData = (params)=>getAction('/secondLevelStock/page',params); // 获取二级库存列表页
const deleteSecondData = (params)=>postAction('/secondLevelStock?id='+`${params}`); // 获取二级库存列表页
const modifyInventory = (params)=>postAction('/secondLevelStock/updateStock',params); // 修改库存数量
const getBill =(params)=>getAction('/bomPlmDeliverableAudit/selectBomList?materialBill='+`${params}`); // 获取物料信息
const saveMaterialArray = (params)=>postAction('/secondLevelStock/save', params); // 上传二级库新建

//样件库 管理
const getSampleList = (params)=>getAction('/warehouse/page',params); // 获取样件库管理左侧列表
const getSampleById = (params)=>getAction('/warehouse/selectByWHIntoId',params); // 获取样件库管理右侧列表
const wareHouseScrap = (params)=>postAction('/warehouse/scrap',params); // 报废
const wareHouseUpdate = (params)=>postAction('/warehouse/updateNum',params); // 修改数量
const getStaticList = (params)=>getAction('/warehouse/pageWarehouseStatistics',params); // 样件信息统计多条件查询
const getBatchStaticList = (params)=>getAction('/warehouse/pageBatchStatistics',params); // 批次信息统计多条件查询
//样件库 入库
const getWarehousingManagement = (params)=>getAction('/warehouseInto/page',params); // 获取入库管理界面列表
const getWarehousingRecord = (params)=>getAction('/warehouseInto/pageLog',params); // 获取入库记录列表
const submitWarehousing = (params)=>postAction('/warehouseInto/intoTable',params); // 提交入库单
const submitBuy = (params)=>postAction('/warehouseInto/intoBuy',params); // 外购入库提交
const sureComplete = (params)=>postAction('/warehouseInto/complete?id='+`${params}`); // 确认完成
const selectManagerByProjectNo = (params)=>getAction('/warehouseInto/projectManager',params); // 确认完成
//样件库 回库
const getWarehousingReturnManagement = (params)=>getAction('/warehouseReturn/page',params); // 获取回库管理界面列表
const returnSureComplete = (params)=>postAction('/warehouseReturn/confirm?id='+`${params}`); // 确认完成
const getWarehousingReturnRecord = (params)=>getAction('/warehouseReturn/pageLog',params); // 获取回库记录界面列表
const returnInfo = (params)=>getAction('/warehouseReturn/queryById?id='+`${params}`); // 根据id查询批次详细信息
const submitReturn = (params)=>postAction('/warehouseReturn/return',params); // 回库单回库
const getPurpose = (params)=>getAction('/warehouseReturn/selectPurposeByProjectNo',params); // 手动回库部件号级联选择用途
const getBatch = (params)=>getAction('/warehouseReturn/selectBatchByProjectNoAndPurpose',params); // 手动回库部件号级联选择批次号
const manualReturn = (params)=>postAction('/warehouseReturn/returnHand',params); // 手动回库
//样件库报废管理
const getScrapManagement = (params)=>getAction('/warehouseScrap/page',params); // 获取报废管理界面列表
const getScrapRecord = (params)=>getAction('/warehouseScrap/pageLog',params); // 获取报废记录界面列表
const sureScrap = (params)=>postAction('/warehouseScrap/scrap', params); // 报废出库
//样件库 出库
const getWarehouseOut = (params)=>getAction('/warehouseOut/page',params); // 获取出库管理界面列表
const getWarehouseOutRecord = (params)=>getAction('/warehouseOut/pageLog',params); // 获取出库记录界面列表
const getDemandSample = (params)=>getAction('/warehouseOut/queryById?id='+`${params}`); // 根据id查询发样需求
const getWarehouseOutBatchData = (params)=>getAction('/warehouseOut/queryByBatch',params); // 获取出库批次详细信息
const outWareHousing = (params)=>postAction('/warehouseOut/outWarehouse', params); // 出库
const confirmComplete = (params)=>postAction('/warehouseOut/confirm?id='+`${params}`); // 转轮完成
//样件库 即将下线
const getOfflineData = (params)=>getAction('/trial/taskScheduling/listProductionTaskWillOffline?projectNo='+`${params}`); //  样件库-查询即将下线的数据
//样件库 待发库
const getWarehouseSend = (params)=>getAction('/warehouseSend/page',params); // 获取待发库管理界面列表
const getWarehouseStatistics = (params)=>getAction('/warehouseSend/statistics',params); // 获取待发库统计数据
const getWarehouseSendRecord = (params)=>getAction('/warehouseSend/pageLog',params); // 获取待发库记录台账数据
const getDelivery= (params)=>getAction('/warehouseSend/pageTake',params); // 获取提货管理界面列表
const confirmSend = (params)=>postAction('/warehouseSend/confirm?id='+`${params.id}` + '&shippingFlowSheet=' + `${params.shippingFlowSheet}`); // 提货完成
const confirmScrap = (params)=>postAction('/warehouseSend/scrap' , params);
const getPickById = (params)=>getAction('/warehouseSend/queryLogById?id='+`${params}`); // 根据id查询提货记录
const updateNum = (params)=>postAction('/warehouseSend/updateNum', params); // 修改数量
const getPickUpList = (params)=>getAction('/warehouseSend/listTake' , params); //获取提货列表
const postPickUpList = (params)=>postAction('/warehouseSend/takeGoods', params); // 提货


//项目信息
const  getProject = (params) => getAction('/project/listProject?projectNumber=' + `${params.projectNumber}` + '&pageNo=' + `${params.pageNo}` + '&pageSize=' + `${params.pageSize}`);
const getProjectById = (params)=>getAction("/project/getProjectById", params); // 获取项目信息 通过 id

// 中转HTTP请求
export const transitRESTful = {
  get: (url, parameter) => getAction(getTransitURL(url), parameter),
  post: (url, parameter) => postAction(getTransitURL(url), parameter),
  put: (url, parameter) => putAction(getTransitURL(url), parameter),
  http: (url, parameter) => httpAction(getTransitURL(url), parameter),
}

// 订单管理
const getOrderInformation = (params)=>getAction("/api/selectPage", params); // 获取订单列表
const getOrderById = (params)=>getAction("/api/selectOrderById", params); // 获取订单详情ById
const getOrderProgress = (params)=>getAction("/api/selectOrderDetailsById", params); // 获取订单详情-进度
const closeOrder = (params)=>getAction("/api/closeOrders", params); // 关闭订单
const checkOrderHistory = (params)=>getAction("/api/selectOrders", params); // 订单详情-查看历史记录
const selectOrderPop = (params)=>getAction("/api/selectOrderPop", params); // 订单详情-查看历史记录
const webDownloadLocal = (params)=>getAction("/api/webDownloadLocal", params); // 订单详情-下载已上传的文件

const addOrder = (params)=>postAction("/api/add", params); // 新建订单
const addAudit = (params)=>postAction("/api/addAudit", params); // 订单审批
const uploadAuditFile = (params)=>uploadAction("/api/addFileCustomer", params); // 订单审批-上传文件
const addCustomer = (params)=>postAction("/api/addCustomer", params); // 订单-客户反馈
const typeAdd = (params)=>postAction("/api/type_add", params); // 无订单填报

const getProjectInformation = (params)=>getAction("/project/listProject", params); // 获取订单弹窗-项目信息

// 物料管理
const getMaterialMaintain = (params)=>getAction("/bom/selectPage", params); // 获取模具维护列表
const getMaterialQuery = (params)=>getAction("/bom/selectManagerPage", params); // 获取模具查询列表
const getAllBomVersion = (params)=>getAction("/bom/queryAllVersionNumber", params); // 获取所有bom版本
const getBomList = (params)=>getAction("/bom/queryVersionBomList", params); // 获取bom下方list
const getImportProject = (params)=>getAction("/bom/importProjectQuery", params); // 获取bom-导入项目下方分页
const getYctList = (params)=>getAction("/bom/selectYctList", params); // bom查询-获取采购计划
const getYctProgress = (params)=>getAction("/bom/selectYctProgress", params); // bom查询-获取采购进度
const getYctPlanBus = (params)=>getAction("/bom/getYctPlanBus", params); // bom查询-获取采购进度 新版
const getYctTracking = (params)=>getAction("/bom/selectYctTracking", params); // bom查询-获取采购进度追踪
const getYctPlanBusProgress = (params)=>getAction("/bom/getYctPlanBusProgress", params); // bom查询-获取采购进度追踪 新版

const getBomDetail = (params)=>postAction("/bom/selectBomInformation", params); // 维护BOM - 获取BOM上方具体信息
const saveBom = (params)=>postAction("/bom/bomToSave", params); // bom - 保存草稿或者提交
const getBomDetailById = (params)=>postAction("/bom/selectBomInformationDetails", params); // 查看bom - 获取指定id的详情

// 获取字典
const getOptions = (code, params)=>getAction(`/sys/ng-alain/getDictItems/${code}`, params); // 获取字典

// 发运管理
const getShipListInformation = (params,params1,params2)=>postAction("/shipmentManagementInfo/selectAllShip?pageNo="+`${params1}`+"&pageSize="+`${params2}`,params); // 获取发运列表
const addShipOrder = (params)=>postAction("/shipmentManagementInfo/addShipManagement", params); // 获取发运列表
const getShipmentById = (params)=>getAction("/shipmentManagementInfo/getShipmentById", params); // 获取发运通知单
const getShipmentByFlowSheet = (params)=>getAction("/shipmentManagementInfo/getShipmentByShippingFlowSheet", params); // 获取发运通知单
const getShipNoticeInfo = (params)=>getAction("/warehouseInto/pageLog", params); // 入库记录多条件查询
const shipOrderNew = (params)=>postAction("/shipmentManagementInfo/addShipManagement", params); // 新建发运流转单
const getBatchShip = (params) => getAction('/warehouseInto/pageLog', params); // 获取批次号
const getSampleLib = (params) => getAction('/shipmentAboutWarehouse/page', params); // 获取样件库批次号
const getSampleLocation = (params) => getAction('shipmentAboutWarehouse/pageMax', params);
const getProjectNo = (params,params1,params2) => getAction("/shipmentAboutWarehouse/projectNo?projectNo="+`${params}`+"&pageNO="+`${params1}`+"&pageSize="+`${params2}`); //
const getOutgoinglibLocation = (params) => getAction("/shipmentAboutWarehouse/pageSendMax", params); //
const getOutgoinglib = (params) => getAction("/shipmentAboutWarehouse/pageSend", params); //
const closeShipOrder = (params)=>putAction("/shipmentManagementInfo/updateStatusNoticeById?shipmentManagementId="+`${params}`);
const shipOrderEdit = (params1,params2)=>putAction("/shipmentManagementInfo/updateById?id="+`${params1}`,params2);
const updateTaskStatus = (params)=>putAction("/shipmentManagementInfo/updateTaskStatusById?shipmentManagementId="+`${params}`);

// 发运过程指令
const getShipFormBaseList = (params,params1,params2)=>postAction("/shipmentProcessOrder/selectAllShipmentOder?pageNo="+`${params1}`+"&pageSize="+`${params2}`,params);
const postShipInstructionList = (params) => postAction("/shipmentProcessOrder/addShipProcessOrder", params);
const getShipListinstruction = (params,params1,params2)=>postAction("/shipmentProcessOrder/selectAllShipOrder?pageNo="+`${params1}`+"&pageSize="+`${params2}`,params);
const postEditShipInstructionList = (params) => putAction("/shipmentProcessOrder/updateByIdOrder", params);
const getShipInstructionById = (params) => getAction("/shipmentProcessOrder/selectById", params);
const getShipinstruction = (params,params1,params2)=>postAction("/shipmentProcessOrder/selectBatchShipOrder?pageNo="+`${params1}`+"&pageSize="+`${params2}`,params);

// 试制流转单 列表 模块
const getTrialFormBaseList = (params)=>getAction("/trial/formBase/list", params); // 试制流转单基础信息-分页列表查询 tab1
const getTrialFormMaintainList = (params)=>getAction("/trial/formBase/formBaseWorkList", params); // 试制流转单维护信息视图-工艺维护管理列表查询 tab2
const getTrialPrearrangementList = (params)=>getAction("/trial/formBase/formBasePrearrangementList", params); // 试制流转查询-预排信息列表 tab3
const getTrialTaskWorkList = (params)=>getAction("/trial/formBase/formBaseTaskWorkList", params); // 试制流转查询-车间视图列表 tab4
const getListTrialProcessInfo = (params)=>getAction("/trial/formBase/listTrialProcessInformation", params); // 试制流转单基础信息-试制流程信息节点查询

const closeFormBase = (params)=>postAction("/trial/formBase/closeFormBase", params); // 试制流转单关闭
const backFormBase = (params)=>postAction("/trial/formBase/backFormBase", params); // 试制流转单撤回
const saveFormBase = (params)=>postAction("/trial/formBase/saveFormBase", params); // 试制流转单保存草稿
const updateFormBase = (params)=>postAction("/trial/formBase/updateFormBase", params); // 试制流转单提交
const delFormBase = (params)=>deleteAction("/trial/formBase/delFormBase", params); // 试制流转单删除
const delFormOrderByOrderNo = (params)=>postAction("/trial/formOrder/delFormOrderByOrderNo", params); // 试制流转单创建-删除选择订单

// 试制流转单 计划预排 bin
const getProcessAndManager = (params)=>getAction("/trial/processTechnology/listTechnologyAndDuty", params); // 查询工序和负责人
const listFormPrearrangement = (params)=>getAction("/trial/formBase/listFormPrearrangement", params); // 试制计划预排-列表查询
const listLoadRate = (params)=>getAction("/trial/loadRate/listLoadRate", params); // 试制计划预排-负荷率查询
const saveOrUpdateLoadRate = (params)=>postAction("/trial/loadRate/saveOrUpdateLoadRate", params); // 试制计划预排-负荷率维护（保存）
const getFormPrearrangementByFormId = (params)=>getAction("/trial/formBase/getFormPrearrangementByFormId", params); // 试制计划预排-单独查询
const saveOrUpdatePrearrangement = (params)=>postAction("/trial/prearrangement/saveOrUpdatePrearrangement", params); // 试制计划预排-保存或更新
const getPrearrangementSiteLoadRate = (params)=>getAction("/trial/formBase/getPrearrangementSiteLoadRate", params); // 试制计划预排-试制地负荷率下拉框查询
const backPrearrangement = (params)=>postAction("/trial/formBase/backPrearrangement", params); // 试制计划预排-退回
const cancelPrearrangement = (params)=>postAction("/trial/formBase/cancelPrearrangement", params); // 试制计划预排-撤回
const getProcessInstruction = (params)=>getAction("/trial/processInstruction/getProcessInstruction", params); // 过程指令管理-其他页面查询
const processInstructionHandle = (params)=>postAction("/trial/processInstruction/processInstructionHandle", params); // 过程指令管理-其他页面查询


// 试制流转单 查询 模块
const getFormById = (params)=>getAction("/trial/formBase/getFormById", params); // 试制流转单基础信息-主键查询 tab1
const getTrialMaintainById = (params)=>getAction("/trial/formBase/getFormWorkById", params); // 试制流转单-工艺维护单查 tab2
const getTrialPreById = (params)=>getAction("/trial/prearrangement/listPrearrangementByFormId", params); // 试制流转单-预排信息单查 tab3
const getTrialQueryPlanById = (params)=>getAction("/trial/taskWorkSplit/listTaskWorkSplitPlanByFormId", params); // 试制流转单-试制策划信息单查 tab4

//试制 工艺管理
const getTrialFormBaseWorkList = (params)=>getAction("/trial/formBase/formBaseWorkList", params); //工艺维护管理列表查询
const getTrialFormById = (params)=>getAction("/trial/formBase/getFormWorkById?id="+`${params}`); //工艺维护管理列表查询
const confirmWorkPlan = (params)=>postAction("/trial/formWorkPlan/confirmWorkPlan", params); // 试制流转单提交
const SearchPlanByPLM = (params)=>getAction("/trial/formWorkPlan/listFormWorkPlanByPLM", params); //策划文件查询
const getDuty = (params)=>getAction("/trial/processTechnology/listTechnologyAndDuty", params); //获取工序负责人
const getManager = (params)=>getAction("/sys/user/getPlmUserList", params); //获取工序负责人列表
const submitManager = (params)=>postAction("/trial/processTechnology/updateFormWorkDuty", params); // 更改负责人
const confirmWork = (params)=>postAction("/trial/formWork/confirmWork", params); // 更改负责人
const selectAllOnline = (params)=>getAction("/appXMachiningDefect/selectAllOnline", params); // 分页查询X光机缺陷所有数据
const getOrder = (params)=>getAction("/trial/processInstruction/getProcessInstruction", params); // 获取过程指令
const selectAddOneQualified = (params)=>postAction("/appXMachiningDefect/selectAddOneQualified", params); // 通过主键添加合格数
const selectAddOneUnQualified = (params)=>postAction("/appXMachiningDefect/selectAddOneUnQualified", params); // 通过主键添加不合格数
const selectAddOneWaste = (params)=>postAction("/appXMachiningDefect/selectAddOneWaste", params); // 通过主键添加调机废品
const selectAllXMachiningDefectHistory = (params)=>getAction("/appXMachiningDefectHistory/selectAllXMachiningDefectHistory", params); // 分页查询X光机缺陷所有历史操作记录
const machiningDefectHistoryRevoke = (params)=>getAction("/appXMachiningDefectHistory/machiningDefectHistoryRevoke", params); // 通过主键撤销
const getIgnoreInfo = (params)=>getAction("/bom/getNotFullBomDetails", params); // 查看不足的物料齐套率信息

// 试制过程指令列表
const getTrialInstructionList = (params)=>getAction("/trial/processInstruction/listProcessInstructionPage", params); // 过程指令管理-分页列表查询
const getTrialSplitInstruction = (params)=>getAction("/trial/taskWorkSplit/listWorkSplitByInstruction", params); // 过程指令管理-新增页面查询拆单数据
const getTrialInstructionById = (params)=>getAction("/trial/processInstruction/getProcessInstructionVOById", params); // 过程指令管理-查看
const postTrialInstructionList = (params)=>postAction("/trial/processInstruction/editProcessInstruction", params); // 过程指令管理-编辑
const getProcessInstructionList = (params)=>getAction("/trial/formBase/processInstructionList", params);
const getTrialInstructionNum = (params)=>getAction("/trial/processInstruction/countProcessInstruction", params); // 试制流转单-预排信息单查

// 系统管理-工序配置
const getProcessTree = (params)=>getAction("/trial/processTechnology/listSiteProcessMachineTree", params); // 查询试制地工序机台树结构
const getProcessTreeTwo = (params)=>getAction("/trial/processTechnology/listProcessTechnologyTree", params); // 查询工序数据树结构 level-2
const postProcessTree = (params)=>postAction("/trial/processTechnology/editProcessSiteMachine", params); // 保存试制地工序机台关系
const postProcessTreeTwo = (params)=>postAction("/trial/processTechnology/editProcessTechnology", params); // 新建与编辑工序数据 level-2

// 发运计划管理
const getShipPlanMsgById = (params) => getAction("/shipmentPlan/getShipmentPlanById", params); // 通过id查询发运计划(点击查看和点击复查时间维护按钮都调用这个接口)
const getShipPlanList = (params, page) => postAction(`/shipmentPlan/selectAllShipPlan/?pageNo=${page.pageNo}&pageSize=${page.pageSize}`, params); // 分页查询所有发运计划
const editShipPlanTime = (params) => putAction(`/shipmentPlan/updateById/?planRetestDate=${params.planRetestDate}&shipmentManagementId=${params.shipmentManagementId}`, params); // 复查时间维护提交时进行修改
const downShipPlanArrs = (params) => putAction("/shipmentPlan/updatePlanStatus", params); // 复查时间维护提交时进行修改
const upDateShipPlan = (params) => putAction("/shipmentPlan/updatePlanStatusEffect", params); // 已排序的发运单更新成已生效

// 发运任务管理
const getShipTaskMsgById = (params) => getAction("/shipmentTask/getShipmentTaskById", params); // 通过id查询发运任务(点击流转单详情调用这个接口)
const getShipTaskList = (params, page) => postAction(`/shipmentTask/selectAllShipTask/?pageNo=${page.pageNo}&pageSize=${page.pageSize}`, params); // 分页查询所有发运任务
const getShipTaskListUrgnt = (params) => postAction(`/shipmentTask/selectAllShipUrgentTask/?userId=${params.userId}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`, params); // 分页查询所有发运任务
const editShipTaskaccept = (params) => putAction(`/shipmentTask/updateTaskStatusById/?shipmentManagementId=${params.shipmentManagementId}`, params); // 单条点击接收
const editShipTaskaccepts = (params) => putAction(`/shipmentTask/updateTaskStatusByIds/?shipmentManagementId=${params.shipmentManagementId}`, params); // 批量点击接收
const editShipTaskmatter = (params) => putAction("/shipmentTask/updateTaskStatusConfirm", params); // 点击物料确认提交时进行修改
const editShipTaskLogistics = (params) => putAction(`/shipmentTask/updateTaskStatusLogistics/?logisticsOrderNo=${params.logisticsOrderNo}&shipmentManagementId=${params.shipmentManagementId}`, params); // 点击物流信息维护提交时进行修改
const editShipTaskpacking = (params) => putAction("/shipmentTask/updateTaskStatusPacking", params); // 点击包装确认提交时进行修改
const editShipTaskRetask = (params) => putAction("/shipmentTask/updateTaskStatusRetask", params); // 点击复查任务提交时进行修改
const editShipTaskTakeGoods = (params) => putAction(`/shipmentTask/updateTaskStatusTakeGoods/?shipmentManagementId=${params.shipmentManagementId}`, params); // 单条点击接收
// 发运工作流-审批
const ApprovalshipOrder = (params) => putAction("/shipmentActivity/updateByIdOrder", params); // 通过shipmentManagementId发运单id进行修改
// 发运-查询出库信息
const getshipWarehouseOut = (params) => getAction("/warehouseOut/selectByShippingFlowSheet", params); // 发运单号查询出库信息

// 试制app
const getAppTrialExe = (params)=>getAction("/trial/taskScheduling/listAppProductionExecute", params); // 试制执行APP-生产执行页面查询

const getAPPTaskList = (params)=>getAction("/trial/taskScheduling/listAppProductionTask", params); // 试制执行APP-任务查询
const submitInterupt = (params)=>postAction("/appTask/getAbnormalInterrupt", params); // 试制执行APP-异常中断
const submitOnMachine = (params)=>postAction("/appTask/getOnMachine", params); // 试制执行APP-上机
const submitrestartMachine = (params)=>postAction("/appTask/getTaskRestart", params); // 试制执行APP-任务重启
const submitOffMahine= (params)=>postAction("appTask/getOutMachine", params); // 试制执行APP-下机按钮

const onMachineQuery=(params)=>getAction("/trial/processInstruction/getProcessInstruction", params); // 获取试制指令message
const getAppTrialHistoryById = (params)=>getAction("/appTaskHistory/selectTaskHistoryById", params); // 通过主键查询任务操作历史记录数据
const getTaskPlanByFromBaseId = (params)=>getAction("/trial/taskWorkSplit/listTaskPlanByFromBaseId", params); // 工序策划页面查看所有试制策划列表
const executiveFeedback = (params)=>getAction("/trial/taskScheduling/listAppProductionCompletedExecute", params); // 试制执行APP-执行反馈页面查询
const getFileByTaskCommonId = (params)=>getAction("/trial/task/plan/common/getFileByTaskCommonId", params); // 通用工艺策划-根据 taskCommonId 获取铸造工艺策划的 文件



const castingSceneSubmit= (params)=>postAction("/appCastFeedback/castFeedbackSituationSubmit", params); // 试制执行APP-压铸现场反馈现场情况反馈提交
const castingTechnologySubmit= (params)=>postAction("/appCastCraftParam/castCraftParamSubmit", params); // 试制执行APP-压铸现场反馈工艺参数确认提交
const fineSceneSubmit= (params)=>postAction("/appFinishTurning/turningSituationSubmit", params); // 试制执行APP-精车现场反馈现场情况提交
const fineTechnologySubmit= (params)=>postAction("/appFinishParameter/turningParameterSubmit", params); // 试制执行APP-精车现场反馈工艺参数确认提交
const machiningTechnologySubmit= (params)=>postAction("/appMachiningCraftParam/machiningCraftParamSubmit", params); // 试制执行APP-机加现场反馈工艺参数提交
const machiningSceneSubmit= (params)=>postAction("/appMachiningFeedback/machiningSituationSubmit", params); // 试制执行APP-机加现场反馈现场情况反馈提交
const getProcessPdf= (params)=>getAction("/trial/taskWorkSplit/download/pdf", params); //工序策划页面获取pdf
const offMachineUploadImg=(params)=>postAction("/appTask/uploadImage", params);  //下机页面上传图片

const getImgStrByProjectNumber = (params)=>getAction("/project/getImgStrByProjectNumber", params); // 根据projectNumber获取图片img

const getTaskTrialList=(params)=>postAction("/project/listProjectTimeTaskIndex", params);  //任务追踪页面获取列表
const getTrialRecordList=(params)=>postAction(`/trialProductionExecutionUpload/selectAllTrialProduction/?pageSize=${params.pageSize}&pageNo=${params.pageNo}`, params);  //执行记录上传页面获取记录列表
const getPlanByTaskId=(params)=>getAction("/trial/taskWorkSplit/getFormPlanInfoByAPPTaskId", params);  //执行记录上传 策划查看弹窗获取策划信息
const getCastingFeedback=(params)=>getAction("/appCastFeedback/selectCastFeedbackSituation", params);  //执行记录上传=>获取压铸工序异常反馈
const getFiningFeedback=(params)=>getAction("/appFinishTurning/selectTurningSituation", params);  //执行记录上传=>获取精车工序异常反馈
const getMachiningFeedback=(params)=>getAction("/appMachiningFeedback/selectMachiningSituation", params);  //执行记录上传=>获取精车工序异常反馈
const getCastingRecord=(params)=>getAction("/appCastCraftParam/selectCastCraftParam", params);  //执行记录上传=>获取精车工序参数确认
const getMachingRecord=(params)=>getAction("/appMachiningCraftParam/selectMachiningCraftParam", params);  //执行记录上传=>获取机加工序参数确认
const getFinishingRecord=(params)=>getAction("/appFinishParameter/selectTurningParameter", params);  //执行记录上传=>获取精车工序参数确认
const uploadQualitySummary=(params)=>uploadAction("/trial/uploadExecl/importExecl", params);  //执行记录上传=>上传质量总表
const  getCastingInspectionResults=(params)=>getAction("/appXMachiningDefect/selectOnlineByTaskId", params);  //执行记录上传=>获取压铸工序检查结果
const  getMachingInspectionResults=(params)=>getAction("trialProductionRoughcartResult/selectRoughcartResult", params);  //执行记录上传=>获取粗车工序检查结果
const  getHotInspectionResults=(params)=>getAction("/trialProductionHotResult/selectHotResult", params);  //执行记录上传=>获取热处理工序检查结果
const  uploadFeedbeckFile=(params)=>postAction("/trialProductionExecutionUpload/fileUpload", params);  //执行记录上传=>上传异常反馈或工艺参数文件
// 发运-包装物料查询
const BZpageShipAll_fu = () => postAction(`/shipmentTask/selectDayRetaskStatusAuxiliary`);  //分页查询包装辅材(发运流转单创建时录入的辅材清单进行统计)

const  downloadFeedbeckFile=(params)=>getAction("/trialProductionExecutionUpload/fileDownload", params);  //执行记录上传=>下载异常反馈或工艺参数文件

const BZpageShipById = (params, page) => postAction(`/shipmentTask/selectDayRetaskStatusAuxiliaryById/?pageNo=${page.pageNo}&pageSize=${page.pageSize}`, params); // 分页查询包装辅材(查看单个辅材时所用)
const getBZpageShipIds = () => postAction("/shipmentTask/selectDayRetaskStatusAuxiliaryIds");  //分页查询包装辅材(返回id集合查询单个辅材时所用)
const BZpageShipAll_zhu = (page) => postAction(`/shipmentTask/selectDayRetaskStatusMain/?pageNo=${page.pageNo}&pageSize=${page.pageSize}`); // 分页查询当天的且是复查任务状态的包装主材
// 发运-转轮任务签收
const addShipmentRunnerSignfor = (params) => postAction(`/shipmentRunnerSignfor/addShipmentRunnerSignfor`, params); // 转轮任务签收
const getShipmentRunnerSignfor=(params)=>getAction("/shipmentRunnerSignfor/getShipmentRunnerSignfor", params);  // 转轮任务签收查看
const getShipmentStatistics=()=>getAction("/shipmentManagementInfo/getShipmentStatistics");  // app发运管理首页统计

export {
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changePassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  getSystemSubmenuBatch,
  loadCategoryData,
  checkRuleByCode,
  queryDepartPermission,
  saveDepartPermission,
  queryTreeListForDeptRole,
  queryDeptRolePermission,
  saveDeptRolePermission,
  queryMyDepartTreeList,
  getUserNoticeInfo,
  getDictItemsFromCache,
  getMould,
  getProject,
  postMould,
  searchMouldById,
  getMouldRepair,
  getMouldOptions,
  postMouldRepair,
  searchMouldRepairById,
  deleteMould,
  getOrderInformation,
  getOptions,
  getProjectInformation,
  addOrder,
  getOrderById,
  addAudit,
  addCustomer,
  getOrderProgress,
  closeOrder,
  uploadAuditFile,
  checkOrderHistory,
  selectOrderPop,
  getSecondData,
  deleteSecondData,
  modifyInventory,
  getBill,
  saveMaterialArray,
  getMaterialMaintain,
  getMaterialQuery,
  getAllBomVersion,
  getBomDetail,
  getBomList,
  getImportProject,
  saveBom,
  getProjectById,
  getBomDetailById,
  getTrialFormBaseList,
  closeFormBase,
  delFormBase,
  backFormBase,
  getFormById,
  getShipListInformation,
  getShipmentById,
  shipOrderNew,
  getShipNoticeInfo,
  addShipOrder,
  getBatchShip,
  getProjectNo,
  getSampleLib,
  getSampleLocation,
  getOutgoinglibLocation,
  getOutgoinglib,
  closeShipOrder,
  shipOrderEdit,
  updateTaskStatus,
  getShipmentByFlowSheet,
  getShipFormBaseList,
  postShipInstructionList,
  getShipListinstruction,
  postEditShipInstructionList,
  getShipInstructionById,
  getShipinstruction,
  getYctList,
  getYctProgress,
  getYctPlanBus,
  getYctTracking,
  getYctPlanBusProgress,
  saveFormBase,
  updateFormBase,
  getShipPlanMsgById,
  getShipPlanList,
  editShipPlanTime,
  downShipPlanArrs,
  upDateShipPlan,
  getShipTaskMsgById,
  getShipTaskList,
  getShipTaskListUrgnt,
  editShipTaskaccept,
  editShipTaskaccepts,
  editShipTaskmatter,
  editShipTaskLogistics,
  editShipTaskpacking,
  editShipTaskRetask,
  editShipTaskTakeGoods,
  getWarehousingManagement,
  getWarehousingRecord,
  submitWarehousing,
  submitBuy,
  sureComplete,
  getWarehousingReturnManagement,
  returnSureComplete,
  getWarehousingReturnRecord,
  returnInfo,
  submitReturn,
  getWarehouseOut,
  getScrapManagement,
  getScrapRecord,
  sureScrap,
  getWarehouseOutRecord,
  getDemandSample,
  getWarehouseSend,
  getWarehouseStatistics,
  getWarehouseSendRecord,
  getDelivery,
  confirmSend,
  confirmScrap,
  getWarehouseOutBatchData,
  outWareHousing,
  confirmComplete,
  getPickById,
  updateNum,
  getPickUpList,
  postPickUpList,
  getPurpose,
  getBatch,
  manualReturn,
  getSampleList,
  getSampleById,
  wareHouseScrap,
  wareHouseUpdate,
  getTrialFormMaintainList,
  getTrialPrearrangementList,
  getTrialTaskWorkList,
  getListTrialProcessInfo,
  getProcessTree,
  getProcessAndManager,
  typeAdd,
  listFormPrearrangement,
  listLoadRate,
  saveOrUpdateLoadRate,
  getFormPrearrangementByFormId,
  saveOrUpdatePrearrangement,
  getPrearrangementSiteLoadRate,
  backPrearrangement,
  cancelPrearrangement,
  getRoleSiteAndTechnology,
  editRoleSiteAndTechnology,
  getProcessTreeTwo,
  postProcessTree,
  postProcessTreeTwo,
  getStaticList,
  getBatchStaticList,
  getTrialMaintainById,
  getTrialPreById,
  getTrialQueryPlanById,
  getTrialFormBaseWorkList,
  getTrialFormById,
  selectManagerByProjectNo,
  confirmWorkPlan,
  SearchPlanByPLM,
  getDuty,
  getManager,
  submitManager,
  confirmWork,
  getTrialInstructionList,
  postTrialInstructionList,
  getTrialInstructionById,
  getProcessInstruction,
  processInstructionHandle,
  getMyAnnouncementSendNew,
  getTrialSplitInstruction,
  selectAllOnline,
  ApprovalshipOrder,
  getAppTrialExe,
  getTrialInstructionNum,
  getAppTrialHistoryById,
  updateSysAnnounReadFlag,
  getAPPTaskList,
  submitInterupt,
  executiveFeedback,
  getOrder,
  submitOnMachine,
  submitrestartMachine,
  submitOffMahine,
  getshipWarehouseOut,
  selectAddOneQualified,
  selectAddOneUnQualified,
  selectAddOneWaste,
  selectAllXMachiningDefectHistory,
  machiningDefectHistoryRevoke,
  onMachineQuery,
  getTaskPlanByFromBaseId,
  getFileByTaskCommonId,
  castingSceneSubmit,
  castingTechnologySubmit,
  fineSceneSubmit,
  fineTechnologySubmit,
  machiningTechnologySubmit,
  machiningSceneSubmit,
  getProcessPdf,
  offMachineUploadImg,
  getImgStrByProjectNumber,
  getTaskTrialList,
  getTrialRecordList,
  getPlanByTaskId,
  getCastingFeedback,
  getFiningFeedback,
  getMachiningFeedback,
  getFinishingRecord,
  getMachingRecord,
  getCastingRecord,
  getOfflineData,
  getProcessInstructionList,
  webDownloadLocal,
  importExcel,
  uploadQualitySummary,
  getCastingInspectionResults,
  getMachingInspectionResults,
  getHotInspectionResults,
  uploadFeedbeckFile,
  BZpageShipAll_fu,
  BZpageShipById,
  getBZpageShipIds,
  BZpageShipAll_zhu,
  addShipmentRunnerSignfor,
  getShipmentRunnerSignfor,
  getShipmentStatistics,
  downloadFeedbeckFile,
  getIgnoreInfo,
  listBindInfo,
  updateMobileInfo,
  delFormOrderByOrderNo
}
