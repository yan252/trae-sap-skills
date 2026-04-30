# SAP ABAP 编码规范

## 3.1. 变量声明

通常在定义变量的时候，冒号后面要用一个空格。

**示例**：
```abap
DATA: MATNR LIKE VBAP-MATNR,
      WERKS LIKE VBAP-WERKS.
```

**规范要点**：
- 在多个程序中共同使用的变量和类型，使用Type Group或者Include文件来减少重复的定义
- 如果可能，尽量使用本地变量以减少全局变量的定义个数
- 如果可能，尽量不让变量持续的运行在程序中

---

## 3.2. 变量的命名规范

**一般规则**：`变量范围(g/l) + 变量类型(v/s/t) + '_' + xx.xxx`

| 变量类型 | 命名格式 | 示例 |
| :--- | :--- | :--- |
| 全局变量 | `gv_xx.xxx` | `DATA gv_count TYPE i.` |
| 全局结构 | `gs_xx.xxx` | - |
| 全局内表 | `gt_xx.xxx` | - |
| 本地变量 | `lv_xx.xxx` | `DATA lv_count TYPE i.` |
| 本地结构 | `ls_xx.xxx` | - |
| 本地内表 | `lt_xx.xxx` | - |

### 全局变量的定义

**对象**：全局变量

**命名规则**：`G + _ + xx.xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| G | Global |
| xx.xxx | 变量的含义 |

**范例**：`DATA: G_COUNT TYPE I. "用于计数的一个全局变量`

### 本地变量的定义

**对象**：本地变量

**命名规则**：`L + _ + xx.xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| L | Local |
| xx.xxx | 变量的含义 |

**范例**：`DATA: L_ANSWER. "获取某函数应答的本地变量`

### Types 定义

**适用范围**：
- Program内部Global Types定义
- User Predefined Types
- Refer to Existing types
- Reference Types
- Structured Types
- Table Types
- Ranges Table Types

**对象**：Types - 程序内部的数据类型定义

**命名规则**：`TY + _ + xxxxx.xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| TY | Types前缀 |
| xxxx.xxx | 赋予适当的英文/数字 |

**举例**：
```abap
TYPES: TY_SPFLI TYPE SORTED TABLE OF spfli.
TYPES: TY_result TYPE p LENGTH 8 DECIMALS 2.
TYPES: BEGIN OF TY_street_type,
         name TYPE c LENGTH 40,
         no   TYPE c LENGTH 4,
       END OF TY_street_type.
TYPES: TY_text10 TYPE c LENGTH 10.
```

### 全局内表的定义

**对象**：全局内表

**命名规则**：`GT + _ + xx.xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| GT | Global Internal Table |
| xx.xxx | 内表的含义 |

**范例**：`DATA: GT_BASIS LIKE TABLE OF BASIS WITH HEADER LINE.`

### 本地内表的定义

**对象**：本地内表

**命名规则**：`LT + _ + xx.xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| LT | Local Internal Table |
| xx.xxx | 内表的含义 |

**范例**：`DATA: LT_BASIS LIKE TABLE OF BASIS WITH HEADER LINE.`

### Perform Parameter 定义

**对象**：Form Parameter

**命名规则**：`X + x (parameter type) + _ + xxx.xx`

| 组成部分 | 说明 |
| :--- | :--- |
| X | Perform Parameter USING:P / CHANGING:C |
| x | 参数类型标识：T（内表/范围）、S（结构）、V（变量）、R（对象引用） |
| xxx.xx | 与Perform Parameter相关有意义的文字列 |

**举例**：
```abap
* Caller:
PERFORM ABC TABLES   GT_ZTEC0002
           USING    AAA
                    WA_GLOPAR
           CHANGING WORK.

* Callee:
FORM ABC TABLES   PT_ZTEC0002 TYPE TY_ZTEC0002
         CHANGING CS_WORK.
        USING    PV_AAA
