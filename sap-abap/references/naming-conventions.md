# SAP ABAP 命名规范标准

## 2.2.1. 命名规范基本结构

命名规范的基本结构如下所示：

```
'Z' or 'Y' + (模块标识符) + (标识符：一至两个字母) + (序号三位)
```

- **命名规则**：命名一个对象的时候都以'Y'或者'Z'开头（Y表示临时对象，不传输或测试）
- **标识符**：用来区分该对象的类别
- **模块标识符**：用来指明所属模块
- **例外情况**：无法应用Naming Rule的情况可以使用其他例外结构

---

## 2.2.2. 自开发对象生命周期管理

过期的Object及还未使用的Object的管理标准如下：

| 序号 | 处置方式 | 说明 |
| :--- | :--- | :--- |
| 1 | 删除所有不使用的object | 由负责人删除 |
| 2 | 无法立即删除的情况下 | 在Description里插入"废弃"字样 |
| 3 | 测试程序使用结束后 | 立即进行删除 |

> 以上处置程序由相关程序开发人员执行。

---

## 2.2.3. 流程模块命名

流程模块命名为2至4位字符，以按业务流程来区分，跨业务流程模块的以服务提供方作为流程模块命名。

### (1) 模块命名规则

| 流程模块 | 名称 |
| :--- | :--- |
| OTC | 销售 |
| PTP | 生产 |
| RTR | 财务 |
| LM | 物流 |
| HR | 人事 |
| PM | 设备 |
| MDG | 主数据 |
| STP | 采购 |
| EWM | 仓储 |
| TR | 资金 |
| CCD | 授信 |
| BPC | 预算 |

---

## 2.2.4. Package 开发包

### (2) 第一层：Package 项目名称
- 命名：`ZAPP`

### (3) 第二层：SubPackage（各流程模块统一个）
- 命名规则：`Z + 流程模块名`
- 示例：`ZMDG`、`ZHR`、`ZPM`

> Package由开发负责人统一创建，需要的可以提出申请，适用于各系统如CRM、SRM等。

---

## 2.2.5. ABAP Dictionary Object

### (4) Object 类型

| 标识 | 类型 | 含义 |
| :--- | :--- | :--- |
| T | Table | 数据库表 |
| V | View | 数据库视图 |
| S | Structure | 结构 |
| LT | Table Type | 使用Line Type来定义表的时候使用 |
| TG | Type Group | 类型组 |
| SH | Search Help | 搜索帮助 |

### (5) Tables Name

**命名规范**：`Z + MDG + T + nnnnn + T (可选)`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| T | 表示Table |
| nnnnn | 五个数字的组合，数字的递增是10为单位 |
| T | 文本表标识（可选） |

**说明**：当后期业务需要加入新表的时候，可以考虑在两张序号连续的表中插入，这个时候递增单位可以是1（例：`ZMMT00013`）

**范例**：
- `ZMDGT00010`：MDG模块Master Data的第一张自建表
- `ZMDGT00010T`：MDG模块Delivery Order的第一张自建表文本表

**描述**：`[流程模块] + 该表用途的描述`

**注意事项**：
1. 用于存放主数据的文本表后面加字母'T'
2. 字段的定义必须用Data Element，不能使用原始类型

### (6) Structure Name

**命名规范**：`Z + LM + S + xxxxxxxxxxxxxxx`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| LM | 流程模块 |
| S | Structure |
| xxxxxxxxxx | 数字/英文/ (15char以内) |

**说明**：
- 增加数字时各增加10
- 英文标记时，首字母可以使用罗马字母

**举例**：`ZLMSCAR_MASTER` — LM模块 车辆主数据

**Description**：`[流程模块] + Structure 用途描述`

**增强结构**：以`ZAS`开头，后加有意义的字符区分，即：`ZAS + 有意义的字符`

**注意事项**：所有字段的Data Element中，没有特殊原因一定要分配Data Element（不使用Predefined type）

### (7) View Name

**命名规范**：`Z + MDG + V + nnnnn + x(View type)`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| V | View区分字符 |
| nnnnn | 五个数字的组合，数字的递增是10为单位 |
| x | View类型标识 |

**View类型标识**：
| 标识 | 类型 |
| :--- | :--- |
| D | Database view |
| P | Projection View |
| M | Maintenance View |
| C | View Cluster |
| H | Help View |

**说明**：追加View中间可以插入，可以增减1单位（例：`ZMMVHQ00011D`）

