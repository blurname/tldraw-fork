import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

/**
 * RTL (Right-to-Left) 支持示例
 * 展示如何在阿拉伯语等 RTL 语言环境下使用 tldraw
 * 通过设置容器的 dir="rtl" 属性来启用 RTL 布局支持
 */
export default function RTLExample() {
	return (
		<div className="tldraw__editor" dir="rtl" lang="ar">
			<Tldraw />
		</div>
	)
}