ENDFORM.
```

### User Interface定义

**适用范围**：
- Selection Screen的user interface中要使用的parameters/select-options的相关定义
- 各个相关的Label text：利用相关program的text elements tool进行管理

#### Parameters

**对象**：User Interface的Parameter (at Selection Screen)

**命名规则**：`P_ + xxx.xx`

| 组成部分 | 说明 |
| :--- | :--- |
| P_ | Parameter的缩略 |
| xxx.xx | Parameter的相关有意义的文字列 |

**举例**：`PARAMETER P_MATNR.`

#### Select-Options

**对象**：User Interface的Select Option

**命名规则**：`S_ + xxx.xx`

| 组成部分 | 说明 |
| :--- | :--- |
| S_ | Select Option的缩略 |
| xxx.xx | Select Option的相关有意义的文字列 |

**举例**：`Select-Option S_MATNR.`

#### Constant变量定义

**对象**：Constant xxx.xx

**命名规则**：`C_ + xxx.xx`

| 组成部分 | 说明 |
| :--- | :--- |
| C_ | Constant的缩略 |
| xxx.xx | 有意义的上一级名 |

**举例**：`Constant C_BUKRS TYPE BUKRS VALUE 'C100'.`

#### Range变量定义

**对象**：Range变量

**命名规则**：`GR_ + xxx..xx`（全局）、`LR_ + xxx..x`（本地）

| 组成部分 | 说明 |
| :--- | :--- |
| GR_ | Global Range变量 |
| LR_ | Local Range变量 |
| xxx..xx | 有意义的变量名 |

**举例**：
```abap
RANGES: GR_BUKRS for TF100-BUKRS. "Global

FORM...
  RANGES: LR_BUKRS for TF100-BUKRS. "Local
ENDFORM.
```

#### Text Symbols

所有program内的text一定要使用Text Symbol。Hard conding text时一定要进行向text symbol的变化。在program中使用的所有text要使用ABAP Text Element tool进行管理。

**对象**：Text Symbols

**命名规则**：
- 基本形式：`TEXT- + xxx`
- Line形式：`( + xxx + )`

| 组成部分 | 说明 |
| :--- | :--- |
| TEXT- | Text Symbols Keyword |
| xxx | 数字/英文字(3 char) |

**举例**：
```abap
MESSAGE TEXT-T01 TYPE 'I'.
WRITE: TEXT-011.
MESSAGE 'Welcome to Korea'(T02).
```

#### Field Symbols

Field Symbols区分Global/Local。要指定Type，指定特别type困难的情况使用`TYPE ANY`。

**对象**：Field Symbols

**命名规则**：
- Global：`< + G_ + xxx... + >`
- Local：`< + L_ + xxx... + >`

| 组成部分 | 说明 |
| :--- | :--- |
| xxx.. | 有意义的变量名 |

**举例**：
```abap
FIELD-SYMBOLS <G_FSITEM> TYPE FSITEM.
FIELD-SYMBOLS <L_HSLVT> TYPE ANY.
```

#### Table Control

Table Control作Global定义。

**对象**：Table Control

**命名规则**：`TC_ + nnnn + x (option)`

| 组成部分 | 说明 |
| :--- | :--- |
| nnnn | 相关Screen编号 |
| x | A~Z，一个界面中多数的Table Control使用的情况 |

**举例**：
- `TC_0200` → 200号界面的Table control
- `TC_0300A`、`TC_0300B` → 300号界面的Table Control A、B

#### Custom Control

Control Object使用通过Container Screen Layout的Custom Control。

**对象**：Custom Control

**命名规则**：`CC_ + nnnn + x (option)`

| 组成部分 | 说明 |
| :--- | :--- |
| nnnn | 相关Screen编号 |
| x | A~Z，一个界面中要使用多数Custom Control的情况 |

**举例**：
- `CC_0200` → 200号界面的Custom control
- `CC_0300A`、`CC_0300B` → 300号界面的Custom Control A、B

#### Local Class Definition (Program内部)

与通过Class Builder创建的global class object不同，是在程序内部定义。

**对象**：Local Class Definition/Implementation (Program内部定义class)

**命名规则**：`LCL_ + xxx...xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| LCL | local class/区分字符 |
| xxx...xxx | Class名 – 符合Class/Interface属性的中英文 |

**举例**：`CLASS lcl_handle_events DEFINITION DEFERRED.`

#### 参考变量(Reference Variables for Class/Interfaces)

**对象**：参考变量(Reference Variables)

**命名规则**：
- Global：`GRF_ + xxx...xxx`
- Local：`LRF_ + xxx...xxx`

| 组成部分 | 说明 |
| :--- | :--- |
| RF | 参考变量区分字符 |
| xxx...xxx | 参考变量名 – 参考Class/Interface并命名 |

**举例**：
```abap
DATA: GRF_SCHEDULE TYPE REF TO ZCL_EC_CLOSING_SCHEDULE. "Global结算日程class参考变量
DATA: LRF_SCHEDULE TYPE REF TO ZCL_EC_CLOSING_SCHEDULE. "Local结算日程class参考变量
```
