# ABAP 常用功能代码参考

## JSON与SAP结构转换

在ABAP中处理JSON转换，最常用的是/UI2/CL_JSON类。以下是完整的使用示例：

### 1. 结构化数据转JSON（序列化）

```abap
DATA: ls_structure TYPE zmy_structure,  " 自定义结构
      lv_json      TYPE string.

" 定义结构（示例）
TYPES: BEGIN OF ty_person,
         id      TYPE i,
         name    TYPE string,
         age     TYPE i,
         active  TYPE abap_bool,
         address TYPE string,
       END OF ty_person.

DATA: ls_person TYPE ty_person.

" 填充数据
ls_person-id = 1001.
ls_person-name = '张三'.
ls_person-age = 30.
ls_person-active = abap_true.
ls_person-address = '北京市'.

" 方法1：使用 SERIALIZE
lv_json = /ui2/cl_json=>serialize(
  data        = ls_person
  compress    = abap_true      " 压缩输出（去掉空格）
  pretty_name = /ui2/cl_json=>pretty_mode-camel_case  " 转换为驼峰命名
).

" 输出结果：{"id":1001,"name":"张三","age":30,"active":true,"address":"北京市"}

" 方法2：使用 SERIALIZE_INT（支持更多数据类型）
lv_json = /ui2/cl_json=>serialize_int(
  data        = ls_person
  compress    = abap_true
  pretty_name = /ui2/cl_json=>pretty_mode-low_case  " 保持小写
).

" 方法3：处理内表和复杂结构
DATA: lt_people TYPE TABLE OF ty_person.
APPEND ls_person TO lt_people.

" 添加第二个人
ls_person-id = 1002.
ls_person-name = '李四'.
ls_person-age = 25.
ls_person-active = abap_false.
ls_person-address = '上海市'.
APPEND ls_person TO lt_people.

lv_json = /ui2/cl_json=>serialize(
  data        = lt_people
  compress    = abap_false    " 不压缩，美化输出
).
```

### 2. JSON转结构化数据（反序列化）

```abap
DATA: lv_json_string TYPE string,
      ls_person      TYPE ty_person,
      lt_people      TYPE TABLE OF ty_person.

" JSON字符串
lv_json_string = '{"id":1001,"name":"张三","age":30,"active":true,"address":"北京市"}'.

" 方法1：使用 DESERIALIZE
/ui2/cl_json=>deserialize(
  EXPORTING
    json         = lv_json_string
    pretty_name  = /ui2/cl_json=>pretty_mode-camel_case
  CHANGING
    data         = ls_person
).

WRITE: / 'ID:', ls_person-id,
       / '姓名:', ls_person-name,
       / '年龄:', ls_person-age,
       / '激活:', ls_person-active.

" 方法2：处理嵌套JSON
TYPES: BEGIN OF ty_address,
         city    TYPE string,
         street  TYPE string,
         zipcode TYPE string,
       END OF ty_address.

TYPES: BEGIN OF ty_employee,
         id      TYPE i,
         name    TYPE string,
         address TYPE ty_address,
       END OF ty_employee.

DATA: ls_employee TYPE ty_employee.

lv_json_string = '{"id":2001,"name":"王五","address":{"city":"广州","street":"天河路","zipcode":"510000"}}'.

/ui2/cl_json=>deserialize(
  EXPORTING
    json = lv_json_string
  CHANGING
    data = ls_employee
).

" 方法3：处理JSON数组
lv_json_string = '[{"id":1001,"name":"张三"},{"id":1002,"name":"李四"}]'.

/ui2/cl_json=>deserialize(
  EXPORTING
    json = lv_json_string
  CHANGING
    data = lt_people
).

" 遍历结果
LOOP AT lt_people INTO ls_person.
  WRITE: / ls_person-id, ls_person-name.
ENDLOOP.
```

### 3. 处理日期和特殊类型

