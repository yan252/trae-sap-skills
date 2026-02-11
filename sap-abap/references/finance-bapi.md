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
| BAPI_GLX_GETDOCITEMS | 获取文档的行项目，包括总账科目的余额和总计表（FAGLFLEXT） |
| BAPI_GL_GETGLACCBALANCE | 获取选定年份的总账科目期末余额 |
| BAPI_GL_GETGLACCCURRENTBALANCE | 获取当前年份的总账科目期末余额 |
| BAPI_GL_GETGLACCPERIODBALANCES | 获取每个总账科目的记账期间余额 |
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
| BAPI_CR_ACC_GETDETAIL | 确定应收账款科目的主数据 |
| BAPI_CR_ACC_GETHIGHESTDUNNINGL | 确定应收账款科目的最高催款级别 |
| BAPI_CR_ACC_GETOLDESTOPENITEM | 确定应收账款科目中最旧的未清项目 |
| BAPI_CR_ACC_GETOPENITEMSSTRUCT | 确定应收账款科目的未清项结构 |
| BAPI_CREDIT_ACCOUNT_GET_STATUS | 确定贷方账户的信用状态 |
| BAPI_AR_ACC_GETOPENITEMS | 读取客户的未清项 |
| BAPI_AR_ACC_GETBALANCEDITEMS | 读取客户余额项目 |
| BAPI_AR_ACC_GETCURRENTBALANCE | 读取客户的实际余额 |
| BAPI_AR_ACC_GETKEYDATEBALANCE | 读取客户在关键日期的余额 |
| BAPI_AR_ACC_GETPERIODBALANCES | 读取客户的余额 |
| BAPI_AR_ACC_GETSTATEMENT | 读取客户的科目报表 |
| BAPI_CUSTOMER_GETSALESAREAS | 读取客户的销售范围 |

### 5.2 应付账款

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_AP_ACC_GETOPENITEMS | 获取供应商未清项目 |
| BAPI_AP_ACC_GETBALANCEDITEMS | 读取已清算的科目行项目 |
| BAPI_AP_ACC_GETCURRENTBALANCE | 读取应付账款科目的当前余额 |
| BAPI_AP_ACC_GETKEYDATEBALANCE | 读取应付账款科目在关键日期的余额 |
| BAPI_AP_ACC_GETPERIODBALANCES | 读取应付账款科目的期间余额 |
| BAPI_AP_ACC_GETSTATEMENT | 读取应付账款科目的过账记录 |

### 5.3 清账处理

| BAPI 名称 | 使用场景 |
|----------|----------|
| POSTING_INTERFACE_CLEARING | 处理客户供应商清账 |

### 5.4 发票检验

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_INCOMINGINVOICE_CREATE | 发票检验（MIRO 功能） |
| BAPI_INCOMINGINVOICE_CANCEL | 发票校验冲销（MR8M 功能） |

## 六、银行会计相关 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_PAYMENTREQUEST_CANCEL | 取消支付请求 |
| BAPI_PAYMENTREQUEST_CREATE | 创建支付请求 |
| BAPI_PAYMENTREQUEST_GETLIST | 列出支付请求 |
| BAPI_PAYMENTREQUEST_GETSTATUS | 确定支付请求的状态 |
| BAPI_PAYMENTREQUEST_POST | 过账预制凭证请求 |
| BAPI_PAYMENTREQUEST_RELEASE | 批准支付的支付请求 |
| BAPI_PAYMENTREQ_STARTPAYMENT | 开始支付的支付请求 |

## 七、固定资产相关 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_FIXEDASSET_CHANGE | 更改资产信息 |
| BAPI_FIXEDASSET_CREATE | 创建资产 |
| BAPI_FIXEDASSET_OVRTAKE_CREATE | 使用值创建资产（用于初始历史遗留数据传输） |
| BAPI_FIXEDASSET_GETDETAIL | 获取资产的明细信息 |
| BAPI_FIXEDASSET_GETLIST | 获取选定资产的信息 |
| BAPI_ASSET_POSTCAP_CHECK | 检查资本记账 |
| BAPI_ASSET_POSTCAP_POST | 记账资本总额 |
| BAPI_ASSET_RETIREMENT_CHECK | 检查资产报废 |
| BAPI_ASSET_RETIREMENT_POST | 记账资产报废 |
| BAPI_ASSET_ACQUISITION_CHECK | 检查资产购置 |
| BAPI_ASSET_ACQUISITION_POST | 记账资产购置 |

## 八、特殊分类帐相关 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_SL_GETTOTALRECORDS | 特殊目的分类帐，选择科目的总计记录 |

## 九、总帐科目相关 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_GL_ACC_EXISTENCECHECK | 检查总帐科目是否存在 |
| BAPI_GL_ACC_GETDETAIL | 获取总帐科目的明细信息 |
| BAPI_GL_ACC_GETLIST | 获取每个公司代码的总帐科目清单 |

## 十、会计凭证过账相关 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_ACC_ACT_POSTINGS_REVERSE | 会计核算，冲销凭证 |
| BAPI_ACC_DOCUMENT_REV_CHECK | 会计，核算冲销检查 |
| BAPI_ACC_DOCUMENT_POST | 会计，过帐凭证 |
| BAPI_ACC_DOCUMENT_REV_POST | 会计，过帐冲销 |
| BAPI_ACC_GL_POSTING_CHECK | 会计，总帐科目记帐检查 |
| BAPI_ACC_GL_POSTING_REV_CHECK | 会计，检查一般总分类帐科目过帐的冲销 |
| BAPI_ACC_GL_POSTING_POST | 会计，总帐科目记帐 |
| BAPI_ACC_GL_POSTING_REV_POST | 会计核算，过帐一般总帐过帐冲销 |

## 十一、销售相关会计 BAPI

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_ACC_SALES_ORDER_CHECK | 会计，检查销售订单 |
| BAPI_ACC_SALES_ORDER_POST | 会计，记帐销售订单 |
| BAPI_ACC_BILLING_REV_POST | 会计，过帐票据凭证冲销（OAG: LOAD RECEIVABLE） |
| BAPI_ACC_GOODS_MOVEMENT_CHECK | 会计，检查货物移动（OAG: POST JOURNAL） |

## 十二、成本控制相关 BAPI

### 12.1 成本中心

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_COSTCENTER_CREATEMULTIPLE | 批量创建成本中心 |
| BAPI_COSTCENTER_CHANGEMULTIPLE | 批量修改成本中心 |

### 12.2 内部订单

| BAPI 名称 | 使用场景 |
|----------|----------|
| K_SETTLEMENT_GROUP_PROCESS | 实际结算处理（KO88 功能） |

## 十三、其他财务 BAPI

### 13.1 税务处理

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_TAXCALCULATE | 税务计算 |

### 13.2 汇率处理

| BAPI 名称 | 使用场景 |
|----------|----------|
| BAPI_EXCHANGERATE_GETDETAIL | 获取汇率详细信息 |

## 十四、事务处理 BAPI

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
