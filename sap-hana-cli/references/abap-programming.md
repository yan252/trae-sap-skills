# SAP ABAP Programming Reference

**Source**: [https://codezentrale.de/category/sap/sap-abap/](https://codezentrale.de/category/sap/sap-abap/)
**Language**: Translated from German

This reference covers ABAP programming patterns relevant to SAP HANA development.

---

## Table of Contents

1. [SQL Operations](#sql-operations)
2. [Internal Tables](#internal-tables)
3. [String Operations](#string-operations)
4. [JSON Processing](#json-processing)
5. [XML Processing](#xml-processing)
6. [Regular Expressions](#regular-expressions)
7. [Exception Handling](#exception-handling)
8. [Performance Optimization](#performance-optimization)

---

## SQL Operations

### Open SQL

#### Common Table Expressions (CTE)

```abap
WITH
  +cte1 AS ( SELECT * FROM table1 WHERE condition ),
  +cte2 AS ( SELECT * FROM +cte1 WHERE condition2 )
SELECT * FROM +cte2 INTO TABLE @DATA(lt_result).
```

#### String Aggregation

```abap
SELECT STRING_AGG( field, ',' ) AS aggregated
  FROM table
  INTO @DATA(lv_result).
```

#### Global Temporary Tables (GTT)

```abap
" Use GTT for intermediate data storage
```

### Performance Comparison

| Method | Performance |
|--------|-------------|
| RANGE clause | ~0.086 seconds |
| FOR ALL ENTRIES | ~0.073 seconds |
| JOIN | ~0.012 seconds (fastest) |

**Best Practice**: Use JOINs instead of FOR ALL ENTRIES when possible.

### AMDP (ABAP Managed Database Procedures)

Convert RANGES to WHERE clause for AMDP:

```abap
" Using cl_shdb_seltab
DATA(lv_where) = cl_shdb_seltab=>combine_seltabs(
  it_named_seltabs = VALUE #(
    ( name = 'FIELD' dref = REF #( lr_range ) )
  )
)->sql_where_condition( ).
```

---

## Internal Tables

### TABLE_LINE Pseudo-Component

```abap
" Access complete row without structure
DATA(lv_vbeln) = it_vbeln[ table_line = '2345678901' ].
```

### REDUCE Operator

```abap
" Sum values
DATA(lv_sum) = REDUCE decfloat34(
  INIT sum = CONV decfloat34( 0 )
  FOR wa IN it_costs
  NEXT sum = sum + wa-amount ).
```

### OPTIONAL Clause

```abap
" Avoid exceptions for missing entries
DATA(ls_person) = VALUE #( it_persons[ name = 'John' ] OPTIONAL ).
```

### DEFAULT VALUE

```abap
" Provide fallback value
DATA(ls_person) = VALUE #(
  it_persons[ name = 'John' ]
  DEFAULT VALUE #( name = '<empty>' age = -1 )
).
```

### BASE Operator

```abap
" Prepend existing data
it_result = VALUE #( BASE it_existing ( field = 'new' ) ).
```

### Line Index

```abap
" Get index without exceptions
DATA(lv_idx) = line_index( itab[ col = '123' ] ).
```

### Search Operations

```abap
" Case-insensitive search
FIND 'pattern' IN TABLE it_data IGNORING CASE.

" All occurrences
FIND ALL OCCURRENCES OF 'pattern' IN it_data
  RESULTS DATA(lt_results).
```

---

## String Operations

### Substring Extraction

```abap
" Offset and length syntax
DATA(lv_first) = CONV string( lv_string+0(1) ).
DATA(lv_middle) = CONV string( lv_string+5(3) ).
```

### Transliteration

```abap
" Convert special characters
CALL FUNCTION 'SCP_REPLACE_STRANGE_CHARS'
  EXPORTING
    intext  = lv_input
  IMPORTING
    outtext = lv_output.
" Result: ÄÖÜ → AeOeUe
```

### Codepage Conversion

```abap
" SAP codepage to HTTP encoding
DATA(lv_encoding) = cl_abap_codepage=>sap_codepage(
  http_encoding = 'UTF-8' ).
```

### Pattern Matching (CP Operator)

```abap
" Wildcard matching
IF lv_string CP '*-*'.    " Contains dash
IF lv_string CP '+++*'.   " Three+ characters
```

### Message Text Splitting

```abap
" Distribute text across message fields
cl_message_helper=>set_msg_vars_for_clike(
  EXPORTING i_text = lv_long_text ).
" Access via sy-msgv1, sy-msgv2, sy-msgv3, sy-msgv4
```

---

## JSON Processing

### ABAP to JSON

```abap
" Using xco_cp_json (modern)
DATA(lv_json) = xco_cp_json=>data->from_abap( ls_data )->to_string( ).

" Using /ui2/cl_json
DATA(lv_json) = /ui2/cl_json=>serialize(
  data        = ls_data
  pretty_name = /ui2/cl_json=>pretty_mode-camel_case ).
```

### JSON to ABAP

```abap
" Using xco_cp_json
xco_cp_json=>data->from_string( lv_json )->apply(
  VALUE #( ( xco_cp_json=>transformation->boolean_to_abap_bool )
           ( xco_cp_json=>transformation->pascal_case_to_underscore ) )
)->write_to( REF #( ls_data ) ).

" Using /ui2/cl_json
/ui2/cl_json=>deserialize(
  EXPORTING json = lv_json
  CHANGING  data = ls_data ).
```

### Internal Table to JSON

```abap
" Using transformation
CALL TRANSFORMATION id
  SOURCE values = it_data
  RESULT XML DATA(lv_json).
```

---

## XML Processing

### XML to Internal Table

```abap
" Using cl_xml_document
DATA(lo_xml) = cl_xml_document=>create( ).
lo_xml->import_from_file( lv_filename ).

CALL FUNCTION 'SMUM_XML_PARSE'
  EXPORTING
    xml_input = lo_xml->get_document_xml_string( )
  TABLES
    return    = lt_return
    xml_table = lt_xml_data.
```

### Display XML in Browser

```abap
cl_soap_xml_helper=>xml_show(
  xml_xstring = lv_xml_xstring ).
```

### ABAP to XML

```abap
DATA(lv_xml) = cl_proxy_xml_transform=>abap_to_xml_xstring(
  abap_data = ls_structure ).
```

---

## Regular Expressions

### Replace Non-Alphanumeric

```abap
REPLACE ALL OCCURRENCES OF REGEX '[^\w]+' IN lv_str WITH '_'.
```

### Using cl_abap_matcher

```abap
DATA(lo_matcher) = cl_abap_matcher=>create(
  pattern     = '<placeholder>'
  text        = lv_text
  ignore_case = abap_true ).

IF lo_matcher->replace_all( ' and ' ) > 0.
  DATA(lv_result) = lo_matcher->text.
ENDIF.
```

### Extract Submatches

```abap
DATA(lo_matcher) = cl_abap_matcher=>create(
  pattern = '^/category/([0-9]+)/item/([0-9]+)$'
  text    = '/category/12345/item/12' ).

IF lo_matcher->match( ).
  DATA(lv_category) = lo_matcher->get_submatch( 1 ).  " 12345
  DATA(lv_item) = lo_matcher->get_submatch( 2 ).      " 12
ENDIF.
```

### Remove HTML Tags

```abap
DATA(lo_matcher) = cl_abap_matcher=>create(
  pattern = '<([!A-Za-z][A-Za-z0-9]*)|</([A-Za-z][A-Za-z0-9]*)>'
  text    = lv_html ).
lo_matcher->replace_all( '' ).
```

### Common Patterns

| Pattern | Purpose |
|---------|---------|
| `[^\w]+` | Non-alphanumeric characters |
| `\s` | Whitespace |
| `[0-9]` | Digits |
| `^(AA\|BB).*$` | String prefix match |
| `\d{5}` | German postal code |

---

## Exception Handling

### TRY...CATCH Block

```abap
TRY.
    " Risky operation
    DATA(lv_result) = 1 / 0.
  CATCH cx_sy_zerodivide INTO DATA(lx_error).
    " Handle exception
    DATA(lv_msg) = lx_error->get_text( ).
ENDTRY.
```

### Custom Exception Class

```abap
CLASS lcx_custom_error DEFINITION
  INHERITING FROM cx_static_check.
  PUBLIC SECTION.
    DATA mv_custom_field TYPE string.
    METHODS constructor
      IMPORTING
        iv_custom_field TYPE string OPTIONAL.
ENDCLASS.

" Raising
RAISE EXCEPTION TYPE lcx_custom_error
  EXPORTING iv_custom_field = 'Error details'.
```

### Using CX_T100_MSG

```abap
CLASS lcx_message DEFINITION
  INHERITING FROM cx_t100_msg.
  PUBLIC SECTION.
    CONSTANTS:
      BEGIN OF error_occurred,
        msgid TYPE symsgid VALUE 'ZMSG',
        msgno TYPE symsgno VALUE '001',
        attr1 TYPE scx_attrname VALUE 'MV_ATTR1',
      END OF error_occurred.
ENDCLASS.
```

---

## Performance Optimization

### Field Symbols vs. References

```abap
" Faster: Field symbols
LOOP AT it_data ASSIGNING FIELD-SYMBOL(<ls_data>).
  <ls_data>-field = 'value'.
ENDLOOP.

" Slower: References
LOOP AT it_data REFERENCE INTO DATA(lr_data).
  lr_data->field = 'value'.
ENDLOOP.
```

### COLLECT for Deduplication

```abap
" Fastest approach - uses internal hash table
COLLECT ls_line INTO it_aggregated.
```

### Table Copy Efficiency

```abap
" Most efficient: Direct assignment
it_target = it_source.

" Also efficient: CORRESPONDING
it_target = CORRESPONDING #( it_source ).
```

### SQL Best Practices

1. Use JOINs instead of FOR ALL ENTRIES
2. Use WHERE conditions early
3. Limit result sets with UP TO n ROWS
4. Use indexes appropriately
5. Avoid SELECT * when possible

---

## Useful Classes Reference

| Class | Purpose |
|-------|---------|
| `cl_abap_matcher` | Regular expressions |
| `cl_abap_codepage` | Codepage conversion |
| `/ui2/cl_json` | JSON serialization |
| `xco_cp_json` | Modern JSON handling |
| `cl_xml_document` | XML processing |
| `cl_salv_table` | ALV display |
| `cl_gui_alv_grid` | ALV grid control |
| `cl_abap_typedescr` | Runtime type info |
| `cl_shdb_seltab` | RANGES to WHERE |

---

*Source: [https://codezentrale.de/category/sap/sap-abap/*](https://codezentrale.de/category/sap/sap-abap/*)
