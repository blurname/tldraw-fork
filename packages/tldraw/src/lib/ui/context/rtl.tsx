import { createContext, ReactNode, useContext } from 'react'
import { useCurrentTranslation } from '../hooks/useTranslation/useTranslation'

/**
 * RTL 上下文类型定义
 */
type TLUiRtlContextType = {
	/** 当前文本方向 */
	dir: 'ltr' | 'rtl'
	/** 是否为 RTL 模式 */
	isRtl: boolean
}

/**
 * RTL 上下文
 */
const TldrawUiRtlContext = createContext<TLUiRtlContextType | null>(null)

/**
 * RTL 上下文提供者属性
 */
type TldrawUiRtlProviderProps = {
	children: ReactNode
}

/**
 * RTL 上下文提供者组件
 * 根据当前翻译自动检测并提供 RTL 支持
 */
export function TldrawUiRtlProvider({ children }: TldrawUiRtlProviderProps) {
	const translation = useCurrentTranslation()
	const dir = translation.dir
	const isRtl = dir === 'rtl'

	return (
		<TldrawUiRtlContext.Provider value={{ dir, isRtl }}>{children}</TldrawUiRtlContext.Provider>
	)
}

/**
 * 获取当前 RTL 状态的 Hook
 * @returns RTL 上下文对象，包含 dir 和 isRtl 属性
 */
export function useRtl(): TLUiRtlContextType {
	const context = useContext(TldrawUiRtlContext)
	if (!context) {
		throw new Error('useRtl must be used within TldrawUiRtlProvider')
	}
	return context
}

/**
 * 获取当前文本方向的 Hook
 * @returns 'ltr' | 'rtl'
 */
export function useDir(): 'ltr' | 'rtl' {
	return useRtl().dir
}

/**
 * 检查是否为 RTL 模式的 Hook
 * @returns boolean
 */
export function useIsRtl(): boolean {
	return useRtl().isRtl
}
