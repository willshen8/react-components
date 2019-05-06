/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { createContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';
import { withTheme, isRtl } from '@zendeskgarden/react-theming';

import { StyledMenu } from '../styled/index.js';
import useDropdownContext from '../utils/useDropdownContext';
import { getPopperPlacement, getRtlPopperPlacement } from '../utils/garden-placements';

export const MenuContext = createContext();

/**
 * Accepts all `<ul>` props
 */
const Menu = props => {
  const {
    placement,
    popperModifiers,
    eventsEnabled,
    animate,
    maxHeight,
    style: menuStyle,
    zIndex,
    ...otherProps
  } = props;
  const {
    itemIndexRef,
    previousIndexRef,
    nextItemsHashRef,
    popperReferenceElementRef,
    downshift: { isOpen, getMenuProps }
  } = useDropdownContext();
  const scheduleUpdateRef = useRef(undefined);

  useEffect(() => {
    /**
     * Recalculate popper placement while open to allow animations to complete.
     * This must be ran every render to allow for the number of items to change
     * and still be placed correctly.
     **/
    if (isOpen) {
      scheduleUpdateRef.current && scheduleUpdateRef.current();
    }
  });

  // Reset Downshift refs on every render
  itemIndexRef.current = 0;
  nextItemsHashRef.current = {};
  previousIndexRef.current = undefined;

  const popperPlacement = isRtl(props)
    ? getRtlPopperPlacement(placement)
    : getPopperPlacement(placement);

  return (
    <MenuContext.Provider value={{ itemIndexRef }}>
      <Popper
        placement={popperPlacement}
        modifiers={popperModifiers}
        // Disable position updating on scroll events while menu is closed
        eventsEnabled={isOpen && eventsEnabled}
      >
        {({ ref, style, scheduleUpdate, placement: currentPlacement }) => {
          let computedStyle = menuStyle;

          scheduleUpdateRef.current = scheduleUpdate;

          // Calculate custom width if ref is provided from Select or Autocomplete
          if (
            popperReferenceElementRef.current &&
            popperReferenceElementRef.current.getBoundingClientRect
          ) {
            computedStyle = {
              ...menuStyle,
              width: popperReferenceElementRef.current.getBoundingClientRect().width
            };
          }

          let popperStyle = { ...style, zIndex };

          if (!isOpen) {
            popperStyle = { ...style, zIndex: -1, visibility: 'hidden' };
          }

          return (
            <div ref={ref} style={popperStyle}>
              <StyledMenu
                {...getMenuProps({
                  maxHeight,
                  placement: currentPlacement,
                  animate: isOpen && animate, // Triggers animation start when open
                  style: computedStyle,
                  ...otherProps
                })}
              />
            </div>
          );
        }}
      </Popper>
    </MenuContext.Provider>
  );
};

Menu.propTypes = {
  popperModifiers: PropTypes.object,
  eventsEnabled: PropTypes.bool,
  zIndex: PropTypes.number,
  style: PropTypes.object,
  /**
   * These placements differ from the default naming of Popper.JS placements to help
   * assist with RTL layouts.
   **/
  placement: PropTypes.oneOf([
    'auto',
    'top',
    'top-start',
    'top-end',
    'end',
    'end-top',
    'end-bottom',
    'bottom',
    'bottom-start',
    'bottom-end',
    'start',
    'start-top',
    'start-bottom'
  ]),
  animate: PropTypes.bool,
  small: PropTypes.bool,
  hidden: PropTypes.bool,
  arrow: PropTypes.bool,
  maxHeight: PropTypes.string,
  children: PropTypes.node
};

Menu.defaultProps = {
  placement: 'bottom-start',
  animate: true,
  eventsEnabled: true,
  maxHeight: '400px',
  zIndex: 1000
};

export default withTheme(Menu);
