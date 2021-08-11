import { useState } from "react";
import Image from 'next/image'

import { Button } from "./Button";
import { FiUser } from 'react-icons/fi'

import styles from '../styles/components/ProfileButton.module.scss'
import { useStreamer } from "../hooks/useStreamer";

export function ProfileButton() {

    const [isOpen, setIsOpen] = useState(false)
    const { currentUser } = useStreamer()

    function handleShowStreamerName() {
        setIsOpen(true)
    }

    function handleHideStreamerName() {
        setIsOpen(false)
    }

    return (
        <Button
            className={styles.profileButton}
            onMouseEnter={handleShowStreamerName}
            onMouseLeave={handleHideStreamerName}
        >
            { currentUser?.imageUrl ? (
                <picture>
                    <Image
                        width={50}
                        height={50}
                        src={currentUser.imageUrl}
                        alt="User Picture"
                        objectFit="cover"
                    />
                </picture>
            ) : (
                <FiUser size={32} color="var(--text)" />
            ) }
            
            { isOpen && <span>{currentUser.name}</span> }
            
        </Button>
    )
}