**举例**：`ZMDGV00010D` — MDG模块基本信息 Database view

**Description**：`[流程模块] + view 用途描述`

**Maintenance View的情况**：
1. SE11中生成View的情况遵守上述命名规则
2. SE11中进入Table后生成Utility - table maintenance generator的情况时统一table名和View名。函数组命名为`ZFGM_`开头

### (8) Table type

**命名规范**：`Z + LT_ + MDG + xxxxxx`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| LT_ | Table Type类型区分字符 |
| MDG | 流程模块（可选） |
| xxxxxxx | 数字/英文/ 15char（最大15位） |

**举例**：`ZLT_MDG001` — MDG模块标准信息 table Type

**Description**：用途描述

### (9) Search Help Name

**命名规范**：`ZSH_ + MDG（可选） + _xxx...`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| SH_ | Search Help Object区分字符 |
| MDG | 流程模块 |
| _xxx... | Reference field name/Data Element name |

**说明**：首位中区分字符要包含'_'

**举例**：`ZSH_MDG_MATNR` — 物料编码 Search Help

**Description**：Search Help用途描述

### (10) Type Group Name

**命名规范**：`ZTG + nn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 区分字符 |
| TG | Type Group区分字符 |
| nn | 2位数字的组合，数字的递增是1为单位 |

**举例**：`ZTG01` — MDG模块标准信息 Type Groups

**Description**：Type Group用途描述

### (11) Data Element Name

**命名规范**：`Z + MDG(可选) + xxxxx..x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 区分字符 |
| MDG | 流程模块（可选） |
| xxxxx...x | 用户定义：个性区分中可以使用有意义的字母与英文缩写（最大29位） |

**举例**：`ZMATNR` — 物料编码 Data Element

**Description**：Data Element用途描述

### (12) Domain Name

**命名规范**：`ZDM + MDG(可选) + xxxxx...xx`

| 组成部分 | 说明 |
| :--- | :--- |
| ZDM | 区分字符 |
| xxxxx....xx | 个性区分中可以使用有意义的字母与英文缩写（最大29位） |
| MDG（可选） | 流程模块（可选） |

**举例**：
- `ZDMTR_MBLNR` — 电话号码区分
- `ZDMSD_STATUS` — 开票状态

**Description**：Domain用途描述

### (13) Lock Object Name

**命名规范**：`EZ_ + xxxx...x`

| 组成部分 | 说明 |
| :--- | :--- |
| EZ | 表示锁对象自建 |
| xxxx...x | 要挂Lock的Object名（例：Table等） |

**举例**：`EZ_ZMDGT00010` — 为MDG模块标准信息table的Lock Object

**Description**：Lock Object用途描述

### (14) Field Name

**命名规范**：与数据元素一致（不带Z）

**说明**：SAP中如果有提供的Field使用SAP Field，没有的情况设计/开发人员采用具有意义的英文缩略词或中文描述

**举例**：`matnr`

**Description**：Field名

**注意事项**：所有字段的Data Element，如果没有特殊需求，必要分配Data Element（不能使用predefined type）

---

## 2.2.6. Class Definition & Implementation

### (15) Class Name

**命名规范**：`ZCL + _ + MDG + _ + xx...x_xx...x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| CL | 表示是类 |
| MDG | 流程模块 |
| xx...x_xx...x | 区分接口用途进行描述即可（最多24个字符） |

**范例**：
- `ZCL_MDG_PURCHASE_ORDER` — MDG模块 PO相关的Class
- `ZCL_CO_TEXT` — CO模块跟文本相关的Class

**描述**：`[流程模块] + 类的用途描述`

### (16) Interface

**命名规则**：`ZIF + _ + MM + _ + xx...x_xx...x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| IF | Interface |
| MDG | 流程模块 |
| xx...x_xx.x...x | 区分Interface用途进行描述（最大24位） |

**举例**：`ZIF_MDG_GLONETS_SEND`

**Description**：`[业务名] ... Interface的用途描述`

### (17) BADI Enhancement Spot Name

**命名规则**：`ZES + _ + xx...x_xx...x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 区分字符 |
| ES | BAdI Enhancement Spot |
| xx...x_xx.x...x | 增强标准程序名 |

**举例**：`ZES_MV45A`

**Description**：一个标准程序只能有一个增强点

### (18) BADI Name

**命名规则**：`ZBD + _ + xx...x_xx...x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| BD | BAdI Name |
| xx...x_xx.x...x | 最底层可增强对象名 |

