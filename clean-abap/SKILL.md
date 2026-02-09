---
name: clean-abap
description: Check ABAP code for compliance with Clean ABAP principles. Use this skill when users ask to check, validate, review, or analyze ABAP code for clean code compliance, code quality, best practices, or adherence to Clean ABAP guidelines. Triggers include requests like "check this ABAP code", "is this clean ABAP", "review my ABAP for clean code", "validate ABAP against clean code principles", or "analyze ABAP code quality".
---

# Clean ABAP

This skill provides comprehensive checking of ABAP code against Clean ABAP principles, based on the Clean ABAP style guide which adapts Robert C. Martin's Clean Code for ABAP.

## How to Use This Skill

When checking ABAP code for Clean ABAP compliance:

1. **Read code** provided by the user
2. **Categorize issues** by Clean ABAP sections (Names, Language, Constants, Variables, Tables, Strings, Booleans, Conditions, Ifs, Classes, Methods, Error Handling, Comments, Formatting, Testing)
3. **Identify violations** with specific line references when available
4. **Provide actionable recommendations** with code examples showing both problem and clean solution
5. **Prioritize issues** by impact (critical, major, minor)

## Check Categories

### 1. Names

**Key Principles:**
- Use descriptive names that convey content and meaning
- Prefer solution domain and problem domain terms
- Use pronounceable names
- Use snake_case consistently
- Avoid abbreviations unless necessary
- Use nouns for classes, verbs for methods
- Avoid noise words like "data", "info", "object"
- Pick one word per concept
- Avoid encodings (Hungarian notation, prefixes like iv_, rv_, lt_)
- Avoid obscuring built-in functions

**Check for:**
- Non-descriptive variable/method/class names (e.g., `data1`, `temp`, `x`)
- Inconsistent abbreviations across code
- Mixed naming conventions (not snake_case)
- Noise words in names
- Hungarian notation or unnecessary prefixes (iv_, ev_, rv_, lt_, ls_)
- Method names that obscure ABAP built-in functions

### 2. Language

**Key Principles:**
- Prefer object orientation to procedural programming
- Prefer functional to procedural language constructs
- Avoid obsolete language elements
- Use design patterns wisely

**Check for:**
- Use of obsolete statements (unescaped host variables in SELECT, etc.)
- Procedural code that should be object-oriented
- Use of old-style MOVE instead of assignment
- TRANSLATE instead of to_upper()/to_lower()
- CREATE OBJECT instead of NEW
- Old-style READ TABLE instead of table expressions

### 3. Constants

**Key Principles:**
- Use constants instead of magic numbers
- Constants need descriptive names
- Prefer ENUM to constants interfaces
- Group related constants

**Check for:**
- Magic numbers or string literals in code
- Constants with non-descriptive names (c_01, c_x, etc.)
- Ungrouped constants that should be in BEGIN OF/END OF blocks

### 4. Variables

**Key Principles:**
- Prefer inline to up-front declarations
- Don't use variables outside their declaration block
- Don't chain up-front declarations
- Don't use field symbols for dynamic data access (modern ABAP)
- Choose right loop targets (field symbols vs references vs values)

**Check for:**
- Up-front DATA declarations when inline would be clearer
- Variables used outside their declaration block scope
- Chained DATA declarations
- Unnecessary field symbols with ASSIGN

### 5. Tables

**Key Principles:**
- Use the right table type (STANDARD, SORTED, HASHED)
- Avoid DEFAULT KEY
- Prefer INSERT INTO TABLE to APPEND TO
- Prefer LINE_EXISTS to READ TABLE or LOOP AT
- Prefer READ TABLE to LOOP AT
- Prefer LOOP AT WHERE to nested IF
- Avoid unnecessary table reads

**Check for:**
- Tables with DEFAULT KEY
- APPEND TO when INSERT INTO TABLE is more appropriate
- Nested LOOP AT when READ TABLE would be clearer
- Unnecessary table reads or redundant data access

### 6. Strings

**Key Principles:**
- Use string templates instead of CONCATENATE
- Use string functions instead of manual string manipulation
- Use |...| for string templates
- Use &...& for text symbols

**Check for:**
- CONCATENATE statements (should use string templates)
- Manual string length calculations
- String manipulation that could use built-in functions

### 7. Booleans

