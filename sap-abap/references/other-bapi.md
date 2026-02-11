# 其他模块常用 BAPI 列表

## SD模块

### 1.销售订单

- **BAPI_SALESORDER_CREATEFROMDAT2** 普通销售订单
- **SD_SALESDOCUMENT_CREATE** 销售订单
- **SD_SALESDOCUMENT_CREATE** 退货订单
- **BAPI_SALESORDER_CHANGE** 修改或者删除销售订单
- **BAPI_PRICES_CONDITIONS** 创建销售价格

*注意：退货订单、借项凭证及贷项凭证（VA01）均不能用BAPI_SALESORDER_CREATEFROMDAT2创建、系统会报错(不允许业务对象 BUS2032 和销售凭证类别 H 的组合)，需使用函数SD_SALESDOCUMENT_CREATE*

### 2.交货单

- **BAPI_OUTB_DELIVERY_CREATE_SLS** 根据销售订单创建交货单
- **BAPI_DELIVERYPROCESSING_EXEC** 创建内向交货单
- **BAPI_OUTB_DELIVERY_READ_SLS** 根据销售订单创建交货单,得到交货单创建初始页面所需数据
- **BAPI_OUTB_DELIVERY_CHANGE** 执行拆分、拣配、交货单修改操作
- **BAPI_OUTB_DELIVERY_GETDETAIL** 根据交货单号获取单据详细内容
- **SD_DELIVERY_UPDATE_PICKING** 更改拣配数量

**交货单捡配时用到的主要表**：
- likp
- lips
- mchb(批次级库存)
- mard(库存地点级库存)
- mch1（批次主数据）
- vbbe（批次交货计划，会占用实际可用库存、导致捡配的时候实际可用库存减少）
- Vbuk（单据状态表）
- T100（消息号对应的文本信息，做消息可视化用，方便运维）

### 3.发票

- **BAPI_BILLINGDOC_CREATEMULTIPLE** 创建发票，注意参数ref_doc_ca
- **MB_CANCEL_GOODS_MOVEMENT** 冲销交货单的过账发货
- **BAPI_BILLINGDOC_CANCEL** 发票的冲销
- **WS_DELIVERY_UPDATE** 交货单发货过账

*注意，每次调用WS_DELIVERY_UPDATE前需要执行以下代码段，否则会出现莫名奇妙的错误。*
```abap
CALL FUNCTION 'RV_DELIVERY_INIT'.
```

### 4.客户

- **SD_CUSTOMER_MAINTAIN_ALL** 创建客户
  *table参数中有很多表，其中X打头代表要插入的数据，Y打头代表要删除的数据.*

- **cl_md_bp_maintain=>maintain** 创建、修改、扩充客户主数据



## FI模块

1. **K_HIERARCHY_TABLES_READ** 成本要素组明细
2. **BAPI_ACC_DOCUMENT_POST** 创建会计凭证
3. **BAPI_ACC_DOCUMENT_REV_POST** 反冲会计凭证
4. **POSTING_INTERFACE_START**、**POSTING_INTERFACE_CLEARING**、**POSTING_INTERFACE_END** 清账（核销）
   *注意：POSTING_INTERFACE_CLEARING并非纯函数，本质上是call bdc.*



## PP模块（生产计划模块）

### 1.工艺路线

- **BAPI_ROUTING_CREATE** 创建工艺路线
- **BAPI_ROUTING_EXISTENCE_CHECK** 检查工艺路线是否存在

### 2.参考操作集

- **BAPI_REFSETOFOPERATIONS_CREATE** 创建参考参考工序集
- **BAPI_REFSETOFOPR_EXISTENCE_CHK** 检查参考参考工序集

### 3.计划订单

- **BAPI_PLANNEDORDER_CREATE** 创建计划订单
- **BAPI_PLANNEDORDER_CHANGE** 修改计划订单
- **BAPI_PLANNEDORDER_DELETE** 删除计划订单
- **BAPI_PLANNEDORDER_EXIST_CHECK** 检查计划订单是否存在
- **BAPI_PLANNEDORDER_GET_DETAIL** 获取计划订单详细信息
- **BAPI_PLANNEDORDER_GET_DET_LIST** 获得计划订单信息

### 4.计划独立需求

- **BAPI_REQUIREMENTS_CREATE** 创建计划独立需求
- **BAPI_REQUIREMENTS_CHANGE** 修改计划独立需求
- **BAPI_REQUIREMENTS_GETDETAIL** 获取计划独立需求

### 5.生产订单