**举例**：`ZBD_ZXC01U06`

**Description**：`[流程模块]Badi描述`

### (19) BAdI Implementation Name

**命名规则**：`ZIM + _（MDG） + BAdI Definition Name`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| IM | BAdI Implementation |
| MDG | 模块名称（可选） |
| BAdI Definition | BADI Name通过可能的缩略词表达增强的意思 |

**举例**：`ZIM_MDG_`

**Description**：`[业务名] BAdI的用途描述`

### (20) Method Name

Class/Interface的Method Name

**命名规则**：`xxxx...xxx`

**交付物标记法**：`Class Name + => + xxxx...xxx`（代替程序设计书的程序ID标记）

**说明**：`xxxx...xxx` 区分用途进行描述（最大30位）

**举例**：
- `ZCL_CO_TEXT=>GET_AUART` — Get AUART text TXT (Order Type)
- `ZCL_PP_DATE=>WORKING_DAY_CALCULATE` — Calculate working day based Factory calendar(Include W/C)

### (21) Method parameters

Class/Interface的parameter Name

**命名规则**：`X (parameter type) + a (data type-option) + xxx...xx`

| 组成部分 | 说明 |
| :--- | :--- |
| X | 参数类型标识 |
| a | 数据类型选项（适用于特定情况） |
| xxx...x | 使用可以区分Parameter的用途/职能的单词 |

**参数类型标识 (X)**：
| 标识 | 含义 |
| :--- | :--- |
| I | Importing parameters |
| E | Exporting parameters |
| C | Changing parameters |

**数据类型选项 (a)**：
| 标识 | 含义 |
| :--- | :--- |
| T | Table (type) or Range table |
| S | Work Area/Structures |
| V | Variable |
| R | Reference to object |

**举例**：
- `IV_RYEAR` — 会计年度 (Importing)
- `ET_ACTIVITY` — Selected Activity(Exporting Table)

---

## 2.2.7. ABAP Programming Object

### (22) 概要

对于与ABAP程序相关的Object规定命名规则。

**命名规则使用优先级**（按顺序套用）：
1. Dialogue（第1级）
2. Interface（第2级）
3. Report（第3级）
4. BDC（第4级）
5. Conversion（第5级）
6. Form（第6级）

| 程序类型 | 标识符(Identifiers) | 说明 |
| :--- | :--- | :--- |
| 报表(Report) | R | 报表程序 |
| 接口(Interface) | I | 输入输出接口程序 |
| BDC(Batch Data Conversion) | B | 批处理输入程序 |
| 转换(Transaction/Conversion) | C | 上线及重大升级数据转换程序 |
| 增强（Enhancement） | E | 含全新开发的功能程序 |
| 表格（Form） | F | 表单打印 |
| 客制化配置(Custom Configuration) | V | 客制化配置类程序 |

### (23) Module Pool Name

**对象**：Module Pool (only 'M' type)

**命名规则**：`SAPMZ + MDG + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| SAPMZ | 区分字符 |
| MDG | 流程模块 |
| nnnnn | 数字5位（10单位增加） |

**说明**：追加新增时可以中间插入，可以增减1单位（例：`SAPMZMMXS00011`）

**举例**：`SAPMZMDG00010` — [MDG]模块订货管理程序

**Description**：`[流程模块] 程序用途描述`

### (24) Dialog Program Name

**对象**：可执行的程序类型，同时发生数据生成、变更、删除的程序

**命名规则**：`Z + MDG + E + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| E | 增强及Dialog类程序 |
| nnnnn | 数字5位（累加，10进位） |

**举例**：`ZMME00010` — [MDG]物料主数据维护

**Description**：`[流程模块] + 程序用途描述`

### (25) Report Program Name

**对象**：Report program

**命名规则**：`Z + MDG + R + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 自建 |
| MDG | 流程模块 |
| R | Report |
| nnnnn | 数字5位（累加，10进位） |

**举例**：`ZMDGR00010` — MDG物料主数据查询

**Description**：`[业务名] + 程序用途描述`

### (26) BDC Program Name

**对象**：BDC Program

**命名规则**：`Z + MDG + B + XX + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| B | BDC |
| nnnnn | 数字5位（累加，10进位） |

**举例**：`ZMDGB00010` — MDG物料主数据批导

**Description**：`[业务名] + 程序用途描述`

### (27) Interface Program Name

**对象**：Interface Program

