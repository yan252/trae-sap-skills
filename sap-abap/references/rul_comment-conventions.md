# SAP ABAP 程序注释规范

## 4.1 一般规则

| 序号 | 规则描述 |
| :--- | :--- |
| 1 | 注释分为程序main header注释、Line注释、Block注释三种 |
| 2 | 一定要在适当的位置上进行注释 |
| 3 | 注释基本上使用中文 |
| 4 | 所有程序上都要附上main header注释 |
| 5 | 所有子模块routine上都要附上注释 |
| 6 | 程序的所有注释，为了方便第三者理解都要进行详细描述 |
| 7 | 有效代码行与注释的比例不得低于100:7 |

---

## 4.1.1 注释的格式

| 符号 | 说明 |
| :--- | :--- |
| `*` | 注释开始和结束的标识，一般用在主程序开头部分的注释说明 |
| `-` | 主程序开头部分的隔行注释 |
| `"` | 代码行注释标识 |

---

## 4.1.2 标题/程序头的注释

所有程序要包含与以下信息相关的注释。main header注释的位置位于main Include的上端。

程序修改时与变更编号一起管理变更内容，并且在程序coding部份也要通过注释描述变更编号，便于后期管理。

**制作范例**：
```abap
*&*********************************************************************
*& PROGRAM NAME        : MDGProgram
*& Module Name         : OTC
*& Apply Author        : XXX
*& Author              : XXX
*& Started on          : 2017-06-16
*& Transaction         : ZMMR0012
*& Program type        : Report
*& Program ID          : ZMMR0012
*& Program Description : 功能描述。。。。。。
*&*&*******************************************************************
*& REVISION LOG
*&
*& LOG#    DATE       AUTHOR       DESCRIPTION
*& ----    ----       ------       -----------
*& 0001   2017-06-16  XXX          Initial Creation
*&*********************************************************************
```

---

## 4.1.3 修改程序的注释

程序修改时程序下端的程序main header注释中一定要描述变更历史，修改的子模块routine也要注释。

**注释格式**：
- `**** XX BY 用户名 AT 日期 For申请者Begin***`
- `**** XX BY 用户名 AT 日期 For申请者End ***`

**XX含义**：
- Add：新增
- Modify：修改
- Delete：删除（删除时直接注释源代码，不需要物理删除）

**制作范例**：
```abap
IF A = B.
  PERFORM WRITE_LIST_01...
**** Add BY 用户名 AT 日期 ForApplyUserBegin***
ELSEIF C = D.
  PERFORM WRITE_LIST_02.
ELSE.
  PERFORM WRITE_LIST_03.
ENDIF.
**** Add BY 用户名 AT 日期 ForApplyUserEnd***

**** Modify BY 用户名 AT 日期 ForApplyUserBegin***
**** Modify BY 用户名 AT 日期 ForApplyUserEnd***
```
