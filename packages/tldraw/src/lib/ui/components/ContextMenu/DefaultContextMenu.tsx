import { preventDefault, useContainer, useEditor, useEditorComponents } from '@tldraw/editor'
import { ContextMenu as _ContextMenu } from 'radix-ui'
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react'
import { useDir } from '../../context/rtl'
import { useMenuIsOpen } from '../../hooks/useMenuIsOpen'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { TldrawUiMenuContextProvider } from '../primitives/menus/TldrawUiMenuContext'
import { DefaultContextMenuContent } from './DefaultContextMenuContent'

/** @public */
export interface TLUiContextMenuProps {
	children?: ReactNode
	disabled?: boolean
}

/** @public @react */
export const DefaultContextMenu = memo(function DefaultContextMenu({
	children,
	disabled = false,
}: TLUiContextMenuProps) {
	const editor = useEditor()
	const msg = useTranslation()

	const { Canvas } = useEditorComponents()

	// When hitting `Escape` while the context menu is open, we want to prevent
	// the default behavior of losing focus on the shape. Otherwise,
	// it's pretty annoying from an accessibility perspective.
	const preventEscapeFromLosingShapeFocus = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation()
				editor.getContainer().focus()
			}
		},
		[editor]
	)

	useEffect(() => {
		return () => {
			// Cleanup the event listener when the component unmounts.
			document.body.removeEventListener('keydown', preventEscapeFromLosingShapeFocus, {
				capture: true,
			})
		}
	}, [preventEscapeFromLosingShapeFocus])

	const cb = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				const onlySelectedShape = editor.getOnlySelectedShape()

				if (onlySelectedShape && editor.isShapeOrAncestorLocked(onlySelectedShape)) {
					editor.setSelectedShapes([])
				}

				editor.timers.requestAnimationFrame(() => {
					document.body.removeEventListener('keydown', preventEscapeFromLosingShapeFocus, {
						capture: true,
					})
				})
			} else {
				document.body.addEventListener('keydown', preventEscapeFromLosingShapeFocus, {
					capture: true,
				})

				// Weird route: selecting locked shapes on long press
				if (editor.getInstanceState().isCoarsePointer) {
					const selectedShapes = editor.getSelectedShapes()
					const {
						inputs: { currentPagePoint },
					} = editor

					// get all of the shapes under the current pointer
					const shapesAtPoint = editor.getShapesAtPoint(currentPagePoint)

					if (
						// if there are no selected shapes
						!editor.getSelectedShapes().length ||
						// OR if none of the shapes at the point include the selected shape
						!shapesAtPoint.some((s) => selectedShapes.includes(s))
					) {
						// then are there any locked shapes under the current pointer?
						const lockedShapes = shapesAtPoint.filter((s) => editor.isShapeOrAncestorLocked(s))

						if (lockedShapes.length) {
							// nice, let's select them
							editor.select(...lockedShapes.map((s) => s.id))
						}
					}
				}
			}
		},
		[editor, preventEscapeFromLosingShapeFocus]
	)

	const container = useContainer()
	const [isOpen, handleOpenChange] = useMenuIsOpen('context menu', cb)

	// Get the context menu content, either the default component or the user's
	// override. If there's no menu content, then the user has set it to null,
	// so skip rendering the menu.
	const content = children ?? <DefaultContextMenuContent />

	const dir = useDir()

	// 用于获取菜单元素的引用
	const menuRef = useRef<HTMLDivElement>(null)
	// 存储菜单的宽度
	const [menuWidth, setMenuWidth] = useState<number>(0)

	/**
	 * 当菜单打开时，计算菜单的实际宽度
	 */
	useEffect(() => {
		if (isOpen && menuRef.current) {
			const rect = menuRef.current.getBoundingClientRect()
			setMenuWidth(rect.width)
		}
	}, [isOpen])

	/**
	 * 根据 RTL 模式和菜单宽度设置水平偏移量
	 * 在 RTL 模式下使用菜单宽度作为负偏移量，让菜单出现在光标左侧
	 * 在 LTR 模式下使用默认偏移量
	 */
	const getAlignOffset = useCallback(() => {
		if (dir === 'rtl' && menuWidth > 0) {
			// 使用实际菜单宽度加上更多间距，避免菜单出现在光标上方
			return -(menuWidth + 20)
		}
		return -4
	}, [dir, menuWidth])

	return (
		<_ContextMenu.Root dir={dir} onOpenChange={handleOpenChange} modal={false}>
			<_ContextMenu.Trigger onContextMenu={undefined} dir={'ltr'} disabled={disabled}>
				{Canvas ? <Canvas /> : null}
			</_ContextMenu.Trigger>
			{isOpen && (
				<_ContextMenu.Portal container={container}>
					<_ContextMenu.Content
						ref={menuRef}
						className="tlui-menu tlui-scrollable"
						data-testid="context-menu"
						aria-label={msg('context-menu.title')}
						// alignOffset={getAlignOffset()}
						collisionPadding={4}
						onContextMenu={preventDefault}
						data-dir={dir}
					>
						<TldrawUiMenuContextProvider type="context-menu" sourceId="context-menu">
							{content}
						</TldrawUiMenuContextProvider>
					</_ContextMenu.Content>
				</_ContextMenu.Portal>
			)}
		</_ContextMenu.Root>
	)
})
