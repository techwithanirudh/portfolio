'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import * as React from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'

const SHAKE_MS = 380
const SHAKE_OFFSETS = [0, -6, 5, -4, 3, -2, 0]

const shake = (element: HTMLElement) =>
  element.animate(
    { transform: SHAKE_OFFSETS.map((x) => `translateX(${x}px)`) },
    { duration: SHAKE_MS, easing: 'ease-out' }
  )

const Form = FormProvider

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const value = React.useMemo(() => ({ name: props.name }), [props.name])

  return (
    <FormFieldContext.Provider value={value}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { hasDescription, id, setHasDescription } = itemContext

  return {
    hasDescription,
    id,
    setHasDescription,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

interface FormItemContextValue {
  /** Whether a FormDescription is mounted, so aria-describedby only names ids that exist */
  hasDescription: boolean
  id: string
  setHasDescription: (mounted: boolean) => void
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()
  const [hasDescription, setHasDescription] = React.useState(false)
  const value = React.useMemo(
    () => ({ hasDescription, id, setHasDescription }),
    [hasDescription, id]
  )

  return (
    <FormItemContext.Provider value={value}>
      <div
        className={cn('grid gap-2', className)}
        data-slot='form-item'
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      className={cn('data-[error=true]:text-destructive', className)}
      data-error={!!error}
      data-slot='form-label'
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({
  children,
  className,
}: {
  children: React.ReactElement
  className?: string
}) {
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
    hasDescription,
  } = useFormField()
  const { submitCount } = useFormState()

  const replayShake = React.useEffectEvent(() => {
    if (!error || prefersReducedMotion()) {
      return
    }
    const control = document.getElementById(formItemId)
    if (control) {
      shake(control)
    }
  })

  // Every failed submit shakes each invalid field again, even one that was
  // already invalid. Typing never triggers it
  React.useEffect(() => {
    if (submitCount > 0) {
      replayShake()
    }
  }, [submitCount])

  return React.cloneElement(
    children,
    mergeProps(
      {
        'aria-describedby':
          [hasDescription && formDescriptionId, error && formMessageId]
            .filter(Boolean)
            .join(' ') || undefined,
        'aria-invalid': !!error,
        className,
        'data-slot': 'form-control',
        id: formItemId,
      },
      children.props as Record<string, unknown>
    )
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId, setHasDescription } = useFormField()

  React.useLayoutEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])

  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='form-description'
      id={formDescriptionId}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : props.children

  if (!body) {
    return null
  }

  return (
    <p
      className={cn('text-destructive text-sm', className)}
      data-slot='form-message'
      id={formMessageId}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
