# 卡划算 Render 部署版

这是卡划算 TOC 网站的独立发布包，包含：

- C 端前台：`/`
- 后台：`/admin.html`
- C 端申办接口：`/api/kahuasuan/leads`
- B 端银行经理报名接口：`/api/kahuasuan/managers`
- 后台数据接口：`/api/kahuasuan/admin?token=后台口令`

## Render 设置

- Runtime: Python
- Build Command: 留空
- Start Command: `python server.py`
- Health Check Path: `/healthz`

## 后台口令

Render Blueprint 会自动生成 `KHS_ADMIN_TOKEN`。

发布后到 Render 控制台的 Environment 查看该变量，后台登录时使用它。

## 数据说明

当前版本使用服务本地 JSON 文件存储报名数据：

- `data/consumer-leads.json`
- `data/manager-signups.json`

Render 免费实例重建后，本地文件可能丢失。正式投放前建议接入数据库或表单服务。
