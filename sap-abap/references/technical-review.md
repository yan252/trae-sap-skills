# SAP ABAP 技术审查规范

## 5. 技术审查概述

技术审查是开发过程中非常重要的一项工作，包括Walkthroughs、Inspections和Code Review。该项工作的目的在于保证开发的程序达到质量控制标准。同时，该项工作的重要作用也在于保证开发程序不会出错而重新开发(Rework)，因此所有的自定义开发必须通过标准系统检查。

任何新开发的程序或对现有程序的维护须经该项工作保证质量，如检查通不过不允许上线。

---

## 5.1 Code Inspector

**调用路径**：`Program -> Check -> Code Inspector (Transaction SCI)`

Code Inspector可以对程序进行比Extended Program Check更复杂的检查，所有开发的程序在传输前必须经过Code Inspector检查。

**可调用Code Inspector的Transaction**：
| Transaction | 用途 |
| :--- | :--- |
| ABAP Dictionary (SE11) | DDIC tables |
| Class Builder (SE24) | classes and interfaces |
| Function Builder (SE37) | function groups |
| ABAP Editor (SE38) | programs or reports |
| ABAP Workbench (SE80) | - |

---

## 5.2 Extended Program Check

**调用路径**：`Program -> Check -> Extended program check`

在传输之前，必须使用该工具对程序进行检查分析，该工具能较全面的检查程序中的各种潜在问题。传输之前必须修正所有的Error，认真评估Warning条目。

---

## 5.3 ABAP对象运行时间分析及SQL跟踪

**Transaction**: `SE30` & `ST05`

### SE30 - 运行时间分析
程序开发完毕后必须通过SE30对程序的运行效率进行分析，分析ABAP、数据库及ECC系统消耗时间，同时须估计在生产系统中月底、年底等数据量很大的情况下程序效率，必须达到性能要求才能传输。

### ST05 - SQL跟踪
可以帮助分析程序的数据库操作状况，该工具可辅助进行性能调试。

---

## 5.4 比较程序变化

**Transaction**: `SE39`

在第一次Release并传输之后，后续的开发、维护工作完成之后，必须通过SE39对开发系统及目标传输系统中的程序进行比较，仔细确认每一处变化是否必要，确定是否会引起其他错误。

---

## 5.5 版本管理

**Utilities版本管理**：每次Release后的程序都被保存下来，在维护程序的时候，通过该工具可以对历史版本进行比较，浏览历史版本程序，在修改发生错误的情况下，可以通过恢复历史版本达到修复程序的目的。
