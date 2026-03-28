import React from 'react'
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals'

export type ColorPickerColor = {
  r: number
  g: number
  b: number
  a: number
}

export type ColorPickerHsla = {
  h: number
  s: number
  l: number
  a: number
}

export type ColorPickerDetail = {
  value: string
  hex: string
  rgba: ColorPickerColor
  hsla: ColorPickerHsla
  source: 'drag' | 'slider' | 'text' | 'preset' | 'recent' | 'eyedropper'
}

export type ColorPickerState = 'idle' | 'loading' | 'error' | 'success'
export type ColorPickerTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
export type ColorPickerOpenSource = 'api' | 'toggle' | 'outside' | 'escape' | 'apply' | 'attribute'
export type ColorPickerOpenDetail = {
  open: boolean
  previousOpen: boolean
  source: ColorPickerOpenSource
}

export type ColorPickerElement = HTMLElement & {
  setColor: (value: string) => void
  getColor: () => { hex: string; rgba: ColorPickerColor; hsva: { h: number; s: number; v: number; a: number } }
  openPopover: () => void
  closePopover: () => void
}

export type ColorPickerProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput' | 'onOpen' | 'onClose' | 'onInvalid'> & {
  value?: string
  format?: 'hex' | 'rgb' | 'hsl'
  alpha?: boolean
  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'contrast'
  state?: ColorPickerState
  tone?: ColorPickerTone
  mode?: 'inline' | 'popover'
  open?: boolean
  closeOnEscape?: boolean
  placeholder?: string
  presets?: string[]
  recent?: boolean
  maxRecent?: number
  persist?: boolean
  onInput?: (detail: ColorPickerDetail) => void
  onChange?: (detail: ColorPickerDetail) => void
  onValueChange?: (value: string) => void
  onOpen?: () => void
  onClose?: () => void
  onOpenDetail?: (detail: ColorPickerOpenDetail) => void
  onCloseDetail?: (detail: ColorPickerOpenDetail) => void
  onInvalid?: (detail: { raw: string; reason: string }) => void
}

export const ColorPicker = React.forwardRef<ColorPickerElement, ColorPickerProps>(function ColorPicker(
  {
    value,
    format,
    alpha,
    disabled,
    readOnly,
    size,
    variant,
    state,
    tone,
    mode,
    open,
    closeOnEscape,
    placeholder,
    presets,
    recent,
    maxRecent,
    persist,
    onInput,
    onChange,
    onValueChange,
    onOpen,
    onClose,
    onOpenDetail,
    onCloseDetail,
    onInvalid,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<ColorPickerElement>(forwardedRef)

  const handleInput = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<ColorPickerDetail>(event)
    if (!detail) return
    onInput?.(detail)
  }, [onInput])

  const handleChange = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<ColorPickerDetail>(event)
    if (!detail) return
    onChange?.(detail)
    onValueChange?.(detail.value)
  }, [onChange, onValueChange])

  const handleInvalid = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ raw: string; reason: string }>(event)
    if (!detail) return
    onInvalid?.(detail)
  }, [onInvalid])

  const handleOpen = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<ColorPickerOpenDetail>(event)
    onOpen?.()
    if (detail) onOpenDetail?.(detail)
  }, [onOpen, onOpenDetail])

  const handleClose = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<ColorPickerOpenDetail>(event)
    onClose?.()
    if (detail) onCloseDetail?.(detail)
  }, [onClose, onCloseDetail])

  useElementEventListeners(
    ref,
    [
      { type: 'input', listener: handleInput },
      { type: 'change', listener: handleChange },
      { type: 'open', listener: handleOpen },
      { type: 'close', listener: handleClose },
      { type: 'invalid', listener: handleInvalid },
    ],
    [handleInput, handleChange, handleOpen, handleClose, handleInvalid]
  )

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'value', value ?? null)
    syncStringAttribute(el, 'format', format && format !== 'hex' ? format : null)
    syncBooleanAttribute(el, 'alpha', alpha)
    syncBooleanAttribute(el, 'disabled', disabled)
    syncBooleanAttribute(el, 'readonly', readOnly)
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null)
    syncStringAttribute(el, 'variant', variant && variant !== 'default' ? variant : null)
    syncStringAttribute(el, 'state', state && state !== 'idle' ? state : null)
    syncStringAttribute(el, 'tone', tone && tone !== 'brand' ? tone : null)
    syncStringAttribute(el, 'mode', mode && mode !== 'inline' ? mode : null)
    if (typeof open === 'boolean') syncBooleanAttribute(el, 'open', open)
    else syncStringAttribute(el, 'open', null)
    syncStringAttribute(el, 'close-on-escape', typeof closeOnEscape === 'boolean' ? (closeOnEscape ? 'true' : 'false') : null)
    syncStringAttribute(el, 'placeholder', placeholder ?? null)
    syncBooleanAttribute(el, 'recent', recent)
    syncStringAttribute(el, 'max-recent', typeof maxRecent === 'number' ? String(maxRecent) : null)
    syncBooleanAttribute(el, 'persist', persist)
    syncJsonAttribute(el, 'presets', presets && presets.length > 0 ? presets : null)
  }, [
    value,
    format,
    alpha,
    disabled,
    readOnly,
    size,
    variant,
    state,
    tone,
    mode,
    open,
    closeOnEscape,
    placeholder,
    presets,
    recent,
    maxRecent,
    persist
  ])

  const initialAttrs: Record<string, unknown> = { ref, ...rest }
  if (mode && mode !== 'inline') initialAttrs.mode = mode
  if (typeof open === 'boolean' && open) initialAttrs.open = ''
  if (value != null) initialAttrs.value = value
  if (format && format !== 'hex') initialAttrs.format = format
  if (alpha) initialAttrs.alpha = ''
  if (disabled) initialAttrs.disabled = ''
  if (readOnly) initialAttrs.readonly = ''
  if (size && size !== 'md') initialAttrs.size = size
  if (variant && variant !== 'default') initialAttrs.variant = variant
  if (state && state !== 'idle') initialAttrs.state = state
  if (tone && tone !== 'brand') initialAttrs.tone = tone
  if (placeholder) initialAttrs.placeholder = placeholder
  if (typeof closeOnEscape === 'boolean') initialAttrs['close-on-escape'] = closeOnEscape ? 'true' : 'false'
  if (recent) initialAttrs.recent = ''
  if (typeof maxRecent === 'number') initialAttrs['max-recent'] = String(maxRecent)
  if (persist) initialAttrs.persist = ''
  if (presets && presets.length > 0) {
    try {
      initialAttrs.presets = JSON.stringify(presets)
    } catch {
      // ignore invalid presets serialization
    }
  }

  return React.createElement('ui-color-picker', initialAttrs, children)
})

ColorPicker.displayName = 'ColorPicker'

export default ColorPicker
