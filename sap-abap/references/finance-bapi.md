# ABAP 财务模块常用 BAPI 列表及使用场景

## 一、会计凭证相关 BAPI

### 1.1 凭证创建与过账

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_ACC_DOCUMENT_POST | 创建会计凭证（FB01/FB50 功能），支持总账、供应商、客户、资产等业务场景 |
| BAPI_ACC_DOCUMENT_CHECK | 检查会计凭证数据的有效性，避免直接过账导致的错误 |
| POSTING_INTERFACE_DOCUMENT | 通过 BDC 方式创建会计凭证，模拟 FB01 事务码 |

### 1.2 凭证冲销

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_ACC_DOCUMENT_REV_POST | 冲销会计凭证（FB08 功能） |
| BAPI_ACC_ACT_POSTINGS_REVERSE | 冲销会计过账 |
| BAPI_ACC_BILLING_REV_POST | 过账票据凭证冲销 |
| POSTING_INTERFACE_REVERSE_DOC | 通过 BDC 方式冲销会计凭证 |

### 1.3 凭证修改与查询

| BAPI 名称 | 使用场景 |
|----------|----------|
| FI_ITEMS_MASS_CHANGE | 批量修改会计凭证项目（FB02 功能） |
| J_1B_FBRA_POSTING_AUFRUFEN | 重置已结清项目（FBRA 功能） |

## 二、总账科目相关 BAPI

### 2.1 科目主数据维护

| BAPI 名称 | 使用场景 |
|----------|----------|
| GL_ACCT_MASTER_SAVE | 创建、修改、删除总账科目（FS00 功能） |

### 2.2 科目余额查询

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_GL_GETGLACCPERIODBALANCES | 获取总账科目期间余额 |
| BAPI_GL_GETGLACCOUNTBALANCES | 获取总账科目余额 |

## 三、利润中心相关 BAPI

### 3.1 利润中心主数据

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_PROFITCENTER_CREATE | 创建利润中心 |
| BAPI_PROFITCENTER_CHANGE | 修改利润中心 |
| BAPI_PROFITCENTER_DELETE | 删除利润中心 |
| BAPI_PROFITCENTER_GETDETAIL | 获取利润中心详细信息 |
| BAPI_PROFITCENTER_GETLIST | 获取利润中心列表 |
| BAPI_PROFITCENTER_CREATEMULTI | 批量创建利润中心 |
| BAPI_PROFITCENTER_CHANGEMULTI | 批量修改利润中心 |

### 3.2 利润中心组

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_PROFCENTERGROUP_CREATE | 创建利润中心组 |
| BAPI_PROFCENTERGROUP_CHANGE | 修改利润中心组 |
| BAPI_PROFCENTERGROUP_DELETE | 删除利润中心组 |
| BAPI_PROFCENTERGROUP_GETDETAIL | 获取利润中心组详细信息 |
| BAPI_PROFCENTERGROUP_GETLIST | 获取利润中心组列表 |

### 3.3 利润中心分配与结算

| BAPI 名称 | 使用场景 |
|----------|----------|
| K_PROFITCENTER_ALLOCATE | 利润中心之间的成本或收入分配 |
| K_PROFITCENTER_SETTLE | 利润中心成本结算 |

## 四、固定资产相关 BAPI

### 4.1 资产主数据维护

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_FIXEDASSET_CREATE1 | 创建固定资产（AS01 功能） |
| BAPI_FIXEDASSET_CREATE | 创建固定资产 |
| BAPI_FIXEDASSET_CHANGE | 修改固定资产（AS02 功能） |
| BAPI_ASSET_RETIREMENT_POST | 固定资产报废 |

## 五、客户供应商相关 BAPI

### 5.1 应收账款

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_AR_ACC_GETOPENITEMS | 获取客户未清项目 |
| BAPI_AR_ACC_GETBALANCEDITEMS | 获取客户已清算科目行项目 |
| BAPI_AR_ACC_GETCURRENTBALANCE | 获取客户当前余额 |
| BAPI_AR_ACC_GETKEYDATEBALANCE | 获取客户关键日期余额 |

### 5.2 应付账款

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_AP_ACC_GETOPENITEMS | 获取供应商未清项目 |
| BAPI_AP_ACC_GETBALANCEDITEMS | 获取供应商已清算科目行项目 |
| BAPI_AP_ACC_GETCURRENTBALANCE | 获取供应商当前余额 |
| BAPI_AP_ACC_GETKEYDATEBALANCE | 获取供应商关键日期余额 |
| BAPI_AP_ACC_GETPERIODBALANCES | 获取供应商期间余额 |
| BAPI_AP_ACC_GETSTATEMENT | 获取供应商科目过账 |

### 5.3 清账处理

| BAPI 名称 | 使用场景 |
|----------|----------|
| POSTING_INTERFACE_CLEARING | 处理客户供应商清账 |

## 六、成本控制相关 BAPI

### 6.1 成本中心

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_COSTCENTER_CREATEMULTIPLE | 批量创建成本中心 |
| BAPI_COSTCENTER_CHANGEMULTIPLE | 批量修改成本中心 |

### 6.2 内部订单

| BAPI 名称 | 使用场景 |
|----------|----------|
| K_SETTLEMENT_GROUP_PROCESS | 实际结算处理（KO88 功能） |

## 七、其他财务 BAPI

### 7.1 税务处理

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_TAXCALCULATE | 税务计算 |

### 7.2 汇率处理

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_EXCHANGERATE_GETDETAIL | 获取汇率详细信息 |

## 八、事务处理 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_TRANSACTION_COMMIT | 提交事务 |
| BAPI_TRANSACTION_ROLLBACK | 回滚事务 |

## 使用建议

### 凭证处理优先级：
- 优先使用 BAPI_ACC_DOCUMENT_POST 进行凭证创建
- 必须在正式过账前使用 BAPI_ACC_DOCUMENT_CHECK 进行检查
- 处理返回消息表 RETURN，确保没有错误消息

### 批量处理：
- 对于大量数据处理，优先选择带 MULTI 后缀的 BAPI
- 注意测试运行模式（TESTRUN 参数）

### 错误处理：
- 所有 BAPI 调用后必须检查返回消息
- 根据错误类型决定是否提交或回滚事务

### 权限考虑：
- 确保调用用户具备相应的财务权限
- 特别是 F_BKPF_BUK（公司代码）和 F_BKPF_BER（凭证类型）权限对象