**Key Principles:**
- Use ABAP_BOOL type
- Use descriptive boolean names (is_, has_, can_, should_)
- Avoid double negatives
- Avoid comparing booleans to true/false

**Check for:**
- Non-boolean types used for flags
- Boolean names that don't indicate state (is_, has_, can_, should_)
- Double negatives in conditions
- Comparing booleans to abap_true/abap_false

### 8. Conditions

**Key Principles:**
- Use xsdbool for boolean expressions
- Use line_exists for table checks
- Prefer early returns to nested IFs
- Use SWITCH for multiple conditions
- Use COND for conditional expressions

**Check for:**
- Complex nested IF conditions that could use SWITCH
- Early return opportunities not used
- Boolean expressions that could use xsdbool
- Table existence checks that should use line_exists

### 9. Ifs

**Key Principles:**
- Avoid nested IFs
- Prefer early returns
- Use ELSE IF instead of nested IF
- Keep IF blocks short
- Extract complex conditions to methods

**Check for:**
- Deeply nested IF statements
- Missing early return opportunities
- ELSE IF opportunities not used
- Long IF blocks that should be extracted

### 10. Classes

**Key Principles:**
- Single Responsibility Principle
- Classes should be small
- Methods should be small
- Minimize dependencies
- Use interfaces for abstraction
- Avoid God classes

**Check for:**
- Classes with too many responsibilities
- Very long methods (>50 lines)
- Excessive dependencies
- Missing interfaces where abstraction would help
- Classes that do too much

### 11. Methods

**Key Principles:**
- Methods should be small
- Methods should do one thing
- Use descriptive names
- Minimize parameters
- Avoid flag arguments
- Prefer returning values to exporting parameters

**Check for:**
- Methods that do multiple things
- Too many parameters (>5)
- Flag arguments (booleans that change behavior)
- Non-descriptive method names
- EXPORTING parameters when RETURNING would be clearer

### 12. Error Handling

**Key Principles:**
- Use class-based exceptions
- Don't swallow exceptions
- Provide meaningful error messages
- Handle errors at appropriate level
- Use RAISE EXCEPTION TYPE

**Check for:**
- CATCH blocks that do nothing
- Generic exception catching without specific handling
- Missing error handling where needed
- Non-class-based exceptions (old-style)
- Unclear error messages

### 13. Comments

**Key Principles:**
- Code should be self-documenting
- Comments explain WHY, not WHAT
- Delete obsolete comments
- Don't comment bad code, fix it
- Use meaningful names instead of comments

**Check for:**
- Comments that explain what the code does (should be self-documenting)
- Obsolete or outdated comments
- Commented-out code that should be deleted
- Comments that could be replaced with better naming

### 14. Formatting

**Key Principles:**
- Follow Pretty Printer standards
- Consistent indentation
- Max line length 120 characters
- One statement per line
- Use Pretty Printer

**Check for:**
- Inconsistent indentation
- Lines longer than 120 characters
- Multiple statements on one line
- Non-standard formatting

### 15. Testing

**Key Principles:**
- Write unit tests
- Test edge cases
- Use test doubles for dependencies
- Keep tests simple
- Test behavior, not implementation

**Check for:**
- Missing unit tests for critical logic
- Tests that are too complex
- Tests that depend on external systems
- Tests that test implementation details

## Issue Prioritization

**Critical Issues:**
- Security vulnerabilities
- Performance problems
- Data corruption risks
- Unhandled exceptions

**Major Issues:**
- Code that is hard to understand
- Violations of core Clean ABAP principles
- Maintainability problems

**Minor Issues:**
- Formatting inconsistencies
- Minor naming improvements
- Small refactoring opportunities

## Example Output Format

When reviewing code, structure your response as:

```
## Clean ABAP Review

### Critical Issues
[Issue 1]
- **Location**: Line X
- **Problem**: Description
- **Solution**: Code example
- **Impact**: Why this matters

### Major Issues
[Issue 2]
...

### Minor Issues
[Issue 3]
...

### Summary
- Critical: X
- Major: Y
- Minor: Z
```

## Related Skills

- **sap-abap**: Use for ABAP language features and syntax
- **sap-abap-cds**: Use for CDS-specific clean code guidelines
- **skill-review**: Use for comprehensive skill quality review

## References

- Clean ABAP Guide: [https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md](https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md)
- Clean Code by Robert C. Martin
- ABAP Programming Guidelines
