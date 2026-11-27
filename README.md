# 刘迷糊｜冥想手账

当前版本 **2.0.0**。四个页签为我与冥想、科学冥想、志同道合、授权与合作。

公开主页：[刘迷糊｜冥想手账](https://meditation.mihuspace.com/)

## 本地预览与维护

手账为静态网站，无安装依赖或构建步骤。

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

- `dist/index.html`：封面、正文素材、相册和微信联系窗口。
- `dist/app.js`：页序、各页正文编排及翻页、弹层和相册交互。
- `dist/style.css`：手账视觉及响应式布局。
- `dist/assets/`：页面使用的插画、纹理、字体和二维码。
- `scripts/check.py`：发布前检查。
- `CHANGELOG.md`：正式版本记录。

团体冥想介绍包含六张正式海报。修改文案时请检查字体子集覆盖。

## 近期活动

每次更新近期活动时，编辑 `dist/current-recommendation.json`。`title`、`summary` 和 `sections` 提供给见己等调用方。选填的 `image`、`qrImage` 和 `actionText` 可以按当期内容增减。二维码图片可以使用随站发布的素材，见己负责展示外框。

手账通过选填的 `target.page` 确定封面跳转的页码，并给对应页签加上「正好」胶带。省略 `target` 时默认跳到第 8 页。需要直达页内位置时再填 `target.section`。例如，`life` 是第 8 页，`life-reading` 是该页的正念共读区。手账在网页中直接读取 JSON，文件预览使用发布检查生成的本地副本。

发布时将 JSON 放在 Pages 根目录。固定调用地址为 [current-recommendation.json](https://meditation.mihuspace.com/current-recommendation.json)。

## 发布

```sh
node --check dist/app.js
python3 scripts/check.py --sync-recommendation
```

`main` 保存当前代码。通过 `gh-pages` 分支根目录发布 `dist/` 的同版静态文件，通过 GitHub Release 发布其 ZIP 下载包。正式发布前检查四个页签、九页顺序、手机长文、图片切换及联系入口。

文案、插画及微信二维码属于个人主页发布内容。仓耳今楷字体权利归原权利人。公开仓库不代表授予素材再分发许可。