**命名规则**：`Z + MDG + I + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| I | Interface |
| nnnnn | 数字5位（累加，10进位） |

**举例**：`ZMDGI00010` — 物料主数据Interface程序

**Description**：`[业务名] + Interface 程序用途描述`

### (28) 作为Test使用的一次性程序

**对象**：作为Test使用的一次性程序

**命名规则**：`Y + MDG + nnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Y | 表示自建，临时，不传输 |
| MDG | 流程模块 |
| nnn | 数字3位（10单位） |

**举例**：`YMDGG001` — MDG主数据测试程序

**Description**：`[流程模块] + 程序用途描述`

### (29) Includes programs

管理多个程序共同使用的要素。（单独程序的Includes采用主程序+"TOP,FORM,PBO,PAI等等"）

Function Module/Module Pool与程序的Includes区分使用。

**对象**：Includes

**命名规则**：`Z + MDG + N + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| N | Include区分字符 |
| nnnnn | 数字5位（累加，10进位） |

**举例**：`ZMDGN00010` — MDG供应商管理模块

**Description**：`[业务名] Include：程序用途描述`

### (30) Function Group Name

**对象**：Function Group

**命名规则**：`ZFG + x + _ + MDG + _ + xxxx (or nnnn)`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| xxxx or nnnn | 各Module需要生成多个function Group时按各业务/功能创建 |
| x | 区分字符：M（Maintenance View/Table）、E（User Exit）、N（Search help exit） |

**举例**：
- `ZFG_MDG_0001` — 炼化板块下MDG模块订货相关Function Group
- `ZFGM_MDG_0001` — MDG模块订货相关Maintenance View F.G
- `ZFGE_MDG_0002` — MDG模块订货相关User-Exits F.G

**Description**：`[业务名] + 用途描述 + '函数group'`

**说明**：
- Maintenance Table、View通过其他的Module来制定
- 创建User Exit的情况创建前缀'E'来区分

**Include模块化**：
- `Include FunctionFxx`：Function中定义
- `Include FunctionOxx`：PBO module
- `Include FunctionIxx`：PAI module
- `Include FunctionPxx`：Class Implementation
- `Include FunctionTop`：Variant及Class Definition
- `Include FunctionUxx`：Function Module

### (31) Function Module Name

Migration用CBO BAPI Function的情况根据本命名标准。

**对象**：Function Modules

**命名规则**：`ZFM + _ + MDG + _ + xxxx...xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| ZFM_ | 区分字符 |
| MDG | 流程模块 |
| xxxx...xxx | 可以区分用途的英文描述（最大30位） |

**举例**：`ZFM_MDG_VENDOR_UPDATE` — MDG供应商主数据更新

**Description**：`[流程模块] + 用途描述`

**Function Module Interface命名规则**：

| 参数类型 | 变量参数前缀 | Structure参数前缀 |
| :--- | :--- | :--- |
| Import | IV_ | IS_ |
| Export | EV_ | ES_ |
| Changing | CV_ | CS_ |
| Tables-输入 | IT_ | - |
| Tables-输出 | ET_ | - |
| Tables-双向 | CT_ | - |

**Function Module Interface Parameters**：

**命名规则**：`x(parameter type) + a(data type-option) + xxx...xx`

| 组成部分 | 说明 |
| :--- | :--- |
| x | 参数类型标识：I（Import）、E（Export）、C（Changing） |
| a | 数据类型选项：V（Variant）、S（Work area/Structures）、T（Tables/Range）、R（Reference） |
| xxx...xx | 使用可以区分Parameter用途/职能的单词 |

**举例**：
- `IV_RYEAR` — 会计年度(Importing)
- `ET_ACTIVITY` — Selected Activity(Exporting Table)

### (32) Screen Name

**对象**：屏幕

