/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { IToggleProps } from '../types';
import useFieldContext from '../utils/useFieldContext';
import { InputContext } from '../utils/useInputContext';
import { StyledToggleInput } from '../styled';
import useFieldsetContext from '../utils/useFieldsetContext';

/**
 * @extends InputHTMLAttributes<HTMLInputElement>
 */
export const Toggle = React.forwardRef<HTMLInputElement, IToggleProps>(
  ({ children, ...props }, ref) => {
    const fieldsetContext = useFieldsetContext();
    const fieldContext = useFieldContext();

    let combinedProps = {
      ref,
      ...props,
      ...fieldsetContext
    };

    if (fieldContext) {
      combinedProps = fieldContext.getInputProps(combinedProps);
    }

    return (
      <InputContext.Provider value="toggle">
        <StyledToggleInput {...(combinedProps as any)} />
        {children}
      </InputContext.Provider>
    );
  }
);

Toggle.displayName = 'Toggle';

Toggle.propTypes = {
  isCompact: PropTypes.bool
};