- **BAPI_PRODORD_CREATE** 创建生产订单
- **BAPI_PRODORD_CHANGE** 修改生产订单
- **BAPI_PRODORD_RELEASE** 下达生产订单
- **BAPI_PRODORD_CLOSE** 关闭生产订单
- **BAPI_PRODORD_EXIST_CHECK** 确认检查性
- **BAPI_PRODORD_GET_LIST** 列表抬头订单
- **BAPI_PRODORD_GET_DETAIL** 抬头订单明细
- **BAPI_PRODORD_SETUSERSTATUS** 设置用户状态
- **BAPI_PRODORD_REVOKEUSERSTATUS** 取消用户状态
- **BAPI_PRODORD_SET_DEL_INDICATOR** 设置删除标识
- **BAPI_PRODORD_SET_DELETION_FLAG** 设置删除标识
- **BAPI_PRODORD_CREATE_FROM_PLORD** 创建带有计划订单
- **BAPI_PRODORD_CREATE_FROM_REF** 创建模板
- **BAPI_PRODORD_CREATE_CAP_REQ** 产生能力需求
- **BAPI_PRODORD_COSTING** 创建成本估计
- **BAPI_PRODORD_COMPLETE_TECH** 完整的技术
- **BAPI_PRODORD_CHECK_MAT_AVAIL** 检查物料可用性

### 6.生产订单确认

- **BAPI_PRODORDCONF_GETLIST** 生产订单确认
- **BAPI_PRODORDCONF_GET_TE_PROP** 确认计工单
- **BAPI_PRODORDCONF_GETDETAIL** 生产订单确认详细信息
- **BAPI_PRODORDCONF_GET_HDR_PROP** 确认计划订单
- **BAPI_PRODORDCONF_EXIST_CHK** 检查工单是否存在

## CO模块（成本中心会计模块）

- 通常涉及到成本中心的创建、修改和删除等操作，具体的 BAPI 需要根据业务需求查找

## QM模块（质量管理模块）

### 1.检验计划

- **BAPI_INSPECTIONPLAN_CREATE** 检验计划创建
- **CPCC_S_TASK_LIST_MAINTAIN** 检验计划分配

## PM模块（工厂维护模块）

### 1.计量点

- **BAPI_OBJCL_CREATE** 计量点通用属性导入
- **BAPI_OBJCL_CHANGE** 计量点通用属性修改
- **BAPI_OBJCL_GETDETAIL** 计量点通用属性明细

### 2.计量凭证

- **MEASUREM_DOCUM_RFC_SINGLE_001** 计量凭证创建

## PS模块（项目系统模块）

### 1.项目

- **BAPI_PS_INITIALIZATION** 创建项目定义
- **BAPI_BUS2001_CREATE** 创建项目定义
- **BAPI_PS_PRECOMMIT** 创建项目定义

### 2.WBS

- **BAPI_PS_INITIALIZATION** 创建WBS
- **BAPI_BUS2054_CREATE_MULTI** 创建WBS
- **BAPI_PS_PRECOMMIT** 创建WBS
- **KBPP_EXTERN_UPDATE_CO** 修改项目和WBS的预算

*注意：创建WBS的时候，注意参数 wbs_left和 wbs_up，这个是创建有层级的WBS必须要填写的*

## HR模块（人力资源模块）

1. **BAPI_EMPLOYEE_CREATE** 创建员工主数据
2. **BAPI_EMPLOYEE_GET_DETAIL** 获取员工详细信息

## AM模块（资产管理模块）

1. **BAPI_ASSET_CREATE** 创建资产
2. **BAPI_ASSET_GET_DETAIL** 获取资产详细信息

## SCM模块（供应链管理模块）

1. **BAPI_PO_CREATE1** 创建采购订单
2. **BAPI_PO_CHANGE** 修改采购订单
3. **BAPI_PO_GETDETAIL** 获取采购订单明细

## FI-BANK模块（银行会计模块）

1. **BAPI_BANKACCOUNT_GET_DETAIL** 获取银行账户详细信息

## CRM模块（客户关系管理模块）

1. **BAPI_CRM_SALES_DOCUMENT_CREATE** 创建销售文档

## RE模块（研发管理模块）

1. **BAPI_BOM_CREATE** 创建物料清单（BOM）

## SM模块（服务管理模块）

1. **BAPI_ORDER_CREATE** 创建服务订单

## EHS模块（环境、健康与安全模块）

1. **BAPI_MATERIAL_HAZARD_GET_DETAIL** 获取物料危险详细信息

## TR模块（贸易管理模块）

1. **BAPI_TRADE_AGREEMENT_GET_DETAIL** 获取贸易协议详细信息

## GTS模块（全球贸易服务模块）

1. **BAPI_GTS_HEADER_CREATE** 创建全球贸易服务头部信息