**命名规范**：`nnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| nnnn | 主屏幕：从0100开始编号，以100为单位递增；子屏幕：主屏幕编号基础上加1，以1为单位递增；弹出屏幕：从900开始编号 |

**范例**：
- `0100`、`0200` — 主屏幕
- `0101`、`0102` — 主屏幕100下的子屏幕

**描述**：说明屏幕的用途

### (33) Menu Name(GUI-Status (PF-Status))

**对象**：Menu Status (Pf-Status) / Context Menu

**命名规则**：与相关Screen Name统一命名

| 组成部分 | 说明 |
| :--- | :--- |
| nnnn or nnnx | 一个Screen中存在两个以上pf-status的情况增加一位数字 |
| Cnnn | Context Menu |

**举例**：
- `0100`、`0200` — Screen 100、200的pf-status
- `C001`、`C002` — Context Menu

**Description**：用途描述

> [注意] 使用Template标准化

### (34) GUI title

**对象**：(Screen) Title (bar)

**命名规则**：`nnnn or nnnx`

| 组成部分 | 说明 |
| :--- | :--- |
| nnnn or nnnx | 与相关Screen Name统一指定；一个Screen中存在两个以上title bar的情况增加1位数字 |

**举例**：
- `0100`、`0200` — Screen 100号、200号的GUI Title
- `0101` — 100号screen的子模块GUI Title

**Description**：用途描述

### (35) Subroutines

**对象**：Subroutines

**命名规则**：`FRM_xx...x_xxx...x(_xx)`

| 组成部分 | 说明 |
| :--- | :--- |
| xx...x_xx...x | 用具有意义的文字'动词_名词'表示 |
| (_xx) | 相似的perform存在两个以上的情况，用'_'后两位数或文字区分 |

**举例**：
- `FRM_SELECT_SALES_ORDER`
- `FRM_SELECT_SALES_ORDER_01`
- `FRM_SELECT_SALES_ORDER_02`

**Description**：注释mark后用途描述

### (36) Transaction Code

**对象**：Transaction

**命名规则**：`Z + MDG + nnnnn + _NN(可选)`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| nnnnn | 数字5位（10单位增加） |
| NN | 可选：01新增、02修改、03显示 |

**举例**：
- `ZMDG00010` — MDG模块Interface P/G Transaction code
- `ZMDG00020` — MDG模块物料批量维护
- `ZMDG00030_01` — MDG模块新增Transaction code
- `ZMDG00030_02` — MDG模块修改Transaction code

**Description**：`[业务名] + 程序用途描述`

### (37) Transaction Variant

**对象**：Variant Transaction

**命名规则**：`ZVT + '_' + xx..x + '_' + yy..y`（最大20位以下）

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| VT | Variant Transaction区分字符 |
| xx...x | Standard TCODE |
| yy...y | 各模块追加区分字符Define |

**说明**：屏幕变式后再加屏幕编码号

**举例**：
- `ZVT_ME21N_YC` — TCODE 'ME21N'相关Transaction Variant
- `ZVT_ME21N_YC_8040` — TCODE 'ME21N'相关Screen Variant Transaction(自动生成)

### (38) Form Name

**对象**：Form

**命名规则**：`ZS + MDG + _ + xxx...xx`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| S/P/F | S：Smart Form，P：PDF-Based Form，F：SCRIPT FORM |
| MDG | 流程模块 |
| xxx...xx | 按各模块区分详细业务的具有意思的文字 |

---

## 2.2.8. Web Dynpro

### (39) Web dynpro component

**对象**：Web dynpro component

**命名规则**：`ZWDC + _ + HR + _xxx (option)`

| 组成部分 | 说明 |
| :--- | :--- |
| ZWDC | 自定义开发字符 |
| HR | 流程模块 |
| xxx | 通过用户定义的名字适当表达web dynpro component的意思 |

**举例**：`ZWDC_HR_OVERTIME_APP_FORM`

### (40) Web dynpro application

**对象**：Web dynpro application

**命名规则**：`ZWDA + _ + HR + _xxx (option)`

| 组成部分 | 说明 |
| :--- | :--- |
| ZWDA | 自定义开发字符 |
| HR | 流程模块 |
| xxx | 通过用户定义的名字适当表达web dynpro component的意思 |

**举例**：`ZWDA_HR_OVERTIME_APP_FORM`

### (41) Window

**命名规则**：`W + xxxx`

**举例**：`W_OVERTIME`

**Description**：加班申请窗口

### (42) View

**命名规则**：`V + xxxx`

**举例**：`V_OT_APPLICATION`

**Description**：加班申请视图

### (43) Outbound Plug

**命名规则**：`xxx + _OUTBOUND`

**举例**：`APPROVE_OUTBOUND`

**Description**：加班申请外向出口

### (44) Inbound Plug

**命名规则**：`xxx + _INBOUND`

**举例**：`APPROVE_INBOUND`

**Description**：加班申请入口

### (45) Component Usage（建议不限定）

**命名规则**：`USE + <component的名字>`

**举例**：`USE_PUBLIC`

**Description**：使用公共的component

### (46) UI Element（建议不限定）

**命名规则**：`<组件名字> + <描述>`

**举例**：`LABEL_APPROVE_OWNER`、`INPUT_APPROVE_DATE`

**Description**：审批人标签

### (47) Context Node（建议不限定）

**命名规则**：`T/S + <描述>`

**举例**：`S_VBAK`、`T_VBAP`

**Description**：销售订单抬头、销售订单行项目数据

### (48) Custom Controller（建议不限定）

**对象**：Custom Controller

**命名规则**：`ZWD + HR_ + CC_xxx (option)`

| 组成部分 | 说明 |
| :--- | :--- |
| ZWD | 自定义开发字符 |
| HR | 流程模块 |
| xxx | 通过用户定义的名字适当表达Custom Controller的意思 |

**举例**：`ZWDHR_CC_OVERTIME_APP_FORM`

---

## 2.2.9. Core Data Services

### (49) SQL View Name

**对象**：SQL View Name

**命名规则**：`Z + PM + C + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| PM | 流程模块 |
| C | 表示CDS |
| nnnnn | 五个数字的组合，数字的递增是10为单位，后续追加可以递增1单位 |