```abap
" 自定义转换规则
DATA: lo_json TYPE REF TO /ui2/cl_json.

CREATE OBJECT lo_json.

" 设置日期格式转换
lo_json->format_date_out = 'yyyy-MM-dd'.
lo_json->format_time_out = 'HH:mm:ss'.

TYPES: BEGIN OF ty_contract,
         contract_id TYPE string,
         start_date  TYPE datum,
         end_date    TYPE datum,
         amount      TYPE p DECIMALS 2,
       END OF ty_contract.

DATA: ls_contract TYPE ty_contract.

" 序列化带日期的数据
ls_contract-contract_id = 'CTR001'.
ls_contract-start_date = '2024-01-01'.
ls_contract-end_date = '2024-12-31'.
ls_contract-amount = '125000.50'.

lv_json = lo_json->serialize( data = ls_contract ).
```

### 4. 高级选项和错误处理

```abap
TRY.
    " 带错误处理的转换
    /ui2/cl_json=>deserialize(
      EXPORTING
        json = lv_json_string
        hex_as_string = abap_true      " 十六进制作为字符串处理
        assoc_arrays  = abap_false     " 不关联数组
      CHANGING
        data = ls_person
    ).
    
  CATCH /ui2/cx_json_parser_error INTO DATA(lx_error).
    " 处理JSON解析错误
    WRITE: / 'JSON解析错误:', lx_error->get_text( ).
    
  CATCH cx_root INTO DATA(lx_root).
    " 处理其他错误
    WRITE: / '其他错误:', lx_root->get_text( ).
ENDTRY.
```

### 5. 完整示例程序

```abap
REPORT zdemo_json_conversion.

TYPES: BEGIN OF ty_person,
         id     TYPE i,
         name   TYPE string,
         age    TYPE i,
         email  TYPE string,
         active TYPE abap_bool,
       END OF ty_person.

START-OF-SELECTION.
  
  DATA: lt_people TYPE TABLE OF ty_person,
        ls_person TYPE ty_person,
        lv_json   TYPE string.
  
  " 准备数据
  ls_person-id = 1.
  ls_person-name = '张三'.
  ls_person-age = 30.
  ls_person-email = 'zhangsan@example.com'.
  ls_person-active = abap_true.
  APPEND ls_person TO lt_people.
  
  ls_person-id = 2.
  ls_person-name = '李四'.
  ls_person-age = 25.
  ls_person-email = 'lisi@example.com'.
  ls_person-active = abap_false.
  APPEND ls_person TO lt_people.
  
  " 转换为JSON
  lv_json = /ui2/cl_json=>serialize(
    data        = lt_people
    pretty_name = /ui2/cl_json=>pretty_mode-camel_case
  ).
  
  WRITE: / '生成的JSON:', lv_json.
  
  " 清空内表
  CLEAR: lt_people.
  
  " JSON转回结构化数据
  /ui2/cl_json=>deserialize(
    EXPORTING
      json = lv_json
    CHANGING
      data = lt_people
  ).
  
  " 显示结果
  LOOP AT lt_people INTO ls_person.
    WRITE: / |ID: { ls_person-id }, 姓名: { ls_person-name }, 年龄: { ls_person-age }|.
  ENDLOOP.
```

### 注意事项

**版本兼容性**：确保SAP系统版本支持 /UI2/CL_JSON（通常从NetWeaver 7.0以上开始支持）

**命名转换**：
- pretty_mode-camel_case: ABAP字段名转为驼峰式（field_name → fieldName）
- pretty_mode-low_case: 保持小写
- pretty_mode-user: 使用用户指定的转换规则

**数据类型映射**：
- ABAP string ↔ JSON 字符串
- ABAP i, p ↔ JSON 数字
- ABAP abap_bool ↔ JSON true/false
- ABAP 内表 ↔ JSON 数组

**性能考虑**：处理大量数据时建议使用 serialize_int 和 deserialize_int，它们提供更好的性能