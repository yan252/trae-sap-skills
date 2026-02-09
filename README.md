# SAP Skills 仓库

由于此项目主要只在TRAE中使用，所以用中文说明。

此仓库包含各种SAP技术的综合技能，基于原始项目 `https://skills.sh/secondsky/sap-skills` 进行修改，以确保与Trae IDE的兼容性。

## 项目概述

此仓库提供了一系列SAP相关技术的技能，包括ABAP、CDS、Fiori、HANA、BTP等。每个技能都在其自己的目录中组织，包含详细的文档和参考材料。

## 在TRAE中的安装步骤

1. 到用户的TRAE的技能目录：
   ```
   cd C:\Users\（用户名）\.trae-cn\skills
   ```

2. 下载项目：
   ```
   git clone https://github.com/yan252/trae-sap-skills.git
   ```

3. 在trae的设置-》技能中刷新，就能看到新增加的所有技能

## 已做的修改

为确保与Trae IDE的兼容性，对原始项目进行了以下修改：

1. **文件结构优化**：重构目录以确保在Trae IDE中正确加载
2. **参考文件更新**：更新参考文件以使用兼容格式
3. **插件配置修复**：调整 `.claude-plugin/plugin.json` 文件以确保正确集成
4. **文件编码修正**：确保所有文件使用UTF-8编码
5. **跨平台兼容性**：增加对Windows文件路径和行尾的兼容性
6. **参考链接更新**：更新文档链接以确保可访问性
7. **模板文件修复**：修正模板文件以在Trae环境中正常工作

## 可用技能

### 核心SAP技能

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| **clean-abap** | ABAP cleaner Plug-in for ABAP Development Tools | `clean-abap/` |
| **sap-abap** | 全面的ABAP开发技能，涵盖经典和现代ABAP | `sap-abap/` |
| **sap-abap-cds** | ABAP核心数据服务，用于数据建模和注解 | `sap-abap-cds/` |
| **sap-sqlscript** | SAP HANA SQLScript，用于存储过程和数据库函数 | `sap-sqlscript/` |
| **sapui5** | SAPUI5/OpenUI5前端开发框架 | `sapui5/` |
| **sapui5-cli** | UI5 Tooling CLI，用于SAPUI5/OpenUI5项目管理 | `sapui5-cli/` |

### SAP BTP（业务技术平台）技能

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| **sap-btp-developer-guide** | BTP应用开发综合指南 | `sap-btp-developer-guide/` |
| **sap-btp-cloud-platform** | SAP BTP云平台服务和基础设施 | `sap-btp-cloud-platform/` |
| **sap-btp-connectivity** | BTP连接服务和云连接器 | `sap-btp-connectivity/` |
| **sap-btp-integration-suite** | SAP集成套件，用于云集成 | `sap-btp-integration-suite/` |
| **sap-btp-service-manager** | BTP服务实例的服务管理器 | `sap-btp-service-manager/` |
| **sap-btp-job-scheduling** | BTP的作业调度服务 | `sap-btp-job-scheduling/` |
| **sap-btp-master-data-integration** | 主数据集成服务 | `sap-btp-master-data-integration/` |
| **sap-btp-cloud-logging** | BTP应用的云日志服务 | `sap-btp-cloud-logging/` |
| **sap-btp-cloud-transport-management** | 云传输管理服务 | `sap-btp-cloud-transport-management/` |
| **sap-btp-cias** | 云集成自动化服务 | `sap-btp-cias/` |
| **sap-btp-intelligent-situation-automation** | 智能情境自动化 | `sap-btp-intelligent-situation-automation/` |
| **sap-btp-best-practices** | BTP开发最佳实践 | `sap-btp-best-practices/` |

### 数据和分析技能

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| **sap-hana-cli** | SAP HANA开发人员CLI，用于数据库操作 | `sap-hana-cli/` |
| **sap-hana-cloud-data-intelligence** | SAP数据智能云，用于数据处理 | `sap-hana-cloud-data-intelligence/` |
| **sap-hana-ml** | SAP HANA机器学习Python客户端 | `sap-hana-ml/` |
| **sap-datasphere** | SAP Datasphere，用于数据仓库和分析 | `sap-datasphere/` |

### 应用开发技能

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| **sap-cap-capire** | SAP云应用编程模型 | `sap-cap-capire/` |
| **sap-fiori-tools** | SAP Fiori工具，用于前端开发 | `sap-fiori-tools/` |
| **sap-fiori-url-generator** | Fiori启动板URL生成器 | `sap-fiori-url-generator/` |
| **sap-api-style** | SAP API风格指南，用于API文档 | `sap-api-style/` |

### AI和高级技能

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| **sap-ai-core** | SAP AI Core，用于AI/ML模型部署 | `sap-ai-core/` |
| **sap-cloud-sdk-ai** | SAP云SDK，用于AI集成 | `sap-cloud-sdk-ai/` |
| **clean-abap** | 干净的ABAP编码指南和最佳实践 | `clean-abap/` |

### SAP Analytics Cloud技能

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| **sap-sac-custom-widget** | SAP Analytics Cloud的自定义部件 | `sap-sac-custom-widget/` |
| **sap-sac-planning** | SAP Analytics Cloud规划功能 | `sap-sac-planning/` |
| **sap-sac-scripting** | SAC Analytics Designer脚本 | `sap-sac-scripting/` |

## 目录结构

每个技能遵循一致的目录结构：

```
skill-name/
├── .claude-plugin/        # 插件配置
│   └── plugin.json         # 插件元数据和配置
├── references/             # 详细参考文件
│   ├── file1.md            # 参考文档
│   └── file2.md            # 其他参考材料
├── templates/              # 模板文件（可选）
│   └── template1.md        # 代码或配置模板
├── README.md               # 技能概述和关键词
└── SKILL.md                # 主技能文件，包含快速参考
```

## 使用方法

在Trae IDE中使用这些技能：

1. 导航到特定技能目录
2. 参考 `README.md` 了解技能概述
3. 查阅 `SKILL.md` 文件获取快速参考信息
4. 浏览 `references/` 目录获取详细文档
5. 使用 `templates/` 目录获取代码模板和示例

## 主要功能

- **全面的文档**：每个技能都包含详细的文档和参考材料
- **代码模板**：现成的代码模板，用于常见任务
- **最佳实践**：遵循SAP推荐的最佳实践和编码标准
- **跨平台兼容性**：在Windows和Linux环境中都能工作
- **Trae IDE兼容**：为在Trae IDE中使用而优化

## 技术要求

- **Trae IDE**：最新版本
- **SAP系统访问**：用于实际测试（可选）
- **互联网连接**：用于访问在线文档参考

## 许可证

此项目使用GPL-3.0许可证。有关详细信息，请参阅存储库根目录中的LICENSE文件。

## 致谢

- 基于原始SAP Skills项目：`https://skills.sh/secondsky/sap-skills`
- SAP社区专家的贡献
- SAP官方文档和最佳实践

## 版本信息

- **项目版本**：1.0.0
- **最后更新**：2026-02-09
- **兼容性**：Trae IDE v1.0+

---

有关各个技能的更多信息，请参阅相应的技能目录及其文档文件。