**说明**：最长16位字符

**举例**：`@AbapCatalog.sqlViewName: 'ZPMC00010'`

**描述**：该用途的描述

### (50) CDS View Name

**对象**：CDS View Name

**命名规则**：`Z + PM + C + _nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| PM | 流程模块 |
| C | 表示CDS |
| nnnnn | 五个数字的组合，数字同sqlViewName数字部分保持一致 |

**说明**：最长30位字符

**举例**：
```abap
@AbapCatalog.sqlViewName: 'ZPMC00010'
...
define view ZPMC_00010 as select from ...
...
```

### (51) Metadata Extension

**对象**：Metadata Extension

**命名规则**：`Z + PM + C + nnnnn_ME`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| PM | 流程模块 |
| C | 表示CDS |
| nnnnn | 五个数字的组合，数字的递增是10为单位，后续追加可以递增1单位 |
| ME | 表示Metadata Extension |

**举例**：`ZPMC00010_ME`

**描述**：该用途的描述

### (52) Extend View

**对象**：Extend View

**命名规则**：`Z + PM + C + nnnnn_EV`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| PM | 流程模块 |
| C | 表示CDS |
| nnnnn | 五个数字的组合，数字的递增是10为单位，后续追加可以递增1单位 |
| EV | 表示Extend View |

**举例**：`ZPMC00010_EV`

**描述**：该用途的描述

### (53) Table Function

**对象**：Table Function

**命名规则**：`Z + PM + C + nnnnn_TF`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| PM | 流程模块 |
| C | 表示CDS |
| nnnnn | 五个数字的组合，数字的递增是10为单位，后续追加可以递增1单位 |
| TF | 表示Table Function |

**举例**：`ZPMC00010_TF`

**描述**：该用途的描述

### (54) Table Function Implemented

**对象**：Table Function Implemented

**命名规则**：`ZCL_ + CDS_ + xxxxx..x`

| 组成部分 | 说明 |
| :--- | :--- |
| ZCL | 表示自建类 |
| CDS | 表示CDS |
| xxxxx..x | 用户定义：使用有意义的字母与英文缩写 |

**举例**：`ZCL_CDS_GET_ORDER_INFO`

**描述**：该用途的描述

### (55) Access Control

**对象**：Access Control

**命名规则**：`Z + PM + R + nnnnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| PM | 流程模块 |
| R | 表示CDS role |
| nnnnn | 五个数字的组合，数字的递增是10为单位，后续追加可以递增1单位 |

**举例**：
```abap
define role ZPMR00010
...
```

**描述**：该用途的描述

---

## 2.2.10. SAP Gateway Service Builder

### (56) Project

**对象**：Project

