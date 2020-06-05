/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useRef, useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Popover from '../popover';

function Dropdown( {
	renderContent,
	renderToggle,
	position = 'bottom right',
	className,
	contentClassName,
	expandOnMobile,
	headerTitle,
	focusOnMount,
	popoverProps,
	onClose,
	onToggle,
} ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const containerRef = useRef();
	const previousOpenRef = useRef();
	useEffect( () => {
		previousOpenRef.current = isOpen;
		if ( previousOpenRef.current !== isOpen && onToggle ) {
			onToggle( isOpen );
		}
		return () => {
			if ( isOpen && onToggle ) {
				onToggle( false );
			}
		};
	}, [] );
	const close = () => {
		if ( onClose ) {
			onClose();
		}
		setIsOpen( false );
	};
	const toggle = () => {
		setIsOpen( ! isOpen );
	};

	/**
	 * Closes the dropdown if a focus leaves the dropdown wrapper. This is
	 * intentionally distinct from `onClose` since focus loss from the popover
	 * is expected to occur when using the Dropdown's toggle button, in which
	 * case the correct behavior is to keep the dropdown closed. The same applies
	 * in case when focus is moved to the modal dialog.
	 */
	const closeIfFocusOutside = () => {
		if (
			! containerRef.current.contains( document.activeElement ) &&
			! document.activeElement.closest( '[role="dialog"]' )
		) {
			close();
		}
	};
	const args = { isOpen, onToggle: toggle, onClose: close };

	return (
		<div
			className={ classnames( 'components-dropdown', className ) }
			ref={ containerRef }
		>
			{ renderToggle( args ) }
			{ isOpen && (
				<Popover
					position={ position }
					onClose={ close }
					onFocusOutside={ closeIfFocusOutside }
					expandOnMobile={ expandOnMobile }
					headerTitle={ headerTitle }
					focusOnMount={ focusOnMount }
					isAlternate
					{ ...popoverProps }
					className={ classnames(
						'components-dropdown__content',
						popoverProps ? popoverProps.className : undefined,
						contentClassName
					) }
				>
					{ renderContent( args ) }
				</Popover>
			) }
		</div>
	);
}

export default Dropdown;
