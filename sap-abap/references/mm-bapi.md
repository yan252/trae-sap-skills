# ABAP 物料MM模块常用 BAPI 列表及使用场景

## 1. 物料主数据

- **BAPI_MATERIAL_SAVEDATA** 创建物料主数据
- **BAPI_OBJCL_CREATE** 分类视图的创建
- **BAPI_OBJCL_GETCLASSES** 分类视图得到详细信息
- **BAPI_MATERIAL_SAVEREPLICA** 物料视图的扩充
- **BAPI_GOODSMVT_CREATE** 创建物料凭证(MIGO),注意表T158G可以决定GOODSMVT_CODE
- **BAPI_GOODSMVT_CANCEL** 冲销物料凭证
- **BAPI_GOODSMVT_GETDETAIL** 显示物料异动明细
- **BAPI_GOODSMVT_GETITEMS** 显示物料文件的明细清单

**代码示例**：
```abap
WA_BAPI_TE_MARA-MATERIAL = ITAB_UP-MATNR.
T_EXTENSIONIN-STRUCTURE = 'BAPI_TE_MARA'.
T_EXTENSIONIN-VALUEPART1 = WA_BAPI_TE_MARA.
APPEND T_EXTENSIONIN.

WA_BAPI_TE_MARAX-MATERIAL = ITAB_UP-MATNR.
T_EXTENSIONINX-STRUCTURE = 'BAPI_TE_MARAX'.
T_EXTENSIONINX-VALUEPART1 = WA_BAPI_TE_MARAX.
APPEND T_EXTENSIONINX.
```

## 2. 采购申请

- **BAPI_PR_CREATE** 创建PR

## 3. 采购订单

- **BAPI_PO_CREATE1** 创建采购订单PO
- **BAPI_PO_CREATEREF_PR** 根据采购申请创建采购订单PO
- **BAPI_PO_CHANGE** 修改和删除PO
- **BAPI_PO_GETDETAIL** 显示采购订单PO明细
- **BAPI_PO_RELEASE** 审批采购订单PO
- **BAPI_PO_RESET_RELEASE** 取消审批采购订单PO
- **BAPI_REQUISITION_CREATE** 创建请购单
- **BAPI_REQUISITION_CHANGE** 删除请购单
- **BAPI_REQUISITION_GETDETAIL** 显示请购单明细
- **BAPI_REQUISITION_RELEASE_GEN** 核发请购单
- **BAPI_OUTB_DELIVERY_CREATE_STO** 创建STO交货单
- **WS_REVERSE_GOODS_ISSUE** 冲销交货单的过账发货
- **BAPI_RESERVATION_CREATE1** 创建预留
- **BAPI_RESERVATION_CHANGE** 修改和删除预留
- **PRICES_CHANGE** 更改物料移动平均价或者标准价格
- **PRICES_POST** 更改物料移动平均价或者标准价格

*注意：如果要检查ATP，必须使用第二个*

## 4. 物料分类&特性

- **BAPI_OBJCL_CREATE** 建立/更改物料主档分类
- **BAPI_OBJCL_CHANGE** 建立/更改物料主档分类
- **CLMM_MAINTAIN_CLASSIFICATIONS** 批量建立/更改物料主档分类
- **CLAF_CLASSIFICATION_OF_OBJECTS** 显示物料主档分类特性值
- **BAPI_MATERIAL_EXISTENCECHECK** 检查物料主档是否存在
- **BAPI_MATERIAL_GETLIST** 显示物料主档明细
- **BAPI_CHARACT_CREATE** 建立特性
- **BAPI_CHARACT_CHANGE** 更改特性
- **BAPI_CHARACT_DELETE** 删除特性
- **BAPI_CHARACT_RENAME** 重新命名特性
- **BAPI_CHARACT_GETDETAIL** 读取特性属性
- **BAPI_CHARACT_ADDLONGTEXT** 创建特性或者数值的特性长文本
- **BAPI_CHARACT_REMOVELONGTEXT** 删除特性或者数值的特性长文本
- **BAPI_CHARACT_GETLONGTEXT** 读取特性或者数值的特性长文本
- **CARD_CHARACTERISTIC_READ** 显示特性值的值列表
- **BAPI_CLASS_CREATE** 建立类别
- **BAPI_CLASS_CHANGE** 更改类别
- **BAPI_CLASS_DELETE** 删除类别
- **BAPI_CLASS_GETDETAIL** 读取类别资讯(取分类下特性及特性值)
- **BAPI_CLASS_EXISTENCECHECK** 检查物件存在性

## 5. 供应商

- **BAPI_VENDOR_GETDETAIL** 显示供应商明细
- **BAPI_VENDOR_EXISTENCECHECK** 检查存在性
- **BAPI_MATERIALGROUP_GET_LIST** 读取物料群组/物料群组说明

## GOODSMVT_CODE参数对应值

| GOODSMVT_CODE | 事务码 |
|--------------|--------|
| 01           | MB01   |
| 02           | MB31   |
| 03           | MB1A   |
| 04           | MB1B   |
| 05           | MB1C   |
| 06           | MB11   |
| 07           | MB04   |