**命名规则**：`Z + XXX + _PM_ + xxxxx..x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| XXX | 表示项目名缩写（如：MOB移动项目），可选 |
| PM | 表示流程模块 |
| xxxxx...x | 用户定义：使用有意义的字母与英文缩写 |

**举例**：`ZMOB_PM_ODATA_SRV`

**描述**：该用途的描述

### (57) Entity Types（建议不限定）

**对象**：Entity Types

**命名规则**：`xxxxx..x`

**说明**：用户定义：使用有意义的字母与英文缩写

**举例**：`OENTITY`

### (58) Properties（建议不限定）

**对象**：Properties

**命名规则**：`xxxxx..x`

**说明**：用户定义：使用有意义的字母与英文缩写

**举例**：
- `IvData`（注：对应ABAP Field Name可为`IV_DATA`）
- `EvData`（注：对应ABAP Field Name可为`EV_DATA`）

### (59) Entity Sets（建议不限定）

**对象**：Entity Sets

**命名规则**：`xxxxx..x`

**说明**：用户定义：使用有意义的字母与英文缩写

**举例**：`OENTITYSet`（注：OENTITY同Entity Types）

---

## 2.2.11. 其他命名规范

### (60) 概览

对于前面小节中没有定义的Object规定Naming rule。没有定义命名规则的Object，可由开发者商议后指定使用。

### (61) 消息类开发规范

消息类开发需遵循以下开发规范：
- a) 必须使用预定义的MESSAGE(SE91定义)，不得直接抛出硬编码的text消息，或不使用消息类抛出消息；
- b) 新建消息类须遵循消息类命名规则，`Z + MDG（流程模块） + XX`；
- c) 板块消息类和跨板块（全局）消息类需严格区分，避免板块和全局消息类传输时相互覆盖。

### (62) Message Class Name

**对象**：Message Class

**命名规则**：`'Z' + 模块 + xx`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| 模块 | 流程模块 |
| xx | 数字/英文 '1'~'Z' |

**举例**：`ZMDG01` — MDG消息类

**Description**：`[业务名] 用途描述`

> Message Text使用时Parameter有两个以上的情况，在Parameter上可以区分顺序。例：`session&1正被用户&2处理中`

### (63) Project Name

用户自定义的User Exit，适用本标准。

**对象**：Project

**命名规则**：`Z + MDG + xxxx`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| xxxx | 4文字或数字 |

**举例**：`ZMDG0001` — MDG主数据增强User Exit

**Description**：`[流程模块] 用途描述`

### (64) Number Ranges (Object)

Number Range Object按各模块使用序列号并创建。

**对象**：Number Range Objects

**命名规则**：`Z + MDG + xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| xxx | 3位数字 |

**举例**：`ZMDG001` — MDG主数据相关

**Number Range No.**：使用2位字符 NUMC

**对象**：Number Range

**命名规则**：`nn`

**说明**：2位字符编号

**举例**：`02`

> From Number/To Number根据spec决定。

### (65) 权限对象命名规范

#### Authorization Fields

**对象**：Authorization Fields

**命名规则**：使用相关表字段

**说明**：采用具有意义的英文缩略词描述或中文简称

**举例**：`T6GSBE` — Business area

#### Authorization Object Classes

**对象**：Authorization Object Classes

**命名规则**：`Z + xxxx + n (option)`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| xxxx | 描述 |
| n | 1位数字，可选 |

**举例**：`ZLOGRT` — 库存权限类

#### Authorization Objects

**对象**：Authorization Objects

**命名规则**：`Z_ + MDG + nnn`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| MDG | 流程模块 |
| nnn | 3位流水 |

**举例**：`Z_MDG001` — 批准采购订单（自定义）

### (66) GUI Status

功能代码参考标准系统，如自定义开发功能代码优先按下面表格引用或定义，建立统一的共识。

| NO | 按钮（标签） | 功能代码 | 意义 | Key值（键） |
| :--- | :--- | :--- | :--- | :--- |
| ① | - | ENTR | 刷新 | ENTER |
| ② | - | PICK | 选择 | F2 |
| ③ | - | BACK | 前一界面 | F3 |
| ④ | - | CREA | 创建 | F5 |
| ⑤ | - | CHAN | 变更 | F6 |
| ⑥ | - | DISP | 显示 | F7 |
| ⑦ | - | EXEC | 执行 | F8 |
| ⑧ | - | MARK | 全选择 | F9 |
| ⑨ | - | SAVE | 保存 | F11 |
| ⑩ | - | CANC | 取消 | F12 |
| ⑪ | - | PRIN | 印刷 | Shift+F1 |
| ⑫ | - | DELE | 删除 | Shift+F2 |
| ⑬ | - | EXIT | 退出 | Shift+F3 |
| ⑭ | - | NOSV | 保存 | Shift+F4 |
| ⑮ | - | OOBJ | 其他Object | Shift+F5 |
| ⑯ | - | SAVE | 保存 | Ctrl+S |
| ⑰ | - | PRIN | 印刷 | Ctrl+P |

### (67) 传输请求号

传输请求理论上对应开发清单，一个功能模块创建一个传输请求，不允许一个请求号嵌套多人子请求号。

**命名规则**：`[ABAP] + MDG + _xxxxxx + YYYY.MM.DD`

