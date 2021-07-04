import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from '../styles/components/Button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
    return (
        <button
            className={styles.button}
            {...props}
        />
    )
}