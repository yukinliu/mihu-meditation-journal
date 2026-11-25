# 刘迷糊｜冥想手账

当前版本 **1.5.0**。四个页签为我与冥想、科学练冥想、正念生活、合作与培训。

公开主页：[刘迷糊｜冥想手账](https://yukinliu.github.io/mihu-meditation-journal/)

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

## 发布

```sh
node --check dist/app.js
python3 scripts/check.py
```

`main` 保存当前代码。通过 `gh-pages` 分支根目录发布 `dist/` 的同版静态文件，通过 GitHub Release 发布其 ZIP 下载包。正式发布前检查四个页签、九页顺序、手机长文、图片切换及联系入口。

文案、插画及微信二维码属于个人主页发布内容。仓耳今楷字体权利归原权利人。公开仓库不代表授予素材再分发许可。