| 组成部分 | 说明 |
| :--- | :--- |
| [ABAP] | 区分字符 |
| MDG | 流程模块 |
| _xxxxxx | 有业务含义的字符描述，最长30个字符 |
| YYYY.MM.DD | 日期 |

**举例**：`[ABAP]MDG_物料主数据创建2017.7.17`

---

## 2.2.10 WEB UI命名规范

### (68) 增强集

APP项目WEB UI增强统一使用增强集 `ZCRM_ENH_SET`

### (69) UI标准组件增强

标准组件增强在标准的组件前加Z

**对象**：UI组件增强

**命名规则**：`Z + 标准组件名`

**举例**：`ZBP_HEAD`、`ZBT115H_SLSO`

### (70) 自定义UI组件

**对象**：自定义UI组件命名

**命名规则**：`ZCRM_UI_XXX`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| UI | 表示UI组件 |
| XXX | 3位描述 |

**举例**：`ZCRM_UI_CHD`、`ZCRM_UI_001`

**WEB UI命名规范细则**：
- a) 搜索视图以`SearchView`结尾
- b) 结果视图以`ResultView`结尾
- c) Editable View List视图以`EL`结尾
- d) OverviewPage以`OV`结尾
- e) Editable Maintenance Views视图以`EF`结尾
- f) 视图区域以`ViewArea`结尾
- g) 视图集以`ViewSet`结尾
- h) 自定义组件一般有`MainWindow`、`MainView`
- i) 客户控制器（Custom Controller）以`CuCo`结尾
- j) 组件复用（ComponentUsages）以`ZCU`打头
- k) 导航链接（Navigational Links）`ToXXX`；Outbound Plug：`TOXXXX`；Inbound Plug：`FROMXXXX`
- l) CONTEXT NODE、event handler method用有意义的英文简称
- m) 窗口关闭event handler method以`_CLOSE`结尾
- n) 视图方法`DO_PREPARE_OUTPUT`里的代码，尽可能封装在class里，不要一长串的写下来

### (71) AET TABLE

**对象**：AET TABLE

**命名规则**：`Z + CRM + 单据类型 + AET + XX`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| CRM | 模块 |
| 单据类型 | CRM的单据类型 |
| XX | 2位数字 |

**举例**：`ZCRMZTC1AET01`

**AET表组件**：`ZCRM_AET_ZTC101`

### (72) 快速应用程序

**对象**：快速应用程序

**表命名**：`Z + CRM + AXT + XXX`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| CRM | 模块 |
| AXT | 表示快速应用程序 |
| XXX | 3位数字 |

**举例**：`ZCRMAXT001`

**快速应用程序组件命名**：`ZCRM_AXT_UI001`

### (73) SE38程序

**对象**：SE38程序

**命名规则**：`Z + CRM + R + XXX`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 表示自建 |
| CRM | 模块 |
| R | 表示REPORT程序 |
| XXX | 3位数字 |

**举例**：`ZCRMR001` — CRM第一个report程序

### (74) 组件集

CRM项目统一使用一个组件集：`ZCRM_COMP_SET`

### (75) 组件

**组件**：`ZCRMXX`（如`ZCRM01`、`ZCRMA1`）

**对应的GENIL类**：`ZCL_CRM_GENIL_组件名 + XXXX`

**示例**：`ZCL_CRM_GENIL_ZCRM01_SEARCH`

### (76) 特别说明

原则上CRM所有增强字段不能直接增强到`CRMD_ORDERADM_H/CRMD_ORDERADM_I`中，重用性比较高的可以增强到`CRMD_CUSTOMER_H/CRMD_CUSTOMER_I`中，个性化强的字段建议新增强一张AET表实现(1:1或1:N)，不同单据类型的AET表分开，不考虑复用。当然性质相同的单据类型可以复用一张AET表。

所有的BADI只能实施一次(含过滤器的除外)，BADI实施里面不能直接写代码，需要封装成FUNCTION，逻辑写在FUNCTION里。

---

## 2.2.11 增强实施（Enhancement Implementation）

**对象**：Enhancement Implementation

**命名规则**：`ZEI + _ + STP + _ + xx...x_xx...x`

| 组成部分 | 说明 |
| :--- | :--- |
| Z | 区分字符 |
| EI | Enhancement Implementation |
| xx...x_xx.x...x | 增强实施对象 |

**举例**：`ZEI_STP_PDO_BO_RFQ_ADV`

**Description**：-