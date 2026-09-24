import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from '../../utils/buttonStyles'

type StyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonProps = StyleProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...rest}
    />
  )
}

type ButtonLinkProps = StyleProps & {
  to: string
  className?: string
  children: ReactNode
}

export function ButtonLink({
  to,
  variant,
  size,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  )
}